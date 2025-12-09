"use client";

import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";
import EscrowABI from "../abi/FreelanceEscrow.json";

export function useEscrow(escrowAddress) {
  if (!escrowAddress) {
    console.warn("useEscrow: escrowAddress no definido");
  }

  // ============================
  // 🔵 1. LECTURA — getInfo()
  // ============================
  const info = useContractRead({
    address: escrowAddress,
    abi: EscrowABI.abi,
    functionName: "getInfo",
    watch: true,
    enabled: !!escrowAddress
  });

  // ============================
  // 🔵 2. marcar entrega — markDelivered(hash)
  // ============================
  const markDelivered = useContractWrite({
    address: escrowAddress,
    abi: EscrowABI.abi,
    functionName: "markDelivered"
  });

  const markDeliveredTx = useWaitForTransaction({
    hash: markDelivered.data?.hash
  });

  // ============================
  // 🔵 3. aprobar liberación — approveRelease()
  // ============================
  const approveRelease = useContractWrite({
    address: escrowAddress,
    abi: EscrowABI.abi,
    functionName: "approveRelease"
  });

  const approveTx = useWaitForTransaction({
    hash: approveRelease.data?.hash
  });

  // ============================
  // 🔵 4. reembolsar — refundClient()
  // ============================
  const refundClient = useContractWrite({
    address: escrowAddress,
    abi: EscrowABI.abi,
    functionName: "refundClient"
  });

  const refundTx = useWaitForTransaction({
    hash: refundClient.data?.hash
  });

  // ============================
  // 🔵 5. Depositar fondos (ETH)
  // ============================
  const deposit = (amountEth) => {
    return markDelivered.writeAsync?.({
      // truco: enviamos valor a la dirección del escrow
      address: escrowAddress,
      abi: [],
      functionName: undefined,
      // ⬇ este es el envío de ETH puro
      value: parseEther(amountEth),
    });
  };

  // ============================
  // 🔵 Exportar API del hook
  // ============================
  return {
    info,                // useContractRead → info del escrow
    markDelivered,       // { write }
    markDeliveredTx,
    approveRelease,      // { write }
    approveTx,
    refundClient,        // { write }
    refundTx,
    deposit              // función custom para enviar ETH
  };
}