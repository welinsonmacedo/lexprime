import styled, { keyframes } from "styled-components";
import { FaShieldAlt, FaRegClock, FaUsers, FaChartLine } from "react-icons/fa";

// ===== ANIMAÇÕES =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
`;

const Container = styled.div`
  font-family: 'Merriweather', serif;
  background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%);
  color: #d4af37;
`;

const Header = styled.header`
  text-align: center;
  padding: 80px 20px 40px;
  background: linear-gradient(90deg, #000000 0%, #1f1f1f 100%);
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  animation: ${fadeIn} 1s ease forwards;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  max-width: 700px;
  margin: 0 auto 30px;
  animation: ${fadeIn} 1.5s ease forwards;
`;

const Button = styled.a`
  display: inline-block;
  margin-top: 20px;
  padding: 14px 35px;
  background: #d4af37;
  color: #000;
  font-weight: bold;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  animation: ${fadeIn} 2s ease forwards;

  &:hover {
    background: #c59c2d;
    transform: scale(1.05);
  }
`;

// ===== SEÇÕES =====
const Section = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  max-width: 900px;
  margin: 0 auto 50px;
  color: #fff1d6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
`;

const FeatureCard = styled.div`
  background: #1f1f1f;
  border: 2px solid #d4af37;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 15px 35px rgba(212, 175, 55, 0.4);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #d4af37;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const FeatureDesc = styled.p`
  font-size: 1.1rem;
  color: #fff1d6;
`;

// ===== FOOTER =====
const Footer = styled.footer`
  padding: 50px 20px;
  text-align: center;
  border-top: 2px solid #d4af37;
  background-color: #121212;
  color: #fff1d6;
`;

// ===== COMPONENTE =====
export default function Home() {
  return (
    <Container>
      <Header>
        <Title>LexPrime</Title>
        <Subtitle>
          Transparência, confiança e controle total sobre seus processos jurídicos. 
          Experimente uma nova forma de acompanhar seu caso.
        </Subtitle>
        <Button href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
          Solicitar Demonstração
        </Button>
      </Header>

      {/* O que fazemos */}
      <Section>
        <SectionTitle>O que fazemos</SectionTitle>
        <SectionSubtitle>
          LexPrime facilita a vida de clientes e escritórios jurídicos com acompanhamento transparente e centralizado dos processos.
        </SectionSubtitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon><FaRegClock /></FeatureIcon>
            <FeatureTitle>Atualizações em tempo real</FeatureTitle>
            <FeatureDesc>Receba notificações instantâneas sobre cada movimentação do seu processo.</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaUsers /></FeatureIcon>
            <FeatureTitle>Comentários do cliente</FeatureTitle>
            <FeatureDesc>Adicione feedback ou questionamentos diretamente no processo, aumentando transparência e comunicação.</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaShieldAlt /></FeatureIcon>
            <FeatureTitle>Segurança e privacidade</FeatureTitle>
            <FeatureDesc>Todos os dados são armazenados de forma segura e protegidos por criptografia avançada.</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaChartLine /></FeatureIcon>
            <FeatureTitle>Controle total</FeatureTitle>
            <FeatureDesc>Acompanhe histórico completo do processo e indicadores de desempenho de forma clara e intuitiva.</FeatureDesc>
          </FeatureCard>
        </FeaturesGrid>
      </Section>

      {/* Projeto & Documentação */}
      <Section style={{ background: "#0d0d0d", color: "#d4af37" }}>
        <SectionTitle>Projeto & Documentação</SectionTitle>
        <SectionSubtitle>
          Desenvolvemos a plataforma pensando em integração, manutenção e escalabilidade. 
          Toda documentação e fluxo de processos estão organizados para fácil entendimento.
        </SectionSubtitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>Fluxos estruturados</FeatureTitle>
            <FeatureDesc>Arquitetura clara para acompanhamento do cliente e operação eficiente do escritório.</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureTitle>Documentação detalhada</FeatureTitle>
            <FeatureDesc>Explicações do backend, frontend e banco de dados, garantindo transparência técnica.</FeatureDesc>
          </FeatureCard>
        </FeaturesGrid>
      </Section>

      {/* Contato */}
      <Section>
        <SectionTitle>Fale conosco</SectionTitle>
        <SectionSubtitle>
          Quer conhecer a LexPrime ou tirar dúvidas sobre nossos serviços? Entre em contato!
        </SectionSubtitle>
        <Button href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
          Contato via WhatsApp
        </Button>
      </Section>

      <Footer>
        &copy; {new Date().getFullYear()} LexPrime. Todos os direitos reservados.
      </Footer>
    </Container>
  );
}
