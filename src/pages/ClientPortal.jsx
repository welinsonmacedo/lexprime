import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import styled from "styled-components";

const Container = styled.div`
  padding: 30px;
  font-family: "Merriweather", serif;
  background-color: #121212;
  color: #d4af37;
  min-height: 100vh;
`;

const NotificationBar = styled.div`
  padding: 10px;
  background-color: #00b894;
  color: #000;
  border-radius: 5px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const ProcessCard = styled.div`
  border: 1px solid #d4af37;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  background-color: #1f1f1f;
`;

const ProcessHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Timeline = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 15px;
`;

const TimelineItem = styled.li`
  position: relative;
  margin-bottom: 25px;
  padding-left: 20px;
  border-left: 3px solid #d4af37;

  &::before {
    content: '';
    position: absolute;
    left: -7px;
    top: 0;
    width: 14px;
    height: 14px;
    background-color: #d4af37;
    border-radius: 50%;
  }
`;

const UpdateContent = styled.div`
  margin-bottom: 10px;
`;

const ActionsWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background-color: ${(props) => (props.$primary ? "#00b894" : "#d4af37")};
  color: #000;
  &:hover {
    opacity: 0.8;
  }
`;

const CommentInput = styled.textarea`
  margin-top: 5px;
  width: 95%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #d4af37;
  background-color: #121212;
  color: #d4af37;
`;

const LGPDModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #d4af37;
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
`;

const LGPDModalContent = styled.div`
  max-height: ${(props) => (props.expanded ? "70vh" : "150px")};
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #d4af37;
  border-radius: 5px;
`;

export default function ClientPortal() {
  const { key } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentEdits, setCommentEdits] = useState({});
  const [expandedProcesses, setExpandedProcesses] = useState({});
  const [showLGPD, setShowLGPD] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expandedLGPD, setExpandedLGPD] = useState(false);

  const now = new Date();
  const saoPauloTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );

  // Carrega processos do cliente
  async function loadProcesses(clientId) {
    const { data: clientProcesses } = await supabase
      .from("processes")
      .select("*")
      .eq("client_id", clientId);

    if (clientProcesses?.length > 0) {
      const processesWithUpdates = await Promise.all(
        clientProcesses.map(async (proc) => {
          const { data: updates } = await supabase
            .from("process_updates")
            .select("*")
            .eq("process_id", proc.id)
            .order("created_at", { ascending: true });
          return { ...proc, updates: updates || [] };
        })
      );

      setProcesses(processesWithUpdates);

      const initialEdits = {};
      const newNotifications = [];

      processesWithUpdates.forEach((proc) => {
        proc.updates.forEach((u) => {
          initialEdits[u.id] = u.client_comment || "";
          if (!u.seen_by_client) {
            newNotifications.push({
              processNumber: proc.numero,
              processTitle: proc.titulo,
              updateId: u.id,
              description: u.descricao,
              createdAt: u.created_at,
            });
          }
        });
      });

      setCommentEdits(initialEdits);
      setNotifications(newNotifications);
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const accessKey = key || localStorage.getItem("client_access_key");
      if (!accessKey) {
        navigate("/login");
        return;
      }

      const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("access_key", accessKey)
        .single();

      if (!client) {
        navigate("/login");
        return;
      }

      setClientData(client);
      localStorage.setItem("client_access_key", accessKey);

      if (!client.lgpd_accepted) {
        setShowLGPD(true);
        setLoading(false);
        return;
      }

      await loadProcesses(client.id);
      setLoading(false);
    }

    fetchData();
  }, [key, navigate]);

  async function acceptLGPD() {
    if (!clientData) return;
    await supabase.from("clients").update({
      lgpd_accepted: true,
      lgpd_accepted_at: new Date()
    }).eq("id", clientData.id);

    setClientData({ ...clientData, lgpd_accepted: true });
    setShowLGPD(false);

    await loadProcesses(clientData.id);
  }

  async function revokeLGPD() {
    if (!clientData) return;
    await supabase.from("clients").update({
      lgpd_accepted: false
    }).eq("id", clientData.id);

    setClientData({ ...clientData, lgpd_accepted: false });
    setShowLGPD(true);
  }

  const closeLGPDModal = () => {
  if (clientData?.lgpd_accepted) {
    // Já aceitou → só fecha o modal, permanece no portal
    setShowLGPD(false);
  } else {
    // Não aceitou → institucional
    navigate("/");
  }
};


  async function markAsSeen(update) {
    await supabase
      .from("process_updates")
      .update({ seen_by_client: true })
      .eq("id", update.id);

    setProcesses((prev) =>
      prev.map((p) => ({
        ...p,
        updates: p.updates.map((u) =>
          u.id === update.id ? { ...u, seen_by_client: true } : u
        ),
      }))
    );

    setNotifications((prev) =>
      prev.filter(n => n.updateId !== update.id)
    );
  }

  async function sendComment(update) {
     const comment = commentEdits[update.id];
  if (!comment) return;

  await supabase
    .from("process_updates")
    .update({
      client_comment: comment,
      client_comment_created_at: saoPauloTime,
    })
    .eq("id", update.id);

  setProcesses((prev) =>
    prev.map((p) => ({
      ...p,
      updates: p.updates.map((u) =>
        u.id === update.id
          ? { ...u, client_comment: comment, client_comment_created_at: new Date() }
          : u
      ),
    }))
  );

  // Limpa o input após enviar
  setCommentEdits((prev) => ({ ...prev, [update.id]: "" }));
};

  const isEditable = (update) => {
    if (!update.client_comment_created_at) return true;
    const createdAt = new Date(update.client_comment_created_at);
    const now = new Date();
    return (now - createdAt) / 1000 / 60 <= 5;
  };

  const toggleProcess = (id) => {
    setExpandedProcesses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const logout = () => {
    localStorage.removeItem("client_access_key");
    navigate("/login");
  };

  if (loading) return <Container>Carregando...</Container>;
  if (!clientData) return <Container>Chave inválida ou cliente não encontrado.</Container>;

  return (
    <Container>
      <h1>Bem-vindo, {clientData.nome}</h1>
      <p>Telefone: {clientData.telefone}</p>
      <p>Email: {clientData.email}</p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Button onClick={logout}>Logout</Button>
        <Button onClick={() => setShowLGPD(true)}>Política de Privacidade</Button>
      </div>

      {notifications.length > 0 && (
        <NotificationBar>
          Você possui {notifications.length} nova{notifications.length > 1 ? "s" : ""} movimentação{notifications.length > 1 ? "s" : ""}!
        </NotificationBar>
      )}

      {processes.length === 0 && <p>Você ainda não possui processos cadastrados.</p>}

      {processes.map((proc) => (
        <ProcessCard key={proc.id}>
          <ProcessHeader onClick={() => toggleProcess(proc.id)}>
            <div>
              <strong>{proc.numero} - {proc.titulo}</strong>
              <p>Status atual: {proc.status}</p>
            </div>
            <Button>{expandedProcesses[proc.id] ? "-" : "+"}</Button>
          </ProcessHeader>

          {expandedProcesses[proc.id] && (
            <Timeline>
              {proc.updates.length > 0 ? proc.updates.map((update) => {
                const editable = isEditable(update);
                return (
                  <TimelineItem key={update.id}>
                    <UpdateContent>
                      <strong>{new Date(update.created_at).toLocaleString()}:</strong>{" "}
                      {update.descricao}{" "}
                      {update.seen_by_client && <span style={{ color: "#00b894" }}>✔</span>}
                      {update.client_comment && (
                        <p style={{ marginTop: "5px", fontStyle: "italic", color: "#00b894" }}>
                          Seu comentário: {update.client_comment}
                        </p>
                      )}
                    </UpdateContent>

                    <ActionsWrapper>
                      {!update.seen_by_client && (
                        <Button $primary onClick={() => markAsSeen(update)}>
                          Marcar como visto
                        </Button>
                      )}
                      <CommentInput
                        value={commentEdits[update.id]}
                        onChange={(e) =>
                          setCommentEdits((prev) => ({ ...prev, [update.id]: e.target.value }))
                        }
                        readOnly={!editable}
                        placeholder={editable ? "Adicionar comentário" : "Comentário não pode mais ser editado"}
                      />
                      {editable && <Button onClick={() => sendComment(update)}>Enviar</Button>}
                    </ActionsWrapper>
                  </TimelineItem>
                );
              }) : <p>Sem movimentações até o momento.</p>}
            </Timeline>
          )}
        </ProcessCard>
      ))}

      {showLGPD && (
        <LGPDModal>
          <h2>Política de Privacidade</h2>

          <LGPDModalContent expanded={expandedLGPD}>
            <p>1. Coleta de Dados: coletamos informações como nome, email e telefone.</p>
            <p>2. Uso de Dados: dados usados apenas para fins administrativos.</p>
            <p>3. Armazenamento e Segurança: armazenamos em servidores seguros.</p>
            <p>4. Compartilhamento: não compartilhamos sem seu consentimento.</p>
            <p>5. Consentimento: ao aceitar, você concorda com a coleta e uso.</p>
          </LGPDModalContent>

          <Button onClick={() => setExpandedLGPD(!expandedLGPD)}>
            {expandedLGPD ? "Ver menos" : "Ler política"}
          </Button>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            {!clientData.lgpd_accepted && (
              <Button $primary onClick={acceptLGPD}>Aceitar</Button>
            )}
            {clientData.lgpd_accepted && (
              <Button onClick={revokeLGPD}>Revogar</Button>
            )}
            <Button onClick={closeLGPDModal}>Fechar</Button>
          </div>
        </LGPDModal>
      )}
    </Container>
  );
}
