import { createWalletClient, custom } from "viem";
import { hardhat } from "viem/chains";

export function getHardhatWalletClient(account) {
  if (!account) return null;

  return createWalletClient({
    account,
    chain: hardhat,
    transport: custom(window.ethereum || "http://127.0.0.1:8545")
  });
}