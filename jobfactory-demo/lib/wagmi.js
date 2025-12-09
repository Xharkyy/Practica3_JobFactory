import { createConfig, http } from "wagmi";
import { hardhat } from "wagmi/chains";
import { privateKeyConnector } from "./privateKeyConnector";

// Hardhat account #0 (1ª de la lista)
const PK =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const config = createConfig({
  chains: [hardhat],
  connectors: [
    privateKeyConnector(PK) // 🔥 este es tu signer del frontend
  ],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});