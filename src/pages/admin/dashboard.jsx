/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import styled from "styled-components";
import { supabase } from "../../lib/supabaseClient";
import ClientForm from "../../components/ClientForm";
import ProcessForm from "../../components/ProcessForm";
import ProcessUpdateFormAdmin from "../../components/ProcessUpdateForm"; // import do componente atualizado

const Container = styled.div`
  padding: 30px;
  font-family: 'Merriweather', serif;
  background-color: #121212;
  color: #d4af37;
  min-height: 100vh;
`;
const Title = styled.div`
  color: #6c9108;
  font-size: 34px;  
  font-weight: bold;  
  margin-bottom: 20px;
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
  background-color: ${props => props.$active ? "#00b894" : "#d4af37"};
  color: #000;
  &:hover { opacity: 0.8; }
`;

const Section = styled.div`
  display: ${props => props.$active ? "block" : "none"};
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  color: #d4af37;
  th, td {
    padding: 10px;
    border: 1px solid #d4af37;
    text-align: left;
  }
  th { background-color: #1f1f1f; }
`;

const Summary = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const SummaryCard = styled.div`
  background-color: #1f1f1f;
  padding: 15px 20px;
  border-radius: 10px;
  border: 1px solid #d4af37;
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
`;

export default function AdminDashboard({ user }) {
  if (!user) return null;

  const [activeTab, setActiveTab] = useState("clients");
  const [clients, setClients] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- fetch clientes apenas uma vez no mount ---
  useEffect(() => {
    if (user) fetchClients();
  }, [user]);

  // --- fetch processos e updates quando mudar aba ---
  useEffect(() => {
    if (activeTab === "processes" || activeTab === "updates") fetchProcesses();
  }, [activeTab]);

  async function fetchClients() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("clients").select("*");
      if (error) console.error(error);
      setClients(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProcesses() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("processes")
        .select("*, process_updates(*)")
        .order("created_at", { ascending: true });
      if (error) console.error(error);
      setProcesses(
        data?.map((proc) => ({
          ...proc,
          updates: (proc.process_updates || []).sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          ),
        })) || []
      );
    } finally {
      setLoading(false);
    }
  }

  // --- resumo de status dos processos ---
  const totalProcesses = processes.length;
  const openProcesses = processes.filter(p => p.status !== "Fechado").length;
  const closedProcesses = processes.filter(p => p.status === "Fechado").length;

  return (
    <Container>
      <Title>LEX-Prime {user.nome}</Title>

      {totalProcesses > 0 && (
        <Summary>
          <SummaryCard>Total de Processos: {totalProcesses}</SummaryCard>
          <SummaryCard>Abertos: {openProcesses}</SummaryCard>
          <SummaryCard>Fechados: {closedProcesses}</SummaryCard>
        </Summary>
      )}

      <Tabs>
        <TabButton $active={activeTab==="clients"} onClick={()=>setActiveTab("clients")}>Clientes</TabButton>
        <TabButton $active={activeTab==="processes"} onClick={()=>setActiveTab("processes")}>Processos</TabButton>
        <TabButton $active={activeTab==="updates"} onClick={()=>setActiveTab("updates")}>Movimentações</TabButton>
      </Tabs>

      {loading && <p>Carregando...</p>}

      {/* --- CLIENTES --- */}
      <Section $active={activeTab==="clients"}>
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

      {/* --- PROCESSOS --- */}
      <Section $active={activeTab==="processes"}>
        <h2>Processos</h2>
        <ProcessForm clients={clients} refreshProcesses={fetchProcesses} />
        <Table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Título</th>
              <th>Status</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(p => (
              <tr key={p.id}>
                <td>{p.numero}</td>
                <td>{p.titulo}</td>
                <td>{p.status}</td>
                <td>{clients.find(c=>c.id===p.client_id)?.nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      {/* --- MOVIMENTAÇÕES --- */}
      <Section $active={activeTab==="updates"}>
        <h2>Movimentações</h2>
        <ProcessUpdateFormAdmin />
      </Section>
    </Container>
  );
}
