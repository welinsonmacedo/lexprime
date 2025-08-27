export default function Navbar() {
    return (
      <nav className="flex justify-between items-center p-6 bg-black text-gold">
        <div className="text-2xl font-bold">LexPrime</div>
        <div>
          <a href="#about" className="mx-2">Sobre</a>
          <a href="#benefits" className="mx-2">Benefícios</a>
        </div>
      </nav>
    );
  }
  