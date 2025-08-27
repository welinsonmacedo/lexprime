export default function ProcessTimeline({ process }) {
    return (
      <div className="bg-white shadow p-4 mb-6 rounded">
        <h2 className="font-semibold">{process.titulo} - {process.numero}</h2>
        <p>Status atual: {process.status}</p>
        <div className="mt-2">
          {process.process_updates.map(u => (
            <div key={u.id} className="border-l-2 border-gold pl-4 mb-2">
              <p>{u.descricao}</p>
              <small className="text-gray-500">{new Date(u.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }
  