import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Input, AddButton } from "./FormComponents";
import Select from "react-select";
import styled from "styled-components";
import { FaEdit, FaSave, FaCheck } from "react-icons/fa";

const ProcessContainer = styled.div`
  border: 1px solid #d4af37;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  background-color: #1f1f1f;
`;

const ProcessHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Timeline = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 10px;
`;

const TimelineItem = styled.li`
  position: relative;
  margin-bottom: 15px;
  padding-left: 20px;
  border-left: 3px solid #d4af37;

  &::before {
    content: "";
    position: absolute;
    left: -7px;
    top: 0;
    width: 14px;
    height: 14px;
    background-color: #d4af37;
    border-radius: 50%;
  }
`;

const Button = styled.button`
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background-color: ${(props) => (props.primary ? "#00b894" : "#d4af37")};
  color: #000;
  &:hover {
    opacity: 0.8;
  }
`;

export default function ProcessUpdateFormAdmin() {
  const [processes, setProcesses] = useState([]);
  const [clients, setClients] = useState([]);
  const [processId, setProcessId] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState({});
  const [editValues, setEditValues] = useState({});
  const [filterClient, setFilterClient] = useState(null);
  const [filterProcess, setFilterProcess] = useState(null);

  const fetchData = async () => {
    const { data: clientsData } = await supabase.from("clients").select("*");
    setClients(clientsData || []);

    const { data: processesData } = await supabase
      .from("processes")
      .select("*, process_updates(*)")
      .order("created_at", { ascending: true });

    setProcesses(
      processesData?.map((proc) => ({
        ...proc,
        updates: (proc.process_updates || []).sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        ),
      })) || []
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processOptions = processes.map((p) => {
    const clientName =
      clients.find((c) => c.id === p.client_id)?.nome || "Cliente";
    return { value: p.id, label: `${p.numero} - ${p.titulo} (${clientName})` };
  });

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.nome }));

  const addUpdate = async () => {
    if (!processId) return alert("Selecione um processo");
    const now = new Date();
    await supabase
      .from("process_updates")
      .insert([
        {
          process_id: processId.value,
          descricao,
          created_at: now.toISOString(),
        },
      ]);
    setProcessId(null);
    setDescricao("");
    fetchData();
  };

  const toggleProcess = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const finalizeProcess = async (proc) => {
    if (!window.confirm("Deseja realmente finalizar este processo?")) return;
    await supabase
      .from("processes")
      .update({ status: "Fechado" })
      .eq("id", proc.id);
    fetchData();
  };

  const printTimeline = (proc) => {
    const clientName =
      clients.find((c) => c.id === proc.client_id)?.nome || "Cliente";
    const timelineText = (proc.updates || [])
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map(
        (u) =>
          `${new Date(u.created_at).toLocaleString()} - ${clientName} - ${
            proc.numero
          } - ${proc.titulo}: ${u.descricao}`
      )
      .join("\n");
    const popup = window.open("", "_blank");
    popup.document.write(`
      <html>
        <head>
          <title>Linha do Tempo</title>
          <style>
            body { font-family: Arial; background: #1f1f1f; color: #d4af37; padding: 20px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h2>Processo: ${proc.numero} - ${proc.titulo}</h2>
          <h3>Cliente: ${clientName}</h3>
          <pre>${timelineText}</pre>
        </body>
      </html>
    `);
    popup.print();
  };

  const startEditing = (updateId, descricao) => {
    setEditing((prev) => ({ ...prev, [updateId]: true }));
    setEditValues((prev) => ({ ...prev, [updateId]: descricao }));
  };

  const saveEdit = async (updateId) => {
    await supabase
      .from("process_updates")
      .update({ descricao: editValues[updateId] })
      .eq("id", updateId);
    setEditing((prev) => ({ ...prev, [updateId]: false }));
    fetchData();
  };

  // eslint-disable-next-line no-unused-vars
  const markAsSeen = async (update) => {
    await supabase
      .from("process_updates")
      .update({ seen_by_client: true })
      .eq("id", update.id);
    fetchData();
  };

  const filteredProcesses = processes
    .filter((p) => {
      const matchesClient = filterClient
        ? p.client_id === filterClient.value
        : true;
      const matchesProcess = filterProcess
        ? p.id === filterProcess.value
        : true;
      return matchesClient && matchesProcess;
    })
    .sort((a, b) => {
      if (a.status === "Fechado" && b.status !== "Fechado") return 1;
      if (a.status !== "Fechado" && b.status === "Fechado") return -1;
      return new Date(a.created_at) - new Date(b.created_at);
    });

  return (
    <div>
      <h3>Adicionar movimentação</h3>
      <Select
        placeholder="Selecione Processo"
        options={processOptions}
        value={processId}
        onChange={setProcessId}
        styles={{
          control: (base) => ({ ...base, backgroundColor: "#b8adad" }),
        }}
      />
      <Input
        placeholder="Descrição da movimentação"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <AddButton onClick={addUpdate}>Adicionar Movimentação</AddButton>

      <hr style={{ margin: "15px 0", borderColor: "#d4af37" }} />

      {/* Filtros */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <Select
          placeholder="Filtrar por cliente"
          options={clientOptions}
          value={filterClient}
          onChange={setFilterClient}
          isClearable
        />
        <Select
          placeholder="Filtrar por processo"
          options={processOptions}
          value={filterProcess}
          onChange={setFilterProcess}
          isClearable
        />
      </div>

      {filteredProcesses.map((proc) => {
        const clientName =
          clients.find((c) => c.id === proc.client_id)?.nome || "Cliente";
        const showUpdates = expanded[proc.id]
          ? proc.updates
          : (proc.updates || []).slice(0, 1);

        return (
          <ProcessContainer key={proc.id}>
            <ProcessHeader>
              <div>
                <strong>
                  {proc.numero} - {proc.titulo}
                </strong>
                <p>
                  Cliente: {clientName} | Status: {proc.status}
                </p>
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <Button onClick={() => toggleProcess(proc.id)}>
                  {expanded[proc.id] ? "▲" : "▼"}
                </Button>
                <Button onClick={() => finalizeProcess(proc)}>Finalizar</Button>
                <Button onClick={() => printTimeline(proc)}>Imprimir</Button>
              </div>
            </ProcessHeader>

            <Timeline>
              {showUpdates.map((update) => (
                <TimelineItem key={update.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {editing[update.id] ? (
                      <>
                        <Input
                          value={editValues[update.id]}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [update.id]: e.target.value,
                            }))
                          }
                        />
                        <FaSave
                          style={{ cursor: "pointer" }}
                          onClick={() => saveEdit(update.id)}
                        />
                      </>
                    ) : (
                      <>
                        <span>
                          <strong>
                            {new Date(update.created_at).toLocaleString()}:
                          </strong>{" "}
                          {update.descricao}{" "}
                          {update.seen_by_client && (
                            <FaCheck
                              title="Visualizado pelo cliente"
                              style={{ color: "#00b894", marginLeft: "5px" }}
                            />
                          )}
                        </span>

                        <FaEdit
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() =>
                            startEditing(update.id, update.descricao)
                          }
                        />
                      </>
                    )}
                  </div>
                </TimelineItem>
              ))}
              {proc.updates.length > 1 && !expanded[proc.id] && (
                <Button onClick={() => toggleProcess(proc.id)}>
                  Ver mais etapas...
                </Button>
              )}
            </Timeline>
          </ProcessContainer>
        );
      })}
    </div>
  );
}
