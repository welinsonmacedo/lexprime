import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import styled from "styled-components";

import Home from "./pages/Home";
import ClientPortal from "./pages/ClientPortal";
import ClientLogin from "./pages/ClientLogin";
import AdminApp from "./AdminApp";
import PrivacyPolicy from "./pages/PrivacyPolicy";
const Nav = styled.nav`
  padding: 10px;
  background-color: #000;
  color: #d4af37;
  display: flex;
  gap: 20px;
`;

export default function App() {
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/client")|| location.pathname.startsWith("/") || location.pathname.startsWith("/admin")||location.pathname.startsWith("/privacy-policy");

  return (
    <>
      {!hideNav && (
        <Nav>
          <Link to="/" style={{ color: "#d4af37" }}>Home</Link>
          <Link to="/client" style={{ color: "#d4af37" }}>Cliente</Link>
          <Link to="/admin" style={{ color: "#d4af37" }}>Admin</Link>
        </Nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client" element={<ClientLogin />} />
        <Route path="/client/:key" element={<ClientPortal />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </>
  );
}
