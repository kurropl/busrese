import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabaseEnabled } from "../../lib/supabase";

export default function LoginPage() {
  const { signIn, session } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signIn(email, password);
      nav("/admin");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error al iniciar sesión");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-betis-dark mb-1">Acceso administrador</h1>
      <p className="text-sm text-gray-500 mb-6">Panel de gestión de plazas del autobús.</p>
      {!supabaseEnabled && (
        <p className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded p-2 mb-4">
          Modo demo (sin Supabase): introduce cualquier email y contraseña para entrar.
        </p>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-betis-green focus:ring-1 focus:ring-betis-green outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-betis-green focus:ring-1 focus:ring-betis-green outline-none"
          />
        </div>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-betis-green text-white rounded-lg py-2 font-medium hover:bg-betis-dark disabled:opacity-50"
        >
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
