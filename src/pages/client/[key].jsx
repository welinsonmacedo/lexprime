import { supabase } from '../../lib/supabaseClient';
import { useEffect, useState } from 'react';
import ProcessTimeline from '../../components/ProcessTimeline';
import { useRouter } from 'next/router';

export default function ClientPortal() {
  const router = useRouter();
  const { key } = router.query;
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    if (!key) return;
    fetchProcesses();
  }, [key]);

  const fetchProcesses = async () => {
    const { data } = await supabase
      .from('clients')
      .select(`processes(*, process_updates(*))`)
      .eq('access_key', key)
      .single();

    setProcesses(data?.processes || []);
  };

  return (
    <div className="p-8 font-serif bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Seus Processos</h1>
      {processes.map(p => <ProcessTimeline key={p.id} process={p} />)}
    </div>
  );
}
