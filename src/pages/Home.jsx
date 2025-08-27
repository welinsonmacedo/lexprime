import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background-color: #000;
  color: #d4af37;
  font-family: 'Merriweather', serif;
  text-align: center;
  padding: 50px;
`;

const Button = styled.a`
  display: inline-block;
  margin-top: 30px;
  padding: 12px 30px;
  background-color: #d4af37;
  color: #000;
  font-weight: bold;
  border-radius: 10px;
  text-decoration: none;
`;

export default function Home() {
  return (
    <Container>
      <h1>LexPrime</h1>
      <p>Transparência e confiança no acompanhamento jurídico.</p>
      <Button href="https://wa.me/5511999999999">Solicitar Demonstração</Button>
    </Container>
  );
}
