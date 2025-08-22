import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const resp = await fetch(
      'https://<YOUR_PROJECT>.functions.supabase.co/analyze-and-generate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session?.access_token}`
        },
        body: JSON.stringify({ project_id: 'default-project', url })
      }
    );
    const data = await resp.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <input
        type="text"
        placeholder="https://..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={analyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Run'}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>CRO Score: {result.cro?.score}</h2>
          <pre>{JSON.stringify(result.cro?.findings, null, 2)}</pre>
          <h3>LinkedIn</h3>
          <p>{result.ads?.linkedin}</p>
          <h3>Google Ads</h3>
          <p>{result.ads?.google}</p>
          <h3>Meta Ads</h3>
          <p>{result.ads?.meta}</p>
        </div>
      )}
    </div>
  );
}
