// ❌ Importante: SIN "use client" aquí
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "JobFactory Demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-black text-white min-h-screen">
        {/* Wagmi + QueryClient Provider */}
        <Providers>
          {/* El AccountSelector YA NO va aquí */}
          <main className="container mx-auto px-6 py-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}