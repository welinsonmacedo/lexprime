import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import AdminDashboard from "./pages/admin/dashboard";
import AdminLogin from "./pages/AdminLogin";

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Carregando usuário...</p>;

  return (
    <Routes>
      <Route
        path="login"
        element={user ? <Navigate to="/admin" replace /> : <AdminLogin />}
      />
      <Route
        path="/"
        element={user ? <AdminDashboard user={user} /> : <Navigate to="login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
