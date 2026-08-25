"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Credenciales inválidas");
      }

      // Si todo sale bien, lo mandamos al panel de administración
      router.push("/admin");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold text-center text-gray-900">Iniciar Sesión</h1>
        
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-md bg-primary p-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}