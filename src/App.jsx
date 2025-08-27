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
  

  return (
    <>
      <Nav>
        <Link to="/" style={{ color: "#d4af37" }}>Home</Link>
        <Link to="/admin" style={{ color: "#d4af37" }}>Admin</Link>
        <Link to="/client" style={{ color: "#d4af37" }}>Cliente</Link>
      </Nav>

      <Routes>
        <Route path="/" element={<Home />} />
        
      
        <Route
          path="/admin"
          element={<AdminDashboard  />}
        />

        <Route path="/client" element={<ClientLogin />} />

     
        <Route path="/client/:key" element={<ClientPortal />} />
      </Routes>
    </>
  );
}
