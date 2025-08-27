import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";

import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/dashboard";
import ClientPortal from "./pages/ClientPortal";
import ClientLogin from "./pages/ClientLogin";

const Nav = styled.nav`
  padding: 10px;
  background-color: #000;
  color: #d4af37;
  display: flex;
  gap: 20px;
`;

export default function App() {
  // usuário admin "falso" direto
  const [advogado] = useState({
    id: "1df58b25-5f3b-450e-9e17-ec0064b68476",
    nome: "Admin Principal",
    email: "admin@lexprime.com",
    role: "advogado",
  });

  return (
    <>
      <Nav>
        <Link to="/" style={{ color: "#d4af37" }}>Home</Link>
        <Link to="/admin" style={{ color: "#d4af37" }}>Admin</Link>
        <Link to="/client" style={{ color: "#d4af37" }}>Cliente</Link>
      </Nav>

      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Painel do Admin direto */}
        <Route
          path="/admin"
          element={<AdminDashboard user={advogado} />}
        />

        {/* Login do cliente via chave */}
        <Route path="/client" element={<ClientLogin />} />

        {/* Portal do cliente via chave */}
        <Route path="/client/:key" element={<ClientPortal />} />
      </Routes>
    </>
  );
}
