import { createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";

// Las cuentas que expone Hardhat RPC: impersonación directa
export const hardhatAccounts = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", // Cliente
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // Freelancer
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", // Árbitro
  "0x90f79bf6eb2c4f870365e785982e1f101e93b906", // Otro
];

export const getHardhatSigner = (address) =>
  createWalletClient({
    account: address,
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });