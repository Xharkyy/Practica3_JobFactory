import { createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";

// Private keys de Hardhat Node
const PRIVATE_KEYS = {
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266":
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",

  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8":
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",

  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC":
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",

  "0x90F79bf6EB2c4f870365E785982E1f101E93b906":
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
};

export function getLocalWallet(account) {
  const pk = PRIVATE_KEYS[account];

  if (!pk) {
    throw new Error(`No private key para la cuenta ${account}`);
  }

  return createWalletClient({
    account: pk,
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });
}