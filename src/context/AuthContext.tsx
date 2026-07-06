import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseEnabled } from "../lib/supabase";

interface AuthCtx {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>(undefined as unknown as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseEnabled || !supabase) {
      // Modo local: sesión simulada desde localStorage
      const raw = localStorage.getItem("pena-betica-admin");
      setSession(raw ? (JSON.parse(raw) as Session) : null);
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabaseEnabled || !supabase) {
      if (email && password) {
        const fake = { user: { email }, access_token: "local" } as unknown as Session;
        localStorage.setItem("pena-betica-admin", JSON.stringify(fake));
        setSession(fake);
        return;
      }
      throw new Error("Credenciales requeridas");
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabaseEnabled || !supabase) {
      localStorage.removeItem("pena-betica-admin");
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return <Ctx.Provider value={{ session, loading, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
