import { useParams } from "react-router-dom";
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

const ProcessCard = styled.div`
  border: 1px solid #d4af37;
  padding: 20px;
  margin-bottom: 25px;
  border-radius: 10px;
  background-color: #1f1f1f;
`;

const Timeline = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const TimelineItem = styled.li`
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #d4af37;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const UpdateActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 200px;
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

const CommentInput = styled.textarea`
  margin-top: 5px;
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #d4af37;
  background-color: #121212;
  color: #d4af37;
`;

export default function ClientPortal() {
  const { key } = useParams();
  const [clientData, setClientData] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentEdits, setCommentEdits] = useState({}); // para controlar campo editável
  const now = new Date();
  const saoPauloTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("access_key", key)
        .single();

      if (!client) {
        setClientData(null);
        setLoading(false);
        return;
      }

      setClientData(client);

      const { data: clientProcesses } = await supabase
        .from("processes")
        .select("*")
        .eq("client_id", client.id);

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

        // inicializa estados de edição
        const initialEdits = {};
        processesWithUpdates.forEach((proc) => {
          proc.updates.forEach((u) => {
            initialEdits[u.id] = u.client_comment || "";
          });
        });
        setCommentEdits(initialEdits);
      }
      setLoading(false);
    }

    fetchData();
  }, [key]);

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
            ? {
                ...u,
                client_comment: comment,
                client_comment_created_at: new Date(),
              }
            : u
        ),
      }))
    );
  }

  const isEditable = (update) => {
    if (!update.client_comment_created_at) return true; // nunca enviou
    const createdAt = new Date(update.client_comment_created_at).toLocaleString(
      "pt-BR",
      { timeZone: "America/Sao_Paulo" }
    );

    const now = new Date();
    return (now - createdAt) / 1000 / 60 <= 5; // até 5 minutos
  };

  if (loading) return <Container>Carregando...</Container>;
  if (!clientData)
    return <Container>Chave inválida ou cliente não encontrado.</Container>;

  return (
    <Container>
      <h1>Bem-vindo, {clientData.nome}</h1>
      <p>Telefone: {clientData.telefone}</p>
      <p>Email: {clientData.email}</p>

      {processes.length === 0 && (
        <p>Você ainda não possui processos cadastrados.</p>
      )}

      {processes.map((proc) => (
        <ProcessCard key={proc.id}>
          <h2>
            {proc.numero} - {proc.titulo}
          </h2>
          <p>Status atual: {proc.status}</p>

          {proc.updates.length > 0 ? (
            <Timeline>
              {proc.updates.map((update) => {
                const editable = isEditable(update);
                return (
                  <TimelineItem key={update.id}>
                    <div>
                      <strong>
                        {new Date(update.created_at).toLocaleString()}:
                      </strong>{" "}
                      {update.descricao}
                      {update.client_comment && (
                        <p
                          style={{
                            marginTop: "5px",
                            fontStyle: "italic",
                            color: "#00b894",
                          }}
                        >
                          Seu comentário: {update.client_comment}
                        </p>
                      )}
                    </div>
                    <UpdateActions>
                      {!update.seen_by_client && (
                        <Button primary onClick={() => markAsSeen(update)}>
                          Marcar como visto
                        </Button>
                      )}
                      <CommentInput
                        value={commentEdits[update.id]}
                        onChange={(e) =>
                          setCommentEdits((prev) => ({
                            ...prev,
                            [update.id]: e.target.value,
                          }))
                        }
                        readOnly={!editable}
                        placeholder={
                          editable
                            ? "Adicionar comentário"
                            : "Comentário não pode mais ser editado"
                        }
                      />
                      {editable && (
                        <Button onClick={() => sendComment(update)}>
                          Enviar
                        </Button>
                      )}
                    </UpdateActions>
                  </TimelineItem>
                );
              })}
            </Timeline>
          ) : (
            <p>Sem movimentações até o momento.</p>
          )}
        </ProcessCard>
      ))}
    </Container>
  );
}
