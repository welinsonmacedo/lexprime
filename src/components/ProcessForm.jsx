import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Input, AddButton } from "./FormComponents";
import Select from 'react-select';

export default function ProcessForm({ clients, refreshProcesses }) {
  const [clientId, setClientId] = useState(null);
  const [numero, setNumero] = useState("");
  const [titulo, setTitulo] = useState("");

  const clientOptions = clients.map(c => ({ value: c.id, label: c.nome }));

  async function addProcess() {
    if (!clientId) return alert("Selecione um cliente");
    await supabase.from("processes").insert([{ client_id: clientId.value, numero, titulo, status: "Aberto" }]);
    setNumero(""); setTitulo(""); setClientId(null);
    refreshProcesses();
  }

  return (
    <div style={{ marginBottom:"15px" }}>
      <Select
        placeholder="Selecione Cliente"
        options={clientOptions}
        value={clientId}
        onChange={setClientId}
        styles={{
          control: (base) => ({ ...base, backgroundColor:"#b8adad", color:"#000000" }),
          singleValue: (base) => ({ ...base, color:"#000000" }),
          menu: (base) => ({ ...base, backgroundColor:"#cfcdcd", color:"#81807c" }),
          option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? "#939c9a" : "#416900", color:"#050505" })
        }}
      />
      <Input placeholder="Número do processo" value={numero} onChange={e => setNumero(e.target.value)} />
      <Input placeholder="Título do processo" value={titulo} onChange={e => setTitulo(e.target.value)} />
      <AddButton onClick={addProcess}>Adicionar Processo</AddButton>
    </div>
  );
}
