import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AddButton, Input, Select } from "../pages/admin/dashboard";

export default function ProcessUpdateForm({ processes }) {
  const [processId, setProcessId] = useState("");
  const [descricao, setDescricao] = useState("");

  async function addUpdate() {
    await supabase.from("process_updates").insert([{ process_id: processId, descricao }]);
    setProcessId(""); setDescricao("");
  }

  return (
    <div>
      <Select value={processId} onChange={e => setProcessId(e.target.value)}>
        <option value="">Selecione Processo</option>
        {processes.map(p => <option key={p.id} value={p.id}>{p.numero} - {p.titulo}</option>)}
      </Select>
      <Input placeholder="Descrição da movimentação" value={descricao} onChange={e => setDescricao(e.target.value)} />
      <AddButton onClick={addUpdate}>Adicionar Movimentação</AddButton>
    </div>
  );
}
