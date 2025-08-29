import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminDashboard from "../pages/admin/dashboard";
import { Input, Button, AddButton } from "./FormComponents";

export default function ClientForm({ refreshClients }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  async function addClient() {
    const access_key = Math.random().toString(36).substring(2, 10).toUpperCase();
    await supabase.from("clients").insert([{ nome: name, email, telefone, access_key }]);
    setName(""); setEmail(""); setTelefone("");
    refreshClients();
  }

  return (
    <div>
      <Input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
      <AddButton onClick={addClient}>Adicionar Cliente</AddButton>
    </div>
  );
  }
