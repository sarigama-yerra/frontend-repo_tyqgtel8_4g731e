import { useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function Auth({ onAuth }) {
  const [tab, setTab] = useState('password');
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [qr, setQr] = useState('');
  const [biometric, setBiometric] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    try {
      let url = `${API}/auth/login/password`;
      let body = { id_number: idNumber, password };
      if (tab === 'qr') { url = `${API}/auth/login/qr`; body = { qr_code: qr }; }
      if (tab === 'biometric') { url = `${API}/auth/login/biometric`; body = { id_number: idNumber, biometric_token: biometric }; }
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).detail || 'Login failed');
      const data = await res.json();
      onAuth(data.token);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 md:px-10 -mt-16">
      <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex gap-2 mb-4">
          {['password','qr','biometric'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded text-sm ${tab===t ? 'bg-blue-600 text-white':'bg-white/10 text-blue-100'}`}>{t.toUpperCase()}</button>
          ))}
        </div>

        {tab === 'password' && (
          <div className="space-y-3">
            <Input label="ID Number" value={idNumber} onChange={e=>setIdNumber(e.target.value)} />
            <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
        )}
        {tab === 'qr' && (
          <div className="space-y-3">
            <Input label="QR Code Payload" value={qr} onChange={e=>setQr(e.target.value)} />
            <p className="text-xs text-blue-300">Use your ID number as QR payload for demo access.</p>
          </div>
        )}
        {tab === 'biometric' && (
          <div className="space-y-3">
            <Input label="ID Number" value={idNumber} onChange={e=>setIdNumber(e.target.value)} />
            <Input label="Biometric Token" value={biometric} onChange={e=>setBiometric(e.target.value)} />
          </div>
        )}

        {error && <div className="text-red-300 text-sm mt-3">{error}</div>}
        <button onClick={submit} className="mt-4 w-full bg-blue-600 hover:bg-blue-500 transition text-white rounded-lg py-2.5 font-medium">Continue</button>

        <DemoHelper />
      </div>
    </section>
  );
}

function Input({ label, ...props }){
  return (
    <label className="block">
      <div className="text-blue-200 text-sm mb-1">{label}</div>
      <input {...props} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </label>
  );
}

function DemoHelper(){
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 text-xs text-blue-200/80">
      <button onClick={()=>setOpen(!open)} className="underline">Need demo credentials?</button>
      {open && (
        <div className="mt-2 bg-black/30 border border-white/10 rounded p-3">
          <p>Create a demo user via API:</p>
          <code className="block mt-1 break-all">POST /auth/bootstrap {{"id_number":"123456","full_name":"Jane Doe","password":"secret","role":"patient"}}</code>
        </div>
      )}
    </div>
  );
}
