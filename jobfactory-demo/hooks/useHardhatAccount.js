"use client";

import { useState, useEffect } from "react";

export function useHardhatAccount() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    async function loadAccounts() {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const accs = await provider.listAccounts();

      setAccounts(accs);
      setSelectedAddress(accs[0]);
    }
    loadAccounts();
  }, []);

  return {
    accounts,
    selectedAddress,
    setSelectedAddress, // ESTA FUNCIÓN NO SE PUEDE SERIALIZAR → debe ser client
  };
}