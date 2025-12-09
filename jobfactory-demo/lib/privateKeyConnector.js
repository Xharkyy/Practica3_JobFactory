import { createConnector } from 'wagmi';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'wagmi/chains';
import { http } from 'wagmi';

export function privateKeyConnector(privateKey) {
  return createConnector((config) => ({
    id: `pk-${privateKey.slice(0, 6)}`,
    name: "Hardhat Private Key",
    type: "custom",

    async connect() {
      const account = privateKeyToAccount(privateKey);

      return {
        accounts: [account.address],
        chainId: hardhat.id,
      };
    },

    async getAccount() {
      return privateKeyToAccount(privateKey).address;
    },

    async getChainId() {
      return hardhat.id;
    },

    async getWalletClient() {
      const account = privateKeyToAccount(privateKey);

      return {
        account,
        chain: hardhat,
        transport: http()
      };
    },

    async disconnect() {}
  }));
}