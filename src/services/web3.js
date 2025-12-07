// src/services/web3.js
/**
 * Servicio Web3 - Interacción con contratos inteligentes
 * Maneja todas las operaciones blockchain del marketplace
 */

import { ethers } from "ethers";
import JobFactoryABI from "../contracts/abis/JobFactory";
import FreelanceEscrowABI from "../contracts/abis/FreelanceEscrow";
import CONTRACTS from "../contracts/addresses";

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.jobFactoryContract = null;
    this.chainId = null;
  }

  /**
   * Inicializa la conexión Web3
   * Solicita permiso al usuario para conectar su wallet
   */
  async initialize() {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask no detectado. Por favor, instala MetaMask.");
      }

      // Solicitar acceso a cuentas
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);

      this._initializeContracts();

      console.log("✓ Web3 inicializado correctamente");
      return {
        address: await this.signer.getAddress(),
        chainId: this.chainId,
      };
    } catch (error) {
      console.error("Error inicializando Web3:", error);
      throw error;
    }
  }

  /**
   * Inicializa las instancias de contrato
   */
  _initializeContracts() {
    const jobFactoryAddress = CONTRACTS.JobFactory[this._getNetworkName()];

    if (!jobFactoryAddress || jobFactoryAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error(
        "JobFactory no ha sido deployado en esta red. Por favor, ejecuta el deployment."
      );
    }

    this.jobFactoryContract = new ethers.Contract(
      jobFactoryAddress,
      JobFactoryABI,
      this.signer
    );
  }

  /**
   * Obtiene el nombre de la red
   */
  _getNetworkName() {
    const networks = {
      1: "mainnet",
      5: "goerli",
      11155111: "sepolia",
      31337: "hardhat",
      1337: "localhost",
    };
    return networks[this.chainId] || "localhost";
  }

  /**
   * Verifica que el usuario esté conectado
   */
  _requireConnected() {
    if (!this.signer) {
      throw new Error("No conectado. Llama a initialize() primero.");
    }
  }

  // ============ JOBS FUNCTIONS ============

  /**
   * Cliente publica un nuevo job
   */
  async postJob(title, description, amount, deadline, challengePeriod, ipfsHash) {
    this._requireConnected();

    try {
      const jobParams = {
        amount: ethers.parseEther(amount.toString()),
        deadline: Math.floor(deadline / 1000), // Convertir a unix timestamp
        challengePeriod: challengePeriod,
      };

      const tx = await this.jobFactoryContract.postJob(
        jobParams,
        title,
        description,
        ipfsHash
      );

      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      console.log("✓ Job publicado exitosamente");
      return receipt;
    } catch (error) {
      console.error("Error publicando job:", error);
      throw error;
    }
  }

  /**
   * Freelancer acepta un job
   */
  async acceptJob(jobId, arbiterAddress, deadline, challengePeriod) {
    this._requireConnected();

    try {
      const tx = await this.jobFactoryContract.acceptJob(
        jobId,
        arbiterAddress,
        Math.floor(deadline / 1000),
        challengePeriod
      );

      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      const job = await this.jobFactoryContract.getJob(jobId);
      console.log("✓ Job aceptado. Escrow:", job.escrow);

      return {
        receipt,
        escrowAddress: job.escrow,
      };
    } catch (error) {
      console.error("Error aceptando job:", error);
      throw error;
    }
  }

  /**
   * Cliente cancela un job no aceptado
   */
  async cancelJob(jobId) {
    this._requireConnected();

    try {
      const tx = await this.jobFactoryContract.cancelJob(jobId);
      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      console.log("✓ Job cancelado");
      return receipt;
    } catch (error) {
      console.error("Error cancelando job:", error);
      throw error;
    }
  }

  /**
   * Obtiene información de un job
   */
  async getJob(jobId) {
    this._requireConnected();

    try {
      const job = await this.jobFactoryContract.getJob(jobId);
      return this._formatJob(job);
    } catch (error) {
      console.error("Error obteniendo job:", error);
      throw error;
    }
  }

  /**
   * Obtiene total de jobs
   */
  async getJobsCount() {
    this._requireConnected();

    try {
      const count = await this.jobFactoryContract.getJobsCount();
      return Number(count);
    } catch (error) {
      console.error("Error obteniendo count:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los jobs de un cliente
   */
  async getClientJobs(clientAddress) {
    this._requireConnected();

    try {
      const jobIds = await this.jobFactoryContract.getClientJobs(clientAddress);
      const jobs = [];

      for (const jobId of jobIds) {
        const job = await this.getJob(jobId);
        jobs.push(job);
      }

      return jobs;
    } catch (error) {
      console.error("Error obteniendo client jobs:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los jobs de un freelancer
   */
  async getFreelancerJobs(freelancerAddress) {
    this._requireConnected();

    try {
      const jobIds = await this.jobFactoryContract.getFreelancerJobs(
        freelancerAddress
      );
      const jobs = [];

      for (const jobId of jobIds) {
        const job = await this.getJob(jobId);
        jobs.push(job);
      }

      return jobs;
    } catch (error) {
      console.error("Error obteniendo freelancer jobs:", error);
      throw error;
    }
  }

  // ============ ESCROW FUNCTIONS ============

  /**
   * Obtiene instancia de contrato escrow
   */
  _getEscrowContract(escrowAddress) {
    if (!this.signer) {
      throw new Error("No conectado");
    }
    return new ethers.Contract(escrowAddress, FreelanceEscrowABI, this.signer);
  }

  /**
   * Cliente deposita fondos en escrow
   */
  async fundEscrow(escrowAddress, amount) {
    this._requireConnected();

    try {
      const escrow = this._getEscrowContract(escrowAddress);
      const tx = await escrow.fund({
        value: ethers.parseEther(amount.toString()),
      });

      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      console.log("✓ Escrow financiado");
      return receipt;
    } catch (error) {
      console.error("Error financiando escrow:", error);
      throw error;
    }
  }

  /**
   * Freelancer marca el job como entregado
   */
  async markDelivered(escrowAddress, deliveryHash) {
    this._requireConnected();

    try {
      const escrow = this._getEscrowContract(escrowAddress);
      const tx = await escrow.markDelivered(deliveryHash);

      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      console.log("✓ Entrega marcada con hash:", deliveryHash);
      return receipt;
    } catch (error) {
      console.error("Error marcando entrega:", error);
      throw error;
    }
  }

  /**
   * Cliente aprueba la entrega y libera fondos
   */
  async approveRelease(escrowAddress) {
    this._requireConnected();

    try {
      const escrow = this._getEscrowContract(escrowAddress);
      const tx = await escrow.approveRelease();

      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      console.log("✓ Pago liberado al freelancer");
      return receipt;
    } catch (error) {
      console.error("Error aprobando liberación:", error);
      throw error;
    }
  }

  /**
   * Libera fondos automáticamente si pasó el periodo de challenge
   */
  async releaseAfterChallenge(escrowAddress) {
    this._requireConnected();

    try {
      const escrow = this._getEscrowContract(escrowAddress);
      const tx = await escrow.releaseAfterChallenge();

      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      console.log("✓ Pago liberado automáticamente");
      return receipt;
    } catch (error) {
      console.error("Error liberando automáticamente:", error);
      throw error;
    }
  }

  /**
   * Levanta una disputa
   */
  async raiseDispute(escrowAddress) {
    this._requireConnected();

    try {
      const escrow = this._getEscrowContract(escrowAddress);
      const tx = await escrow.raiseDispute();

      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      console.log("✓ Disputa levantada");
      return receipt;
    } catch (error) {
      console.error("Error levantando disputa:", error);
      throw error;
    }
  }

  /**
   * Árbitro resuelve una disputa
   */
  async resolveDispute(escrowAddress, freelancerPayment) {
    this._requireConnected();

    try {
      const escrow = this._getEscrowContract(escrowAddress);
      const tx = await escrow.resolveDispute(
        ethers.parseEther(freelancerPayment.toString())
      );

      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      console.log("✓ Disputa resuelta");
      return receipt;
    } catch (error) {
      console.error("Error resolviendo disputa:", error);
      throw error;
    }
  }

  /**
   * Cliente obtiene reembolso si vence el plazo
   */
  async refundIfDeadlinePassed(escrowAddress) {
    this._requireConnected();

    try {
      const escrow = this._getEscrowContract(escrowAddress);
      const tx = await escrow.refundIfDeadlinePassed();

      console.log("Transacción enviada:", tx.hash);
      const receipt = await tx.wait();

      console.log("✓ Reembolso procesado");
      return receipt;
    } catch (error) {
      console.error("Error obteniendo reembolso:", error);
      throw error;
    }
  }

  /**
   * Obtiene estado del escrow
   */
  async getEscrowState(escrowAddress) {
    this._requireConnected();

    try {
      const escrow = this._getEscrowContract(escrowAddress);
      const data = await escrow.getFunction("client").staticCall();
      // Mejor usar multicall o devolver varias propiedades

      const state = await escrow.state();
      const client = await escrow.client();
      const freelancer = await escrow.freelancer();
      const arbiter = await escrow.arbiter();
      const amount = await escrow.amount();
      const deadline = await escrow.deadline();
      const deliveredHash = await escrow.deliveredHash();
      const disputed = await escrow.disputed();

      return {
        state: this._getStateName(state),
        client,
        freelancer,
        arbiter,
        amount: ethers.formatEther(amount),
        deadline: Number(deadline) * 1000,
        deliveredHash,
        disputed,
      };
    } catch (error) {
      console.error("Error obteniendo estado escrow:", error);
      throw error;
    }
  }

  // ============ HELPERS ============

  /**
   * Formatea datos de job
   */
  _formatJob(job) {
    const JobStatus = ["Created", "Accepted", "InProgress", "Delivered", "Completed", "Cancelled"];
    return {
      escrow: job.escrow,
      client: job.client,
      freelancer: job.freelancer,
      status: JobStatus[Number(job.status)],
      title: job.title,
      description: job.description,
      jobSpecIpfsHash: job.jobSpecIpfsHash,
      createdAt: Number(job.createdAt) * 1000,
      amount: ethers.formatEther(job.amount),
    };
  }

  /**
   * Convierte número de estado a nombre
   */
  _getStateName(state) {
    const states = [
      "Created",
      "Funded",
      "Delivered",
      "Disputed",
      "Released",
      "Refunded",
    ];
    return states[Number(state)] || "Unknown";
  }

  /**
   * Obtiene la dirección del usuario conectado
   */
  async getConnectedAddress() {
    if (!this.signer) {
      return null;
    }
    return await this.signer.getAddress();
  }

  /**
   * Obtiene el balance del usuario en ETH
   */
  async getBalance() {
    this._requireConnected();

    try {
      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error obteniendo balance:", error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const web3Service = new Web3Service();
export default web3Service;
