export default function ProcessList({ processes }) {
    return (
      <div>
        {processes.map(p => (
          <div key={p.id} className="bg-white shadow p-4 mb-4 rounded">
            <h2 className="font-semibold">{p.titulo} - {p.numero}</h2>
            <p>Cliente: {p.clients.nome}</p>
            <p>Status: {p.status}</p>
          </div>
        ))}
      </div>
    );
  }
  