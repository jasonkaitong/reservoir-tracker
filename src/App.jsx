import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, CartesianGrid } from "recharts";

const DEFAULT_PASS_COST = 140;
const DEFAULT_PASS_DATE = "2026-03-30";
const ACTIVITIES = ["Main Trail", "Rim Trail", "Fishing", "Picnic"];
const ACT_COLOR = { "Main Trail": "#3ecfb9", "Rim Trail": "#d4a853", "Fishing": "#7ab8e8", "Picnic": "#9fd46a" };
const ACT_ICON = { "Main Trail": "🥾", "Rim Trail": "⛰️", "Fishing": "🎣", "Picnic": "🧺" };

const SEED = [
  { id: 1, date: "2026-03-30", parkingCost: 0, duration: 90, activity: "Main Trail", notes: "First visit with annual pass! Beautiful spring morning." },
  { id: 2, date: "2026-03-15", parkingCost: 6, duration: 75, activity: "Rim Trail", notes: "Windy but incredible views of the reservoir." },
  { id: 3, date: "2026-02-28", parkingCost: 6, duration: 45, activity: "Fishing", notes: "Peaceful morning, no bites." },
  { id: 4, date: "2026-02-14", parkingCost: 6, duration: 120, activity: "Main Trail", notes: "Valentine's Day walk, perfect weather." },
  { id: 5, date: "2026-01-20", parkingCost: 6, duration: 60, activity: "Main Trail", notes: "New year energy, crisp morning air." },
];

const fmtDur = (m) => {
  const h = Math.floor(m / 60), r = m % 60;
  return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${r}m`;
};
const fmtDate = (s) => new Date(s + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtMo = (s) => { const [y, m] = s.split("-"); return new Date(+y, +m - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" }); };

const ReservoirLogo = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="34" fill="#162b25" stroke="#2a5047" strokeWidth="1"/>
    <path d="M20 38 L36 18 L52 38" fill="#1e4035" opacity="0.9"/>
    <path d="M15 38 L25 26 L35 38" fill="#163328" opacity="0.6"/>
    <ellipse cx="36" cy="42" rx="22" ry="12" fill="#0e2a22" opacity="0.8"/>
    <path d="M12 39 Q19 34 26 39 Q33 44 40 39 Q47 34 60 39" stroke="#3ecfb9" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M16 46 Q22 41 28 46 Q34 51 40 46 Q46 41 56 46" stroke="#3ecfb9" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6"/>
    <path d="M20 52 Q26 48 32 52 Q38 56 44 52 Q50 48 54 52" stroke="#3ecfb9" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.3"/>
  </svg>
);

const BatteryIcon = () => (
  <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
    <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.5"/>
    <rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor"/>
    <path d="M23 4v4a2 2 0 000-4z" fill="currentColor" fillOpacity="0.4"/>
  </svg>
);

const SignalIcon = () => (
  <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
    <rect x="0" y="5" width="3" height="7" rx="1" opacity="0.4"/>
    <rect x="4.5" y="3" width="3" height="9" rx="1" opacity="0.6"/>
    <rect x="9" y="1" width="3" height="11" rx="1" opacity="0.8"/>
    <rect x="13.5" y="0" width="3" height="12" rx="1"/>
  </svg>
);

export default function App() {
  const [tab, setTab] = useState("home");
  const [visits, setVisits] = useState([]);
  const [settings, setSettings] = useState({ passCost: DEFAULT_PASS_COST, passDate: DEFAULT_PASS_DATE });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ passCost: DEFAULT_PASS_COST, passDate: DEFAULT_PASS_DATE });
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    date: new Date().toLocaleDateString('en-CA'),
    parkingCost: "",
    duration: "",
    activity: "Main Trail",
    weight: "",
    notes: ""
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(link);

    (async () => {
      try {
        const r = await window.storage.get("lr_visits_v2");
        setVisits(JSON.parse(r.value));
      } catch {
        setVisits(SEED);
      }
      try {
        const s = await window.storage.get("lr_settings_v1");
        const parsed = JSON.parse(s.value);
        setSettings(parsed);
        setSettingsForm(parsed);
      } catch {
        // use defaults
      }
      setReady(true);
    })();
  }, []);

  const persist = async (v) => {
    try { await window.storage.set("lr_visits_v2", JSON.stringify(v)); } catch { }
  };

  const persistSettings = async (s) => {
    try { await window.storage.set("lr_settings_v1", JSON.stringify(s)); } catch { }
  };

  const saveSettings = () => {
    const newS = { passCost: parseFloat(settingsForm.passCost) || DEFAULT_PASS_COST, passDate: settingsForm.passDate || DEFAULT_PASS_DATE };
    setSettings(newS);
    persistSettings(newS);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const addVisit = () => {
    if (!form.date || !form.duration) return;
    const v = {
      id: Date.now(),
      date: form.date,
      parkingCost: parseFloat(form.parkingCost) || 0,
      duration: parseInt(form.duration) || 0,
      activity: form.activity,
      weight: parseFloat(form.weight) || null,
      notes: form.notes.trim()
    };
    const updated = [...visits, v].sort((a, b) => b.date.localeCompare(a.date));
    setVisits(updated);
    persist(updated);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm({ date: new Date().toLocaleDateString('en-CA'), parkingCost: "", duration: "", activity: "Main Trail", weight: "", notes: "" });
      setTab("home");
    }, 1400);
  };

  const deleteVisit = (id) => {
    const updated = visits.filter(v => v.id !== id);
    setVisits(updated);
    persist(updated);
    setDeleteId(null);
  };

  const openEdit = (v) => {
    setEditId(v.id);
    setEditForm({
      date: v.date,
      parkingCost: v.parkingCost ?? "",
      duration: v.duration ?? "",
      activity: v.activity,
      weight: v.weight ?? "",
      notes: v.notes ?? ""
    });
    setDeleteId(null);
  };

  const updateVisit = () => {
    const updated = visits.map(v => v.id === editId ? {
      ...v,
      date: editForm.date,
      parkingCost: parseFloat(editForm.parkingCost) || 0,
      duration: parseInt(editForm.duration) || 0,
      activity: editForm.activity,
      weight: parseFloat(editForm.weight) || null,
      notes: editForm.notes.trim()
    } : v).sort((a, b) => b.date.localeCompare(a.date));
    setVisits(updated);
    persist(updated);
    setEditId(null);
  };

  const totalParking = visits.reduce((s, v) => s + v.parkingCost, 0);
  const totalMins = visits.reduce((s, v) => s + v.duration, 0);
  const PASS_COST = settings.passCost;
  const remaining = Math.max(0, PASS_COST - totalParking);
  const pct = Math.min(100, (totalParking / PASS_COST) * 100);

  const byMonth = {};
  visits.forEach(v => { const k = v.date.slice(0, 7); byMonth[k] = (byMonth[k] || 0) + 1; });
  const monthData = Object.entries(byMonth).sort().map(([k, n]) => ({ name: fmtMo(k), visits: n }));

  const sorted = [...visits].sort((a, b) => a.date.localeCompare(b.date));
  const cumData = [{ name: "Start", amount: 0 }];
  let cum = 0;
  sorted.forEach((v, i) => {
    cum = parseFloat((cum + v.parkingCost).toFixed(2));
    cumData.push({ name: `V${i + 1}`, amount: cum, date: fmtDate(v.date) });
  });

  const weightData = sorted
    .filter(v => v.weight)
    .map(v => ({ date: fmtDate(v.date), weight: v.weight }));
  const latestWeight = weightData.length ? weightData[weightData.length - 1].weight : null;
  const firstWeight = weightData.length ? weightData[0].weight : null;
  const weightDelta = latestWeight && firstWeight ? parseFloat((latestWeight - firstWeight).toFixed(1)) : null;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    *::-webkit-scrollbar { display: none; }
    input, textarea, select, button { font-family: 'DM Sans', sans-serif; outline: none; }
    .phone-wrap { display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; background: #060d0a; padding: 28px 16px 40px; }
    .phone { width: 390px; background: #0c1c17; border-radius: 52px; overflow: hidden; position: relative; display: flex; flex-direction: column; height: 844px; box-shadow: 0 0 0 11px #182e25, 0 0 0 13px #0a1a12, 0 32px 100px rgba(0,0,0,.85), inset 0 0 0 1px rgba(62,207,185,.04); font-family: 'DM Sans', sans-serif; }
    .status { height: 54px; padding: 18px 28px 0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; color: #c8ddd0; }
    .status-time { font-size: 15px; font-weight: 600; letter-spacing: -.2px; }
    .status-icons { display: flex; gap: 7px; align-items: center; }
    .screen { flex: 1; overflow-y: auto; overflow-x: hidden; }
    .tabbar { height: 82px; background: #0c1c17; border-top: 1px solid #1c3529; display: flex; flex-shrink: 0; padding: 0 0 18px; }
    .tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; cursor: pointer; user-select: none; }
    .tab-ic { font-size: 20px; line-height: 1; }
    .tab-lb { font-size: 9.5px; letter-spacing: .6px; text-transform: uppercase; font-weight: 500; }
    .card { background: #152820; border-radius: 20px; padding: 18px; }
    .card-sm { background: #152820; border-radius: 16px; padding: 14px; }
    .sec { padding: 0 18px 18px; }
    .lbl { font-size: 10.5px; color: #4f8c6e; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500; margin-bottom: 8px; }
    .ifield { width: 100%; background: #152820; border-radius: 14px; padding: 13px 15px; color: #d8ece0; font-size: 15px; border: 1px solid #1e3d30; }
    .ifield::placeholder { color: #3d6e53; }
    .pill-btn { padding: 8px 13px; border-radius: 100px; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .18s; border: 1px solid #1e3d30; background: #152820; color: #6aad8a; }
    .cta { width: 100%; padding: 16px; background: #3ecfb9; color: #071510; border: none; border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer; transition: opacity .15s, transform .1s; letter-spacing: .1px; }
    .cta:active { transform: scale(.98); opacity: .9; }
    .visit-row { background: #152820; border-radius: 18px; padding: 15px; margin-bottom: 11px; }
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 9px; border-radius: 20px; font-size: 11px; font-weight: 500; letter-spacing: .2px; }
    .del-btn { background: #3a1515; border: 1px solid #7a2020; color: #e07070; border-radius: 10px; padding: 5px 11px; font-size: 11px; cursor: pointer; transition: background .15s; }
    .del-btn:hover { background: #5a2020; }
    .confirm-row { display: flex; gap: 8px; margin-top: 10px; }
    .confirm-yes { flex: 1; padding: 8px; background: #c84040; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; }
    .confirm-no { flex: 1; padding: 8px; background: #152820; color: #6aad8a; border: 1px solid #1e3d30; border-radius: 10px; font-size: 13px; cursor: pointer; }
    .recharts-tooltip-wrapper .recharts-default-tooltip { background: #152820 !important; border: 1px solid #2a5040 !important; border-radius: 10px !important; }
  `;

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false });

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#060d0a" }}>
        <div style={{ color: "#3ecfb9", fontFamily: "DM Sans, sans-serif", fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  const HomeScreen = () => (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: "12px 18px 22px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><ReservoirLogo /></div>
        <div style={{ fontSize: 11, color: "#4f8c6e", letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 500, marginBottom: 5 }}>Welcome back, JT</div>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, lineHeight: 1.25 }}>Lafayette<br />Reservoir</div>
        <div style={{ fontSize: 11, color: "#3a6652", marginTop: 6, letterSpacing: .5 }}>Annual Pass · Purchased {fmtDate(settings.passDate)}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "0 18px", marginBottom: 14 }}>
        {[
          { val: visits.length, lbl: "Visits" },
          { val: fmtDur(totalMins), lbl: "Time" },
          { val: `$${totalParking.toFixed(0)}`, lbl: "Saved" },
        ].map(({ val, lbl }) => (
          <div key={lbl} className="card" style={{ textAlign: "center", padding: "14px 8px" }}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 22, color: "#3ecfb9", fontWeight: 600, marginBottom: 3 }}>{val}</div>
            <div style={{ fontSize: 9.5, color: "#4f8c6e", textTransform: "uppercase", letterSpacing: 1.2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <div className="sec">
        <div className="card" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(62,207,185,.06) 0%, transparent 65%)" }} />
          <div className="lbl" style={{ marginBottom: 14 }}>Break-Even Progress</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "#6aad8a", marginBottom: 3 }}>Parking saved</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 30, color: "#d8ece0", fontWeight: 400, lineHeight: 1 }}>${totalParking.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#6aad8a", marginBottom: 3 }}>{remaining === 0 ? "Achieved!" : "Still need"}</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 30, color: remaining === 0 ? "#9fd46a" : "#d4a853", fontWeight: 400, lineHeight: 1 }}>
                {remaining === 0 ? "✓" : `$${remaining.toFixed(2)}`}
              </div>
            </div>
          </div>
          <div style={{ height: 7, background: "#0c1c17", borderRadius: 10, overflow: "hidden", marginBottom: 7 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #3ecfb9 0%, #d4a853 100%)", borderRadius: 10, transition: "width .8s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: "#3a6652" }}>$0</span>
            <span style={{ fontSize: 10, color: "#6aad8a" }}>{pct.toFixed(0)}% recovered</span>
            <span style={{ fontSize: 10, color: "#3a6652" }}>${PASS_COST}</span>
          </div>
        </div>
      </div>

      {visits.length > 0 && (
        <div className="sec" style={{ paddingBottom: 0 }}>
          <div className="lbl">Last Visit</div>
          <div className="card" style={{ display: "flex", gap: 13, alignItems: "center" }}>
            <div style={{ fontSize: 26, lineHeight: 1 }}>{ACT_ICON[visits[0].activity]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#d8ece0", fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{fmtDate(visits[0].date)}</div>
              <div style={{ color: "#4f8c6e", fontSize: 12 }}>{visits[0].activity} · {fmtDur(visits[0].duration)}</div>
              {visits[0].notes && <div style={{ color: "#3a6652", fontSize: 11, marginTop: 4, fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>"{visits[0].notes}"</div>}
            </div>
            <div style={{ color: visits[0].parkingCost > 0 ? "#9fd46a" : "#3a6652", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
              {visits[0].parkingCost > 0 ? `+$${visits[0].parkingCost.toFixed(2)}` : "Pass"}
            </div>
          </div>
        </div>
      )}

      {visits.length === 0 && (
        <div className="sec">
          <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏞️</div>
            <div style={{ color: "#6aad8a", fontSize: 14, marginBottom: 8 }}>No visits logged yet</div>
            <div style={{ color: "#3a6652", fontSize: 12 }}>Tap Log to record your first visit</div>
          </div>
        </div>
      )}
    </div>
  );

  const LogScreen = () => (
    <div style={{ padding: "18px 18px 32px" }}>
      <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, marginBottom: 4 }}>Log a Visit</div>
      <div style={{ fontSize: 12.5, color: "#4f8c6e", marginBottom: 24 }}>Record your time at the reservoir</div>

      {success && (
        <div style={{ background: "#0f3020", border: "1px solid #3ecfb9", borderRadius: 14, padding: "13px 16px", textAlign: "center", color: "#3ecfb9", fontSize: 14, fontWeight: 500, marginBottom: 18, letterSpacing: .2 }}>
          ✓ Visit logged!
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div className="lbl">Date</div>
          <input type="date" className="ifield" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
            style={{ colorScheme: "dark" }} />
        </div>

        <div>
          <div className="lbl">Activity</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {ACTIVITIES.map(a => (
              <button key={a} className="pill-btn" onClick={() => setForm({ ...form, activity: a })}
                style={form.activity === a ? { background: ACT_COLOR[a] + "28", color: ACT_COLOR[a], borderColor: ACT_COLOR[a] + "66" } : {}}>
                {ACT_ICON[a]} {a}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
          <div>
            <div className="lbl">Duration (min)</div>
            <input type="number" className="ifield" placeholder="e.g. 90" min="0"
              value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div>
            <div className="lbl">Parking Saved ($)</div>
            <input type="number" className="ifield" placeholder="e.g. 6.00" min="0" step="0.01"
              value={form.parkingCost} onChange={e => setForm({ ...form, parkingCost: e.target.value })} />
          </div>
        </div>

        <div>
          <div className="lbl">Weight (lbs) <span style={{ color: "#3a6652", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span></div>
          <input type="number" className="ifield" placeholder="e.g. 178.5" min="0" step="0.1"
            value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
        </div>

        <div>
          <div className="lbl">Notes</div>
          <textarea className="ifield" rows={3} placeholder="How was your visit?"
            value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            style={{ resize: "none", lineHeight: 1.55 }} />
        </div>

        <div style={{ padding: "2px 0 0" }}>
          <button className="cta" onClick={addVisit} disabled={!form.date || !form.duration}>
            + Log Visit
          </button>
        </div>
        <div style={{ fontSize: 11, color: "#3a6652", textAlign: "center", lineHeight: 1.5 }}>
          Enter the daily parking rate you saved by using your annual pass
        </div>
      </div>
    </div>
  );

  const HistoryScreen = () => (
    <div style={{ padding: "18px 18px 32px" }}>
      <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, marginBottom: 3 }}>Visit Log</div>
      <div style={{ fontSize: 12.5, color: "#4f8c6e", marginBottom: 20 }}>{visits.length} visit{visits.length !== 1 ? "s" : ""} · {fmtDur(totalMins)} total</div>

      {visits.length === 0 && (
        <div style={{ textAlign: "center", color: "#3a6652", padding: "48px 0", fontSize: 13 }}>No visits yet</div>
      )}

      {visits.map(v => (
        <div key={v.id} className="visit-row">
          {editId === v.id ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div style={{ fontSize: 12, color: "#3ecfb9", fontWeight: 500, marginBottom: 2 }}>Editing visit</div>

              <div>
                <div className="lbl">Date</div>
                <input type="date" className="ifield" value={editForm.date}
                  onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                  style={{ colorScheme: "dark" }} />
              </div>

              <div>
                <div className="lbl">Activity</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ACTIVITIES.map(a => (
                    <button key={a} className="pill-btn" onClick={() => setEditForm({ ...editForm, activity: a })}
                      style={{ fontSize: 11.5, padding: "6px 10px", ...(editForm.activity === a ? { background: ACT_COLOR[a] + "28", color: ACT_COLOR[a], borderColor: ACT_COLOR[a] + "66" } : {}) }}>
                      {ACT_ICON[a]} {a}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div className="lbl">Duration (min)</div>
                  <input type="number" className="ifield" min="0"
                    value={editForm.duration} onChange={e => setEditForm({ ...editForm, duration: e.target.value })} />
                </div>
                <div>
                  <div className="lbl">Parking ($)</div>
                  <input type="number" className="ifield" min="0" step="0.01"
                    value={editForm.parkingCost} onChange={e => setEditForm({ ...editForm, parkingCost: e.target.value })} />
                </div>
              </div>

              <div>
                <div className="lbl">Weight (lbs)</div>
                <input type="number" className="ifield" min="0" step="0.1" placeholder="optional"
                  value={editForm.weight} onChange={e => setEditForm({ ...editForm, weight: e.target.value })} />
              </div>

              <div>
                <div className="lbl">Notes</div>
                <textarea className="ifield" rows={2} placeholder="Notes…"
                  value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  style={{ resize: "none", lineHeight: 1.55 }} />
              </div>

              <div style={{ display: "flex", gap: 9 }}>
                <button onClick={() => setEditId(null)}
                  style={{ flex: 1, padding: "10px", background: "#152820", color: "#6aad8a", border: "1px solid #1e3d30", borderRadius: 12, fontSize: 13, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={updateVisit}
                  style={{ flex: 2, padding: "10px", background: "#3ecfb9", color: "#071510", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#d8ece0", fontSize: 14, fontWeight: 500, marginBottom: 7 }}>{fmtDate(v.date)}</div>
                  <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="badge" style={{ background: ACT_COLOR[v.activity] + "20", color: ACT_COLOR[v.activity], border: `1px solid ${ACT_COLOR[v.activity]}44`, fontSize: 11 }}>
                      {ACT_ICON[v.activity]} {v.activity}
                    </span>
                    <span style={{ fontSize: 11.5, color: "#6aad8a" }}>{fmtDur(v.duration)}</span>
                    {v.weight && <span style={{ fontSize: 11.5, color: "#7ab8e8" }}>⚖️ {v.weight} lbs</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                  <div style={{ color: v.parkingCost > 0 ? "#9fd46a" : "#3a6652", fontSize: 13, fontWeight: 600 }}>
                    {v.parkingCost > 0 ? `+$${v.parkingCost.toFixed(2)}` : "Pass"}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 7, justifyContent: "flex-end" }}>
                    <button style={{ background: "#1a3528", border: "1px solid #2a5040", color: "#3ecfb9", borderRadius: 10, padding: "5px 11px", fontSize: 11, cursor: "pointer" }}
                      onClick={() => openEdit(v)}>
                      edit
                    </button>
                    <button className="del-btn" onClick={() => setDeleteId(deleteId === v.id ? null : v.id)}>
                      {deleteId === v.id ? "cancel" : "delete"}
                    </button>
                  </div>
                </div>
              </div>
              {v.notes && (
                <div style={{ fontSize: 12.5, color: "#6aad8a", fontStyle: "italic", borderTop: "1px solid #1e3d30", paddingTop: 10, marginTop: 10, lineHeight: 1.55 }}>
                  "{v.notes}"
                </div>
              )}
              {deleteId === v.id && (
                <div className="confirm-row">
                  <button className="confirm-no" onClick={() => setDeleteId(null)}>Keep</button>
                  <button className="confirm-yes" onClick={() => deleteVisit(v.id)}>Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );

  const CustomTooltipBar = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "#152820", border: "1px solid #2a5040", borderRadius: 10, padding: "8px 12px" }}>
        <div style={{ color: "#4f8c6e", fontSize: 11, marginBottom: 3 }}>{label}</div>
        <div style={{ color: "#3ecfb9", fontSize: 14, fontWeight: 600 }}>{payload[0].value} visit{payload[0].value !== 1 ? "s" : ""}</div>
      </div>
    );
  };

  const CustomTooltipArea = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "#152820", border: "1px solid #2a5040", borderRadius: 10, padding: "8px 12px" }}>
        <div style={{ color: "#4f8c6e", fontSize: 11, marginBottom: 3 }}>{payload[0].payload.date || label}</div>
        <div style={{ color: "#3ecfb9", fontSize: 14, fontWeight: 600 }}>${payload[0].value.toFixed(2)} saved</div>
      </div>
    );
  };

  const AnalyticsScreen = () => (
    <div style={{ padding: "18px 18px 36px" }}>
      <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, marginBottom: 3 }}>Analytics</div>
      <div style={{ fontSize: 12.5, color: "#4f8c6e", marginBottom: 22 }}>Your reservoir activity</div>

      <div style={{ marginBottom: 22 }}>
        <div className="lbl">Visits per Month</div>
        <div className="card" style={{ height: 175, paddingLeft: 4, paddingRight: 6 }}>
          {monthData.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#3a6652", fontSize: 12 }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData} margin={{ top: 12, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#1c3529" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#4f8c6e", fontSize: 10, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4f8c6e", fontSize: 10, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltipBar />} cursor={{ fill: "rgba(62,207,185,.04)" }} />
                <Bar dataKey="visits" fill="#3ecfb9" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div className="lbl">Cumulative Parking Savings vs. $140 Goal</div>
        <div className="card" style={{ height: 200, paddingLeft: 4, paddingRight: 6 }}>
          {cumData.length <= 1 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#3a6652", fontSize: 12 }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumData} margin={{ top: 12, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3ecfb9" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3ecfb9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#1c3529" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#4f8c6e", fontSize: 10, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4f8c6e", fontSize: 10, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} domain={[0, Math.max(PASS_COST * 1.05, totalParking * 1.15, 30)]} />
                <Tooltip content={<CustomTooltipArea />} cursor={{ stroke: "#3ecfb9", strokeWidth: 1, strokeDasharray: "3 3" }} />
                <ReferenceLine y={PASS_COST} stroke="#d4a853" strokeDasharray="5 4" strokeWidth={1.5}
                  label={{ value: "$140", position: "insideTopRight", fill: "#d4a853", fontSize: 10, fontFamily: "DM Sans", dy: -6 }} />
                <Area type="monotone" dataKey="amount" stroke="#3ecfb9" strokeWidth={2.5} fill="url(#savGrad)" dot={false} activeDot={{ r: 4, fill: "#3ecfb9", stroke: "#0c1c17", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 10, paddingLeft: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 2, background: "#3ecfb9", borderRadius: 2 }} />
            <span style={{ fontSize: 10.5, color: "#4f8c6e" }}>Savings</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 0, borderTop: "2px dashed #d4a853" }} />
            <span style={{ fontSize: 10.5, color: "#4f8c6e" }}>$140 goal</span>
          </div>
        </div>
      </div>

      <div>
        <div className="lbl">Activity Breakdown</div>
        <div className="card">
          {ACTIVITIES.map(a => {
            const count = visits.filter(v => v.activity === a).length;
            const ap = visits.length ? Math.round((count / visits.length) * 100) : 0;
            const mins = visits.filter(v => v.activity === a).reduce((s, v) => s + v.duration, 0);
            return (
              <div key={a} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 15 }}>{ACT_ICON[a]}</span>
                    <span style={{ fontSize: 13, color: "#c8ddd0" }}>{a}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, color: "#4f8c6e" }}>{mins > 0 ? fmtDur(mins) : "—"}</span>
                    <span style={{ fontSize: 13, color: "#6aad8a", fontWeight: 500, minWidth: 24, textAlign: "right" }}>{count}</span>
                  </div>
                </div>
                <div style={{ height: 5, background: "#0c1c17", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${ap}%`, background: ACT_COLOR[a], borderRadius: 10, transition: "width .5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div className="lbl">Weight over time (lbs)</div>
        {weightData.length < 2 ? (
          <div className="card" style={{ textAlign: "center", padding: "28px 16px" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚖️</div>
            <div style={{ color: "#4f8c6e", fontSize: 13, marginBottom: 4 }}>
              {weightData.length === 0 ? "No weight data yet" : "Log one more visit with weight to see your trend"}
            </div>
            <div style={{ color: "#3a6652", fontSize: 11 }}>Add weight when logging visits</div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[
                { val: `${latestWeight} lbs`, lbl: "Current" },
                { val: `${firstWeight} lbs`, lbl: "Starting" },
                { val: weightDelta === null ? "—" : `${weightDelta > 0 ? "+" : ""}${weightDelta} lbs`, lbl: "Change", color: weightDelta < 0 ? "#9fd46a" : weightDelta > 0 ? "#d4a853" : "#6aad8a" },
              ].map(({ val, lbl, color }) => (
                <div key={lbl} className="card" style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: 16, color: color || "#7ab8e8", fontWeight: 600, marginBottom: 3 }}>{val}</div>
                  <div style={{ fontSize: 9.5, color: "#4f8c6e", textTransform: "uppercase", letterSpacing: 1.2 }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ height: 180, paddingLeft: 4, paddingRight: 6 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData} margin={{ top: 12, right: 4, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wtGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7ab8e8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#7ab8e8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#1c3529" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: "#4f8c6e", fontSize: 9, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: "#4f8c6e", fontSize: 10, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div style={{ background: "#152820", border: "1px solid #2a5040", borderRadius: 10, padding: "8px 12px" }}>
                        <div style={{ color: "#4f8c6e", fontSize: 11, marginBottom: 3 }}>{payload[0].payload.date}</div>
                        <div style={{ color: "#7ab8e8", fontSize: 14, fontWeight: 600 }}>{payload[0].value} lbs</div>
                      </div>
                    );
                  }} cursor={{ stroke: "#7ab8e8", strokeWidth: 1, strokeDasharray: "3 3" }} />
                  <Area type="monotone" dataKey="weight" stroke="#7ab8e8" strokeWidth={2.5} fill="url(#wtGrad)" dot={{ r: 3, fill: "#7ab8e8", stroke: "#0c1c17", strokeWidth: 2 }} activeDot={{ r: 5, fill: "#7ab8e8", stroke: "#0c1c17", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
    const expiryDate = settings.passDate ? new Date(settings.passDate + "T12:00:00") : null;
    const expiryStr = expiryDate
      ? new Date(expiryDate.setFullYear(expiryDate.getFullYear() + 1)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "—";
    const daysHeld = settings.passDate
      ? Math.max(0, Math.floor((Date.now() - new Date(settings.passDate + "T12:00:00")) / 86400000))
      : 0;
    const daysLeft = Math.max(0, 365 - daysHeld);

    return (
      <div style={{ padding: "18px 18px 36px" }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, marginBottom: 3 }}>Settings</div>
        <div style={{ fontSize: 12.5, color: "#4f8c6e", marginBottom: 24 }}>Manage your annual pass details</div>

        {settingsSaved && (
          <div style={{ background: "#0f3020", border: "1px solid #3ecfb9", borderRadius: 14, padding: "13px 16px", textAlign: "center", color: "#3ecfb9", fontSize: 14, fontWeight: 500, marginBottom: 18 }}>
            ✓ Settings saved
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div className="lbl">Annual Pass Cost ($)</div>
            <input type="number" className="ifield" min="1" step="1" placeholder="140"
              value={settingsForm.passCost}
              onChange={e => setSettingsForm({ ...settingsForm, passCost: e.target.value })} />
            <div style={{ fontSize: 11, color: "#3a6652", marginTop: 6, paddingLeft: 2 }}>
              Update if the pass price changes at renewal
            </div>
          </div>

          <div>
            <div className="lbl">Purchase Date</div>
            <input type="date" className="ifield" value={settingsForm.passDate}
              onChange={e => setSettingsForm({ ...settingsForm, passDate: e.target.value })}
              style={{ colorScheme: "dark" }} />
            <div style={{ fontSize: 11, color: "#3a6652", marginTop: 6, paddingLeft: 2 }}>
              Update when you renew for next year
            </div>
          </div>

          <button className="cta" onClick={saveSettings}>Save Settings</button>
        </div>

        <div style={{ marginTop: 28 }}>
          <div className="lbl">Current Pass Summary</div>
          <div className="card">
            {[
              { label: "Pass cost", val: `$${settings.passCost.toFixed(2)}` },
              { label: "Purchased", val: fmtDate(settings.passDate) },
              { label: "Expires", val: expiryStr },
              { label: "Days active", val: `${daysHeld} days` },
              { label: "Days remaining", val: `${daysLeft} days` },
              { label: "Daily value", val: `$${(settings.passCost / 365).toFixed(3)}/day` },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1c3529" }}>
                <span style={{ fontSize: 13, color: "#4f8c6e" }}>{label}</span>
                <span style={{ fontSize: 13, color: "#c8ddd0", fontWeight: 500 }}>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
              <span style={{ fontSize: 13, color: "#4f8c6e" }}>Break-even needed</span>
              <span style={{ fontSize: 13, color: remaining === 0 ? "#9fd46a" : "#d4a853", fontWeight: 500 }}>
                {remaining === 0 ? "Achieved ✓" : `$${remaining.toFixed(2)} more`}
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div className="lbl">Danger Zone</div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, color: "#4f8c6e", lineHeight: 1.5 }}>
              Reset all visit data. This cannot be undone.
            </div>
            <button onClick={() => {
              if (window.confirm("Delete all visit history? This cannot be undone.")) {
                setVisits([]);
                persist([]);
              }
            }} style={{ background: "#2a0f0f", border: "1px solid #7a2020", color: "#e07070", borderRadius: 12, padding: "11px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              Clear All Visit Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TABS = [
    { id: "home", icon: "🏞️", label: "Home" },
    { id: "log", icon: "✏️", label: "Log" },
    { id: "history", icon: "📋", label: "Log" },
    { id: "stats", icon: "📊", label: "Stats" },
  ];
  const TAB_LABELS = { home: "Home", log: "Log", history: "History", stats: "Stats", settings: "Settings" };

  return (
    <>
      <style>{css}</style>
      <div className="phone-wrap">
        <div className="phone">
          <div className="status">
            <span className="status-time">{timeStr}</span>
            <div className="status-icons">
              <span style={{ color: "#c8ddd0" }}><SignalIcon /></span>
              <span style={{ fontSize: 11, color: "#c8ddd0", fontWeight: 500 }}>LTE</span>
              <span style={{ color: "#c8ddd0" }}><BatteryIcon /></span>
            </div>
          </div>

          <div className="screen">
            {tab === "home" && <HomeScreen />}
            {tab === "log" && <LogScreen />}
            {tab === "history" && <HistoryScreen />}
            {tab === "stats" && <AnalyticsScreen />}
            {tab === "settings" && <SettingsScreen />}
          </div>

          <div className="tabbar">
            {[
              { id: "home", icon: "🏞️" },
              { id: "log", icon: "✏️" },
              { id: "history", icon: "📋" },
              { id: "stats", icon: "📊" },
              { id: "settings", icon: "⚙️" },
            ].map(t => (
              <div key={t.id} className="tab" onClick={() => setTab(t.id)}>
                <span className="tab-ic" style={{ opacity: tab === t.id ? 1 : 0.35 }}>{t.icon}</span>
                <span className="tab-lb" style={{ color: tab === t.id ? "#3ecfb9" : "#2e6045" }}>{TAB_LABELS[t.id]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
