import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="font-serif bg-black text-white min-h-screen">
      <Navbar />
      <main className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold text-gold">LexPrime</h1>
        <p className="mt-4 text-xl">Transparência e confiança no acompanhamento jurídico.</p>
        <a 
          href="https://wa.me/5511999999999" 
          className="mt-8 inline-block bg-gold text-black px-6 py-3 rounded-lg font-semibold"
        >
          Solicitar Demonstração
        </a>
      </main>
      <Footer />
    </div>
  );
}
