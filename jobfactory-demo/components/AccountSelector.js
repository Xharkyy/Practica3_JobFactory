"use client";

import { useState } from "react";
import { useConnect, useDisconnect } from "wagmi";
import { HARDHAT_KEYS } from "../lib/hardhatKeys";
import { hardhatConnector } from "../lib/hardhatConnector";

export default function AccountSelector() {
  const [selected, setSelected] = useState(null);

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const accounts = Object.keys(HARDHAT_KEYS); // ya tienes 20 cuentas

  const handleSelect = async (address) => {
    setSelected(address);

    const pk = HARDHAT_KEYS[address];

    if (!pk) {
      console.error("No PK para esta cuenta:", address);
      return;
    }

    await disconnect();

    await connect({
      connector: hardhatConnector(pk),
      chainId: 31337,
    });

    console.log("Hardhat signer conectado:", address);
  };

  return (
    <div className="bg-gray-900 p-5 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-3">Selecciona una cuenta</h2>

      <ul className="space-y-2">
        {accounts.map((acc) => (
          <li
            key={acc}
            onClick={() => handleSelect(acc)}
            className={`p-3 rounded cursor-pointer ${
              selected === acc ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {acc}
          </li>
        ))}
      </ul>
    </div>
  );
}