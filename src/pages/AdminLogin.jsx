import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const Container = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh; background-color: #121212; color: #d4af37;
  font-family: 'Merriweather', serif;
`;

const Input = styled.input`
  padding: 10px; margin: 5px 0; width: 250px;
  border-radius: 6px; border: 1px solid #d4af37;
  background-color: #1f1f1f; color: #d4af37;
  &:focus { outline: none; border-color: #00b894; }
`;

const Button = styled.button`
  padding: 10px 20px; margin-top: 10px; border: none;
  border-radius: 6px; background-color: #00b894; color: #000;
  font-weight: bold; cursor: pointer; &:hover { opacity: 0.8; }
`;

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
const handleLogin = async () => {
  if (!email || !senha) {
    setError("Preencha email e senha");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha.trim(),
    });

    if (error) {
      setError("Email ou senha inválidos");
      return;
    }

    const user = data.user;

    // VERIFICAR SE É ADMIN (advogado) - você precisa ter o role salvo em user_metadata
    if (user.user_metadata.role !== "advogado") {
      setError("Usuário não autorizado como admin");
      return;
    }

    if (onLogin) onLogin(user);
    navigate("/admin");

  } catch (err) {
    console.error(err);
    setError("Ocorreu um erro inesperado");
  }
};

  return (
    <Container>
      <h1>Login Admin</h1>
      <Input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Input
        placeholder="Senha"
        type="password"
        value={senha}
        onChange={e => setSenha(e.target.value)}
      />
      <Button onClick={handleLogin}>Entrar</Button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </Container>
  );
}
