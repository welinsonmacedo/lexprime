import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AddButton, Input, Select } from "../pages/admin/dashboard";

export default function ProcessForm({ clients, refreshProcesses }) {
  const [clientId, setClientId] = useState("");
  const [numero, setNumero] = useState("");
  const [titulo, setTitulo] = useState("");

  async function addProcess() {
    await supabase.from("processes").insert([{ client_id: clientId, numero, titulo, status: "Aberto" }]);
    setNumero(""); setTitulo(""); setClientId("");
    refreshProcesses();
  }

  return (
    <div>
      <Select value={clientId} onChange={e => setClientId(e.target.value)}>
        <option value="">Selecione Cliente</option>
        {clients.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </Select>
      <Input placeholder="Número do processo" value={numero} onChange={e => setNumero(e.target.value)} />
      <Input placeholder="Título do processo" value={titulo} onChange={e => setTitulo(e.target.value)} />
      <AddButton onClick={addProcess}>Adicionar Processo</AddButton>
    </div>
  );
}
