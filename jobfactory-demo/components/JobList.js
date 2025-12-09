"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function JobList({ jobs, onAccept, showAcceptButton = false }) {
  const router = useRouter();

  if (!jobs || !jobs.data) {
    return <p className="text-gray-500">Cargando trabajos...</p>;
  }

  const jobArray = jobs.data;

  if (jobArray.length === 0) {
    return <p className="text-gray-500">No hay trabajos publicados.</p>;
  }

  return (
    <div className="space-y-4">
      {jobArray.map((job, id) => (
        <div
          key={id}
          className="p-4 bg-white rounded-lg border shadow hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold">Trabajo #{id}</h3>

          <p><strong>Cliente:</strong> {job.client}</p>
          <p><strong>Freelancer:</strong> {job.freelancer}</p>
          <p><strong>Cantidad:</strong> {job.amount.toString()} wei</p>

          <p>
            <strong>Estado:</strong>{" "}
            {job.freelancer === "0x0000000000000000000000000000000000000000"
              ? "📌 Pendiente"
              : "🟢 Aceptado"}
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.push(`/job/${id}`)}
              className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-black"
            >
              Ver detalles
            </button>

            {showAcceptButton &&
              job.freelancer === "0x0000000000000000000000000000000000000000" && (
                <button
                  onClick={() => onAccept(id)}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Aceptar trabajo
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}