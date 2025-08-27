import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../../lib/supabaseClient";
import ClientForm from "../../components/ClientForm";
import ProcessForm from "../../components/ProcessForm";
import ProcessUpdateForm from "../../components/ProcessUpdateForm";

const Container = styled.div`
  padding: 30px;
  font-family: 'Merriweather', serif;
  background-color: #121212;
  color: #d4af37;
  min-height: 100vh;
`;

const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background-color: ${props => props.active ? "#00b894" : "#d4af37"};
  color: #000;
  &:hover { opacity: 0.8; }
`;

const Section = styled.div`
  display: ${props => props.active ? "block" : "none"};
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  th, td {
    padding: 10px;
    border: 1px solid #d4af37;
    text-align: left;
  }
  th { background-color: #1f1f1f; }
`;

const Button = styled.button`
  padding: 5px 10px;
  border-radius: 5px;
  margin:10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background-color: ${props => props.primary ? "#00b894" : "#d4af37"};
  color: #000;
  &:hover { opacity: 0.8; }
`;
export const Input = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #d4af37;
  background-color: #1f1f1f;
  color: #d4af37;
  font-size: 1rem;
  margin-right: 10px;
  &:focus {
    outline: none;
    border-color: #00b894;
  }
`;

export const Select = styled.select`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #d4af37;
  background-color: #1f1f1f;
  color: #d4af37;
  font-size: 1rem;
  margin-right: 10px;
  &:focus {
    outline: none;
    border-color: #00b894;
  }
`;

// Botão adicionar estilizado
export const AddButton = styled.button`
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background-color: #00b894;
  color: #000;
  font-size: 1rem;
  transition: all 0.2s;
  &:hover {
    background-color: #009f77;
  }
`;
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("clients");
  const [clients, setClients] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unseen, commented

  // busca dados
  useEffect(() => {
    fetchClients();
    fetchProcesses();
    fetchUpdates();
  }, []);

  async function fetchClients() {
    const { data } = await supabase.from("clients").select("*");
    setClients(data || []);
  }

  async function fetchProcesses() {
    const { data } = await supabase.from("processes").select("*");
    setProcesses(data || []);
  }

  async function fetchUpdates() {
    const { data } = await supabase.from("process_updates").select("*");
    setUpdates(data || []);
  }

  // editar movimentação
  async function editUpdate(upd) {
    const descricao = prompt("Editar descrição:", upd.descricao);
    if (descricao) {
      await supabase.from("process_updates").update({ descricao }).eq("id", upd.id);
      fetchUpdates();
    }
  }

  // apagar movimentação
  async function deleteUpdate(id) {
    if (!confirm("Deseja realmente apagar esta movimentação?")) return;
    await supabase.from("process_updates").delete().eq("id", id);
    fetchUpdates();
  }

  // filtro
  const filteredUpdates = updates.filter(u => {
    if (filter === "unseen") return !u.seen_by_client;
    if (filter === "commented") return u.client_comment && u.client_comment.trim() !== "";
    return true;
  });

  return (
    <Container>
      <h1>Painel do Advogado</h1>

      <Tabs>
        <TabButton active={activeTab==="clients"} onClick={()=>setActiveTab("clients")}>Clientes</TabButton>
        <TabButton active={activeTab==="processes"} onClick={()=>setActiveTab("processes")}>Processos</TabButton>
        <TabButton active={activeTab==="updates"} onClick={()=>setActiveTab("updates")}>Movimentações</TabButton>
      </Tabs>

      {/* Clientes */}
      <Section active={activeTab==="clients"}>
        <h2>Clientes</h2>
        <ClientForm refreshClients={fetchClients} />
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Chave de acesso</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.email}</td>
                <td>{c.telefone}</td>
                <td>{c.access_key}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      {/* Processos */}
      <Section active={activeTab==="processes"}>
        <h2>Processos</h2>
        <ProcessForm clients={clients} refreshProcesses={fetchProcesses} />
        <Table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Título</th>
              <th>Status</th>
              <th>Cliente</th>
              <th>Advogado</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(p => (
              <tr key={p.id}>
                <td>{p.numero}</td>
                <td>{p.titulo}</td>
                <td>{p.status}</td>
                <td>{clients.find(c=>c.id===p.client_id)?.nome || "-"}</td>
                <td>{p.lawyer_id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      {/* Movimentações */}
      <Section active={activeTab==="updates"}>
        <h2>Movimentações</h2>
        <ProcessUpdateForm processes={processes} refreshUpdates={fetchUpdates} />

        <div style={{ margin: "15px" }}>
          <label>Filtrar: </label>
          <Select value={filter} onChange={(e)=>setFilter(e.target.value)}>
            <option value="all">Todas</option>
            <option value="unseen">Não vistas pelo cliente</option>
            <option value="commented">Com comentários do cliente</option>
          </Select>
        </div>

        <Table>
          <thead>
            <tr>
              <th>Processo</th>
              <th>Descrição</th>
              <th>Cliente viu?</th>
              <th>Comentário do cliente</th>
              <th>Hora do comentário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUpdates.map(u => (
              <tr key={u.id}>
                <td>{processes.find(p=>p.id===u.process_id)?.numero || "-"}</td>
                <td>{u.descricao}</td>
                <td>{u.seen_by_client ? "Sim" : "Não"}</td>
                <td>{u.client_comment || "-"}</td>
                <td>{u.client_comment_created_at ? new Date(u.client_comment_created_at).toLocaleString() : "-"}</td>
                <td>
                  <Button className="edit" onClick={()=>editUpdate(u)}>Editar</Button>
                  <Button className="delete" onClick={()=>deleteUpdate(u.id)}>Apagar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
}
