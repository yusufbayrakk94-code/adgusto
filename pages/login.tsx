import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) setSent(true);
    else alert(error.message);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      {sent ? (
        <p>Login link sent to {email}</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleLogin}>Send Magic Link</button>
        </>
      )}
    </div>
  );
}
