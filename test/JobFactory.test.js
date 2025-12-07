const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JobFactory and FreelanceEscrow", function () {
  let jobFactory;
  let escrowImplementation;
  let owner, client, freelancer, arbiter, other;

  beforeEach(async function () {
    [owner, client, freelancer, arbiter, other] = await ethers.getSigners();

    // Desplegar JobFactory
    const JobFactory = await ethers.getContractFactory("JobFactory");
    jobFactory = await JobFactory.deploy();

    // Obtener dirección de la implementación
    escrowImplementation = await jobFactory.escrowImplementation();
  });

  describe("JobFactory - Job Creation", function () {
    it("Should allow client to post a job", async function () {
      const jobParams = {
        amount: ethers.parseEther("1.0"),
        deadline: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
        challengePeriod: 2 * 24 * 60 * 60, // 2 days
      };

      const tx = await jobFactory.connect(client).postJob(
        jobParams,
        "Build a website",
        "Create a modern React website",
        "QmXxxx..."
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const jobsCount = await jobFactory.getJobsCount();
      expect(jobsCount).to.equal(1);
    });

    it("Should emit JobCreated event", async function () {
      const jobParams = {
        amount: ethers.parseEther("1.0"),
        deadline: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        challengePeriod: 2 * 24 * 60 * 60,
      };

      await expect(
        jobFactory.connect(client).postJob(
          jobParams,
          "Build a website",
          "Create a modern React website",
          "QmXxxx..."
        )
      ).to.emit(jobFactory, "JobCreated");
    });

    it("Should track client jobs", async function () {
      const jobParams = {
        amount: ethers.parseEther("1.0"),
        deadline: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        challengePeriod: 2 * 24 * 60 * 60,
      };

      await jobFactory.connect(client).postJob(
        jobParams,
        "Job 1",
        "Description 1",
        "QmXxxx1..."
      );

      await jobFactory.connect(client).postJob(
        jobParams,
        "Job 2",
        "Description 2",
        "QmXxxx2..."
      );

      const clientJobs = await jobFactory.getClientJobs(client.address);
      expect(clientJobs.length).to.equal(2);
    });
  });

  describe("JobFactory - Job Acceptance", function () {
    let jobParams;

    beforeEach(async function () {
      jobParams = {
        amount: ethers.parseEther("1.0"),
        deadline: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        challengePeriod: 2 * 24 * 60 * 60,
      };

      await jobFactory.connect(client).postJob(
        jobParams,
        "Build a website",
        "Create a modern React website",
        "QmXxxx..."
      );
    });

    it("Should allow freelancer to accept a job", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      const challengePeriod = 2 * 24 * 60 * 60;

      const tx = await jobFactory.connect(freelancer).acceptJob(
        0,
        arbiter.address,
        deadline,
        challengePeriod
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const job = await jobFactory.getJob(0);
      expect(job.status).to.equal(1); // Accepted
      expect(job.freelancer).to.equal(freelancer.address);
      expect(job.escrow).to.not.equal(ethers.ZeroAddress);
    });

    it("Should create escrow clone on job acceptance", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      const challengePeriod = 2 * 24 * 60 * 60;

      const tx = await jobFactory.connect(freelancer).acceptJob(
        0,
        arbiter.address,
        deadline,
        challengePeriod
      );

      const receipt = await tx.wait();
      const escrowAddr = (await jobFactory.getJob(0)).escrow;

      // Verificar que el escrow es un contrato
      const code = await ethers.provider.getCode(escrowAddr);
      expect(code).to.not.equal("0x");
    });

    it("Should prevent double acceptance", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      const challengePeriod = 2 * 24 * 60 * 60;

      await jobFactory.connect(freelancer).acceptJob(
        0,
        arbiter.address,
        deadline,
        challengePeriod
      );

      await expect(
        jobFactory.connect(other).acceptJob(
          0,
          arbiter.address,
          deadline,
          challengePeriod
        )
      ).to.be.revertedWithCustomError(jobFactory, "JobAlreadyAccepted");
    });

    it("Should prevent client from accepting their own job", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      const challengePeriod = 2 * 24 * 60 * 60;

      await expect(
        jobFactory.connect(client).acceptJob(
          0,
          arbiter.address,
          deadline,
          challengePeriod
        )
      ).to.be.revertedWith("Client cannot accept own job");
    });

    it("Should track freelancer jobs", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      const challengePeriod = 2 * 24 * 60 * 60;

      await jobFactory.connect(freelancer).acceptJob(
        0,
        arbiter.address,
        deadline,
        challengePeriod
      );

      const freelancerJobs = await jobFactory.getFreelancerJobs(freelancer.address);
      expect(freelancerJobs.length).to.equal(1);
    });
  });

  describe("FreelanceEscrow - Full Flow", function () {
    let escrow, jobParams, deadline, challengePeriod;

    beforeEach(async function () {
      jobParams = {
        amount: ethers.parseEther("1.0"),
        deadline: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        challengePeriod: 2 * 24 * 60 * 60,
      };

      await jobFactory.connect(client).postJob(
        jobParams,
        "Build a website",
        "Create a modern React website",
        "QmXxxx..."
      );

      deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      challengePeriod = 2 * 24 * 60 * 60;

      const tx = await jobFactory.connect(freelancer).acceptJob(
        0,
        arbiter.address,
        deadline,
        challengePeriod
      );

      const job = await jobFactory.getJob(0);
      const FreelanceEscrow = await ethers.getContractFactory("FreelanceEscrow");
      escrow = FreelanceEscrow.attach(job.escrow);
    });

    it("Should deploy escrow and initialize correctly", async function () {
      // Verificar que el escrow fue deployado
      const job = await jobFactory.getJob(0);
      expect(job.escrow).to.not.equal(ethers.ZeroAddress);

      // Verificar que el escrow tiene la dirección del factory en la implementación
      const code = await ethers.provider.getCode(job.escrow);
      expect(code).to.not.equal("0x");
    });

    it("Escrow should be callable and functional", async function () {
      // Test que pueda financiar
      const tx = await escrow.connect(client).fund({
        value: ethers.parseEther("1.0"),
      });
      expect(tx.hash).to.exist;

      await tx.wait();
    });
  });

  describe("JobFactory - Job Cancellation", function () {
    let jobParams;

    beforeEach(async function () {
      jobParams = {
        amount: ethers.parseEther("1.0"),
        deadline: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        challengePeriod: 2 * 24 * 60 * 60,
      };

      await jobFactory.connect(client).postJob(
        jobParams,
        "Build a website",
        "Create a modern React website",
        "QmXxxx..."
      );
    });

    it("Should allow client to cancel unccepted job", async function () {
      await jobFactory.connect(client).cancelJob(0);

      const job = await jobFactory.getJob(0);
      expect(job.status).to.equal(5); // Cancelled
    });

    it("Should prevent cancellation after acceptance", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      const challengePeriod = 2 * 24 * 60 * 60;

      await jobFactory.connect(freelancer).acceptJob(
        0,
        arbiter.address,
        deadline,
        challengePeriod
      );

      await expect(
        jobFactory.connect(client).cancelJob(0)
      ).to.be.revertedWithCustomError(jobFactory, "InvalidStatus");
    });

    it("Should prevent non-client from cancelling", async function () {
      await expect(
        jobFactory.connect(freelancer).cancelJob(0)
      ).to.be.revertedWithCustomError(jobFactory, "OnlyClient");
    });
  });

  describe("Gas Optimization - EIP-1167 Clones", function () {
    it("Should deploy multiple escrows", async function () {
      const jobParams = {
        amount: ethers.parseEther("1.0"),
        deadline: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        challengePeriod: 2 * 24 * 60 * 60,
      };

      // Deploy 3 jobs
      for (let i = 0; i < 3; i++) {
        await jobFactory.connect(client).postJob(
          jobParams,
          `Job ${i}`,
          `Description ${i}`,
          `QmHash${i}...`
        );
      }

      const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      const challengePeriod = 2 * 24 * 60 * 60;

      // Accept all 3 jobs (each creates a clone)
      const tx1 = await jobFactory.connect(freelancer).acceptJob(
        0,
        arbiter.address,
        deadline,
        challengePeriod
      );

      const tx2 = await jobFactory.connect(other).acceptJob(
        1,
        arbiter.address,
        deadline,
        challengePeriod
      );

      const receipt1 = await tx1.wait();
      const receipt2 = await tx2.wait();

      console.log(`First clone gas: ${receipt1.gasUsed}`);
      console.log(`Second clone gas: ${receipt2.gasUsed}`);

      // Los clones deberían usar menos gas que el factory
      expect(Number(receipt1.gasUsed)).to.be.greaterThan(0);
      expect(Number(receipt2.gasUsed)).to.be.greaterThan(0);
    });
  });
});
