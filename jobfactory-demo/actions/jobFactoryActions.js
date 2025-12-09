"use server";

import { JsonRpcProvider } from "ethers";
import { Wallet, Contract } from "ethers";
import JobFactoryABI from "../abi/JobFactory.json";

const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const HARDHAT_KEYS = [
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
];

const provider = new JsonRpcProvider("http://127.0.0.1:8545/");

function getSigner(index = 0) {
  return new Wallet(HARDHAT_KEYS[index], provider);
}

export async function postJobAction(jobData) {
  const signer = getSigner(0);
  const contract = new Contract(FACTORY_ADDRESS, JobFactoryABI.abi, signer);

  return await contract.postJob(
    jobData.amount,
    jobData.deadline,
    jobData.arbiter,
    jobData.title,
    jobData.description,
    jobData.ipfsHash
  );
}

export async function acceptJobAction(jobId) {
  const signer = getSigner(1);
  const contract = new Contract(FACTORY_ADDRESS, JobFactoryABI.abi, signer);

  return await contract.acceptJob(jobId);
}

export async function getJobsCountAction() {
  const contract = new Contract(FACTORY_ADDRESS, JobFactoryABI.abi, provider);
  return Number(await contract.getJobsCount());
}