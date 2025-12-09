"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useJobFactory } from "../../../hooks/useJobFactory";
import { useEscrow } from "../../../hooks/useEscrow";
import { parseEther } from "viem";

export default function JobDetailsPage() {
  const { id } = useParams();
  const jobId = parseInt(id);

  const { jobs } = useJobFactory();
  const [escrowAddress, setEscrowAddress] = useState(null);

  // Cuando se cargan los jobs, obtenemos dirección del escrow
  useEffect(() => {
    if (jobs.data && jobs.data[jobId]) {
      setEscrowAddress(jobs.data[jobId].escrowAddress);
    }
  }, [jobs.data, jobId]);

  const escrow = useEscrow(escrowAddress);

  if (!jobs.data) {
    return <p className="p-10 text-gray-500">Cargando trabajos...</p>;
  }

  const job = jobs.data[jobId];

  if (!job) {
    return <p className="p-10 text-red-600">⚠️ Este trabajo no existe</p>;
  }

  return (
    <main className="p-10 space-y-10">
      <h1 className="text-3xl font-bold">Detalles del Trabajo #{jobId}</h1>

      {/* ============================================
          SECCIÓN 1 — INFO DEL JOB (JOBFACTORY)
      ============================================ */}
      <div className="p-6 bg-white rounded-lg border shadow space-y-2">
        <h2 className="text-xl font-semibold">📄 Información del Job</h2>

        <p><strong>Cliente:</strong> {job.client}</p>
        <p><strong>Freelancer:</strong> {job.freelancer}</p>
        <p><strong>Árbitro:</strong> {job.arbiter}</p>
        <p><strong>Cantidad:</strong> {job.amount.toString()} wei</p>
        <p><strong>Escrow:</strong> {job.escrowAddress}</p>
        <p>
          <strong>Estado:</strong>{" "}
          {job.status === 0n ? "📌 Pendiente"
            : job.status === 1n ? "🟩 Aceptado"
            : "❌ Desconocido"}
        </p>
      </div>

      {/* ============================================
          SECCIÓN 2 — INFO DEL ESCROW
      ============================================ */}
      {escrowAddress && (
        <div className="p-6 bg-white rounded-lg border shadow space-y-2">
          <h2 className="text-xl font-semibold">🔒 Escrow</h2>

          {!escrow.info.data && <p>Cargando detalles del escrow...</p>}

          {escrow.info.data && (
            <>
              <p><strong>Monto:</strong> {escrow.info.data.amount.toString()} wei</p>
              <p><strong>Cliente:</strong> {escrow.info.data.client}</p>
              <p><strong>Freelancer:</strong> {escrow.info.data.freelancer}</p>
              <p><strong>Árbitro:</strong> {escrow.info.data.arbiter}</p>
              <p><strong>Entregado:</strong> {escrow.info.data.delivered ? "Sí" : "No"}</p>
              <p><strong>Liberado:</strong> {escrow.info.data.released ? "Sí" : "No"}</p>
            </>
          )}
        </div>
      )}

      {/* ============================================
          SECCIÓN 3 — ACCIONES (CLIENTE Y FREELANCER)
      ============================================ */}
      {!!escrowAddress && (
        <div className="space-y-6">

          {/* --------------------------- 
              Depositar (CLIENTE)
          --------------------------- */}
          <div className="p-6 bg-blue-50 border rounded-lg">
            <h3 className="font-semibold mb-2">💰 Cliente — Depositar fondos</h3>

            <button
              className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => escrow.deposit("1.5")}
            >
              Depositar 1.5 ETH
            </button>

            {escrow.markDeliveredTx?.isLoading && (
              <p className="text-sm text-blue-600 mt-2">Enviando ETH...</p>
            )}
          </div>

          {/* --------------------------- 
              Entregar trabajo (FREELANCER)
          --------------------------- */}
          <div className="p-6 bg-green-50 border rounded-lg">
            <h3 className="font-semibold mb-2">📦 Freelancer — Entregar trabajo</h3>

            <button
              className="p-3 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => escrow.markDelivered.write?.({ args: ["QmEntregaDemoHash"] })}
            >
              Marcar como entregado
            </button>

            {escrow.markDeliveredTx.isLoading && (
              <p className="text-sm text-green-600 mt-2">Marcando entrega...</p>
            )}
          </div>

          {/* --------------------------- 
              Aprobar (CLIENTE)
          --------------------------- */}
          <div className="p-6 bg-purple-50 border rounded-lg">
            <h3 className="font-semibold mb-2">🟣 Cliente — Aprobar liberación</h3>

            <button
              className="p-3 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => escrow.approveRelease.write?.()}
            >
              Aprobar entrega y liberar fondos
            </button>

            {escrow.approveTx.isLoading && (
              <p className="text-sm text-purple-600 mt-2">Aprobando...</p>
            )}
          </div>

        </div>
      )}
    </main>
  );
}