import styled, { keyframes } from "styled-components";
import { FaUserTie, FaRegClock, FaChartLine, FaLock } from "react-icons/fa";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  font-family: 'Merriweather', serif;
  color: #fff;
  background: linear-gradient(135deg, #121212, #1f1f1f);
  min-height: 100vh;
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 20px;
  background: linear-gradient(90deg, #d4af37, #ffd700);
  color: #000;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  animation: ${fadeInUp} 1s ease forwards;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
  animation: ${fadeInUp} 1.2s ease forwards;
`;

const HeroButton = styled.a`
  display: inline-block;
  padding: 15px 35px;
  font-weight: bold;
  border-radius: 50px;
  background-color: #000;
  color: #ffd700;
  text-decoration: none;
  font-size: 1.2rem;
  animation: ${fadeInUp} 1.4s ease forwards;
  transition: all 0.3s ease;
  &:hover {
    background-color: #333;
    transform: scale(1.05);
  }
`;

const Features = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  padding: 80px 20px;
`;

const FeatureCard = styled.div`
  background-color: #1f1f1f;
  padding: 30px;
  border-radius: 20px;
  width: 250px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.5);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #ffd700;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const FeatureDesc = styled.p`
  font-size: 1rem;
  color: #ccc;
`;

const CTASection = styled.section`
  background: #ffd700;
  color: #000;
  padding: 80px 20px;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const CTASubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
`;

export default function LandingPage() {
  return (
    <Container>
      <Hero>
        <HeroTitle>LexPrime para Advogados</HeroTitle>
        <HeroSubtitle>Conecte-se com seus clientes de forma transparente e profissional.</HeroSubtitle>
        <HeroButton href="https://wa.me/5534991448794">Solicitar Demonstração</HeroButton>
      </Hero>

      <Features>
        <FeatureCard>
          <FeatureIcon><FaUserTie /></FeatureIcon>
          <FeatureTitle>Gestão de Clientes</FeatureTitle>
          <FeatureDesc>Tenha controle total sobre cada cliente e processo, com histórico completo e comentários.</FeatureDesc>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon><FaRegClock /></FeatureIcon>
          <FeatureTitle>Atualizações em Tempo Real</FeatureTitle>
          <FeatureDesc>Seus clientes recebem notificações instantâneas sobre cada movimentação processual.</FeatureDesc>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon><FaChartLine /></FeatureIcon>
          <FeatureTitle>Diferencial Competitivo</FeatureTitle>
          <FeatureDesc>Mostre profissionalismo e transparência, se destacando frente à concorrência.</FeatureDesc>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon><FaLock /></FeatureIcon>
          <FeatureTitle>Segurança e Conformidade</FeatureTitle>
          <FeatureDesc>Proteja os dados dos clientes com conformidade total à LGPD e criptografia segura.</FeatureDesc>
        </FeatureCard>
      </Features>

      <CTASection>
        <CTATitle>Transforme seu atendimento jurídico</CTATitle>
        <CTASubtitle>Proporcione confiança, agilidade e transparência aos seus clientes.</CTASubtitle>
        <HeroButton href="https://wa.me/5534991448794">Agendar Demonstração Agora</HeroButton>
      </CTASection>
    </Container>
  );
}
