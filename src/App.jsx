import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function App() {
  const [token, setToken] = useState('');
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => r.json()).then(setMe).catch(()=>{});
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-blue-100">
      <Hero />

      {!token ? (
        <Auth onAuth={setToken} />
      ) : (
        <div>
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
            <div>
              <div className="text-blue-300 text-sm">Welcome</div>
              <div className="text-white text-xl font-semibold">{me?.user?.full_name || 'User'}</div>
            </div>
            <button onClick={()=>{setToken(''); setMe(null);}} className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2">Logout</button>
          </div>
          <Dashboard token={token} />
        </div>
      )}

      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 text-xs text-blue-300/70">This is a web preview of PulsePoint. Native app features like biometrics and smartwatch sync are simulated.</div>
      </footer>
    </div>
  );
}

export default App
