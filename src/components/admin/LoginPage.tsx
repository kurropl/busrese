import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabaseEnabled } from "../../lib/supabase";
import { PhoenixIcon } from "../ui/Icons";

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
    <div className="max-w-sm mx-auto mt-12">
      <div className="text-center mb-8">
        <span className="inline-block text-betis-green mb-3">
          <PhoenixIcon size={40} />
        </span>
        <h1 className="text-2xl font-bold text-slate-800">Acceso administrador</h1>
        <p className="text-sm text-slate-500 mt-1">Panel de gestión de plazas del autobús.</p>
      </div>

      {!supabaseEnabled && (
        <p className="text-xs bg-amber-50/80 backdrop-blur text-amber-700 border border-amber-200/60 rounded-xl p-3 mb-4">
          Modo demo (sin Supabase): introduce cualquier email y contraseña para entrar.
        </p>
      )}

      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white/60 px-3 py-2.5 text-sm focus:border-betis-green focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white/60 px-3 py-2.5 text-sm focus:border-betis-green focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
          />
        </div>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-betis-green text-white rounded-xl py-2.5 font-medium hover:bg-betis-dark disabled:opacity-50 transition-all"
        >
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
