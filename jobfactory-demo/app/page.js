"use client";

import AccountSelector from "../components/AccountSelector";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-6 py-16">

      {/* Selector de cuenta Hardhat */}
      <div className="max-w-3xl mx-auto mb-12">
        <AccountSelector />
      </div>

      {/* Contenedor centrado */}
      <div className="max-w-3xl mx-auto space-y-12">

        {/* Título principal */}
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          JobFactory Demo
        </h1>

        {/* Subtítulo */}
        <p className="text-lg text-gray-700">
          Selecciona un rol para probar cómo funciona el marketplace con escrow inteligente.
        </p>

        {/* Botones de acceso */}
        <div className="flex gap-6 pt-4">
          <a
            href="/client"
            className="button-primary bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            👤 Entrar como Cliente
          </a>

          <a
            href="/freelancer"
            className="button-primary bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-purple-700 transition flex items-center gap-2"
          >
            👩‍💻 Entrar como Freelancer
          </a>
        </div>
      </div>
    </main>
  );
}