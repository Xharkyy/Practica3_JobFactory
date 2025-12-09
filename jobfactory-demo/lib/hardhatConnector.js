import { hardhat } from "wagmi/chains";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";

export function hardhatConnector(privateKey) {
  const account = privateKeyToAccount(`0x${privateKey}`);

  return {
    id: "hardhat",
    name: "Hardhat Local",
    type: "local",

    async connect() {
      return { accounts: [account.address] };
    },

    async disconnect() {
      return true;
    },

    async getAccount() {
      return account;
    },

    async getChainId() {
      return hardhat.id;
    },

    async getWalletClient() {
      return createWalletClient({
        account,
        chain: hardhat,
        transport: http("http://127.0.0.1:8545"),
      });
    },
  };
}