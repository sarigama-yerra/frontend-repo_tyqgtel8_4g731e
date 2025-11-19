import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function Dashboard({ token }) {
  const [vitals, setVitals] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API}/patient/vitals`, { headers })
      .then(r => r.json()).then(setVitals).catch(() => {});
    fetch(`${API}/patient/allergies`, { headers })
      .then(r => r.json()).then(setAllergies).catch(() => {});
    fetch(`${API}/patient/medications`, { headers })
      .then(r => r.json()).then(setMeds).catch(() => {});
  }, [token]);

  const bmi = vitals?.bmi ?? (vitals?.height_cm && vitals?.weight_kg ? (vitals.weight_kg / Math.pow(vitals.height_cm/100,2)).toFixed(2) : null);

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Patient Vitals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-blue-100">
            <Stat label="Height (cm)" value={vitals?.height_cm ?? '—'} />
            <Stat label="Weight (kg)" value={vitals?.weight_kg ?? '—'} />
            <Stat label="BMI" value={bmi ?? '—'} />
            <Stat label="Blood" value={vitals?.blood_group ? `${vitals.blood_group}${vitals.rh_factor || ''}` : '—'} />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Allergies</h2>
          </div>
          <div className="space-y-3">
            {allergies?.length ? allergies.map((a, i) => (
              <div key={i} className={`rounded-xl p-4 border ${a.emergency ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-center justify-between text-white">
                  <div className="font-medium">{a.substance}</div>
                  <div className="text-xs uppercase tracking-wide px-2 py-1 rounded bg-white/10">{a.severity}</div>
                </div>
                <div className="text-blue-200 text-sm mt-1">By {a.physician}</div>
              </div>
            )) : <div className="text-blue-200">No allergies on file.</div>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Current Medications</h2>
          <div className="space-y-3">
            {meds?.length ? meds.map((m, i) => (
              <div key={i} className="rounded-xl p-4 border border-white/10 bg-white/5 text-blue-100">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium">{m.name}</div>
                  <span className={`text-xs px-2 py-0.5 rounded ${m.approved ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{m.approved ? 'Approved' : 'Pending'}</span>
                </div>
                <div className="text-sm mt-1">{m.dosage} • {m.frequency}</div>
                {m.end_date && <div className="text-xs opacity-75">Until {m.end_date}</div>}
              </div>
            )) : <div className="text-blue-200">No medications listed.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-black/20 rounded-xl p-4 border border-white/10">
      <div className="text-blue-300 text-xs uppercase tracking-wide">{label}</div>
      <div className="text-white text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
