"use client";

import { useState } from "react";
import { useJobFactory } from "../../hooks/useJobFactory";

export default function ClientPage() {
  const {
    jobs,
    postJob,
    jobsLoading,
    jobsError
  } = useJobFactory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [challenge, setChallenge] = useState("");
  const [arbiter, setArbiter] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");

  const handleSubmit = async () => {
    if (!title || !description || !amount) {
      alert("Por favor rellena los campos obligatorios");
      return;
    }

    // Datos para el contrato JobFactory
    const jobData = {
      amount,
      deadline: Number(deadline) * 86400,
      challengePeriod: Number(challenge) * 86400,
      arbiter: arbiter || "0x0000000000000000000000000000000000000000"
    };

    try {
      await postJob(jobData, title, description, ipfsHash);
      alert("Trabajo publicado correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al publicar el trabajo.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-10 flex flex-col items-center">

      <h1 className="text-4xl font-extrabold mb-10 flex items-center gap-3">
        👤 Zona Cliente
      </h1>

      {/* CARD FORMULARIO */}
      <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-lg border border-gray-200 space-y-6">

        <h2 className="text-3xl font-bold flex items-center gap-2">
          📝 Publicar nuevo trabajo
        </h2>

        {/* FORM */}
        <div className="space-y-5">

          <input
            type="text"
            placeholder="Título del trabajo"
            className="input"
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Descripción del trabajo"
            className="input h-28"
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Cantidad (wei)"
            className="input"
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Deadline (días)"
              className="input"
              onChange={(e) => setDeadline(e.target.value)}
            />

            <input
              type="number"
              placeholder="Challenge Period (días)"
              className="input"
              onChange={(e) => setChallenge(e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="Árbitro (address)"
            className="input"
            onChange={(e) => setArbiter(e.target.value)}
          />

          <input
            type="text"
            placeholder="IPFS Hash"
            className="input"
            onChange={(e) => setIpfsHash(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold shadow transition"
          >
            Publicar trabajo
          </button>
        </div>
      </div>

      {/* LISTA DE TRABAJOS */}
      <div className="w-full max-w-3xl mt-12">

        <h2 className="text-3xl font-bold flex items-center gap-2 mb-4">
          📄 Trabajos publicados
        </h2>

        {jobsLoading && <p className="text-gray-500">Cargando trabajos...</p>}
        {jobsError && <p className="text-red-500">Error al cargar trabajos.</p>}

        {jobs && jobs.length > 0 ? (
          <ul className="space-y-4">
            {jobs.map((job, index) => (
              <li
                key={index}
                className="bg-white p-6 border rounded-xl shadow-sm text-gray-700"
              >
                <div className="font-bold text-lg">Trabajo #{index}</div>
                <div className="text-sm mt-2">
                  <p><strong>Título:</strong> {job.title}</p>
                  <p><strong>Amount:</strong> {job.amount}</p>
                  <p><strong>Cliente:</strong> {job.client}</p>
                  <p><strong>Freelancer:</strong> {job.freelancer}</p>
                  <p><strong>Árbitro:</strong> {job.arbiter}</p>
                  <p><strong>Escrow:</strong> {job.escrow}</p>
                  <p><strong>Estado:</strong> {job.state}</p>
                </div>

                <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition">
                  Ver detalles
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay trabajos aún.</p>
        )}
      </div>
    </main>
  );
}