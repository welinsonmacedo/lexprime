import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background-color: #000;
  color: #d4af37;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Merriweather', serif;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #d4af37;
  background-color: #111;
  color: #d4af37;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #d4af37;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
`;

export default function ClientLogin() {
  const [key, setKey] = useState("");
  const navigate = useNavigate();

  function handleLogin() {
    if (!key) return alert("Digite sua chave!");
    navigate(`/client/${key}`);
  }

  return (
    <Container>
      <h1>Login do Cliente</h1>
      <Input
        placeholder="Digite sua chave de acesso"
        value={key}
        onChange={(e) => setKey(e.target.value.toUpperCase())}
      />
      <Button onClick={handleLogin}>Entrar</Button>
    </Container>
  );
}
