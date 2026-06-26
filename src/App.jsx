import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, CartesianGrid } from "recharts";

const DEFAULT_PASS_COST = 140;
const DEFAULT_PASS_DATE = "2026-03-30";
const ACTIVITIES = ["Lakeside Nature Trail", "Rim Trail", "Fishing", "Picnic"];
const ACT_COLOR = { "Lakeside Nature Trail": "#3ecfb9", "Rim Trail": "#d4a853", "Fishing": "#7ab8e8", "Picnic": "#9fd46a" };
const ACT_ICON  = { "Lakeside Nature Trail": "🥾", "Rim Trail": "⛰️", "Fishing": "🎣", "Picnic": "🧺" };

const RESERVOIR_IMG = "data:image/jpeg;base64,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";

const SEED = [
  { id: 1, date: "2026-03-30", parkingCost: 0, duration: 90,  activity: "Lakeside Nature Trail", weight: null, distance: 5.0, notes: "First visit with annual pass! Beautiful spring morning." },
  { id: 2, date: "2026-03-15", parkingCost: 6, duration: 75,  activity: "Rim Trail",  weight: null, distance: 4.7, notes: "Windy but incredible views of the reservoir." },
  { id: 3, date: "2026-02-28", parkingCost: 6, duration: 45,  activity: "Fishing",    weight: null, distance: 1.2, notes: "Peaceful morning, no bites." },
  { id: 4, date: "2026-02-14", parkingCost: 6, duration: 120, activity: "Lakeside Nature Trail", weight: null, distance: 5.0, notes: "Valentine's Day walk, perfect weather." },
  { id: 5, date: "2026-01-20", parkingCost: 6, duration: 60,  activity: "Lakeside Nature Trail", weight: null, distance: 5.0, notes: "New year energy, crisp morning air." },
];

const today     = () => new Date().toLocaleDateString("en-CA");
const fmtDur    = (m) => { const h = Math.floor(m / 60), r = m % 60; return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${r}m`; };
const fmtDate   = (s) => new Date(s + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtMo     = (s) => { const [y, m] = s.split("-"); return new Date(+y, +m - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" }); };
const blankForm = () => ({ date: today(), parkingCost: "", duration: "", activity: "Lakeside Nature Trail", weight: "", distance: "", dog: false, notes: "" });

const Logo = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <circle cx="36" cy="36" r="34" fill="#162b25" stroke="#2a5047" strokeWidth="1"/>
    <path d="M20 38 L36 18 L52 38" fill="#1e4035" opacity="0.9"/>
    <path d="M15 38 L25 26 L35 38" fill="#163328" opacity="0.6"/>
    <ellipse cx="36" cy="42" rx="22" ry="12" fill="#0e2a22" opacity="0.8"/>
    <path d="M12 39 Q19 34 26 39 Q33 44 40 39 Q47 34 60 39" stroke="#3ecfb9" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M16 46 Q22 41 28 46 Q34 51 40 46 Q46 41 56 46" stroke="#3ecfb9" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6"/>
    <path d="M20 52 Q26 48 32 52 Q38 56 44 52 Q50 48 54 52" stroke="#3ecfb9" strokeWidth="1"   fill="none" strokeLinecap="round" opacity="0.3"/>
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
    <rect x="0"    y="5" width="3" height="7"  rx="1" opacity="0.4"/>
    <rect x="4.5"  y="3" width="3" height="9"  rx="1" opacity="0.6"/>
    <rect x="9"    y="1" width="3" height="11" rx="1" opacity="0.8"/>
    <rect x="13.5" y="0" width="3" height="12" rx="1"/>
  </svg>
);

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  *::-webkit-scrollbar { display: none; }
  input, textarea, select, button { font-family: 'DM Sans', sans-serif; outline: none; }
  .phone-wrap { display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; background: #060d0a; padding: 28px 16px 40px; }
  .phone { width: 390px; background: #0c1c17; border-radius: 52px; overflow: hidden; display: flex; flex-direction: column; height: 844px; box-shadow: 0 0 0 11px #182e25, 0 0 0 13px #0a1a12, 0 32px 100px rgba(0,0,0,.85); font-family: 'DM Sans', sans-serif; }
  .status { height: 54px; padding: 18px 28px 0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; color: #c8ddd0; }
  .status-time { font-size: 15px; font-weight: 600; letter-spacing: -.2px; }
  .status-icons { display: flex; gap: 7px; align-items: center; }
  .screen { flex: 1; overflow-y: auto; overflow-x: hidden; }
  .tabbar { height: 82px; background: #0c1c17; border-top: 1px solid #1c3529; display: flex; flex-shrink: 0; padding: 0 0 18px; }
  .tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; cursor: pointer; user-select: none; }
  .tab-ic { font-size: 20px; line-height: 1; }
  .tab-lb { font-size: 9.5px; letter-spacing: .6px; text-transform: uppercase; font-weight: 500; }
  .card { background: #152820; border-radius: 20px; padding: 18px; }
  .sec { padding: 0 18px 18px; }
  .lbl { font-size: 10.5px; color: #4f8c6e; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500; margin-bottom: 8px; }
  .ifield { width: 100%; background: #152820; border-radius: 14px; padding: 13px 15px; color: #d8ece0; font-size: 15px; border: 1px solid #1e3d30; }
  .ifield::placeholder { color: #3d6e53; }
  .pill { padding: 8px 13px; border-radius: 100px; font-size: 12.5px; font-weight: 500; cursor: pointer; border: 1px solid #1e3d30; background: #152820; color: #6aad8a; }
  .cta { width: 100%; padding: 16px; background: #3ecfb9; color: #071510; border: none; border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer; }
  .cta:active { opacity: .9; transform: scale(.98); }
  .visit-row { background: #152820; border-radius: 18px; padding: 15px; margin-bottom: 11px; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 9px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .btn-edit { background: #1a3528; border: 1px solid #2a5040; color: #3ecfb9; border-radius: 10px; padding: 5px 11px; font-size: 11px; cursor: pointer; }
  .btn-del  { background: #3a1515; border: 1px solid #7a2020; color: #e07070; border-radius: 10px; padding: 5px 11px; font-size: 11px; cursor: pointer; }
  .row-sep  { border-top: 1px solid #1e3d30; padding-top: 10px; margin-top: 10px; }
`;

export default function App() {
  const [tab,           setTab]           = useState("home");
  const [activeUser,    setActiveUser]    = useState(null);   // { id, name, avatar }
  const [users,         setUsers]         = useState([]);
  const [showUserPicker,setShowUserPicker]= useState(false);
  const [newUserName,   setNewUserName]   = useState("");
  const [newUserAvatar, setNewUserAvatar] = useState("🏃");
  const [visits,        setVisits]        = useState([]);
  const [settings,      setSettings]      = useState({ passCost: DEFAULT_PASS_COST, passDate: DEFAULT_PASS_DATE });
  const [settingsForm,  setSettingsForm]  = useState({ passCost: DEFAULT_PASS_COST, passDate: DEFAULT_PASS_DATE });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [form,          setForm]          = useState(blankForm());
  const [logSuccess,    setLogSuccess]    = useState(false);
  const [deleteId,      setDeleteId]      = useState(null);
  const [editId,        setEditId]        = useState(null);
  const [editForm,      setEditForm]      = useState({});
  const [ready,         setReady]         = useState(false);

  const AVATARS = ["🏃","🚶","🧗","🎣","🐕","⛰️","🌿","🌊","🦅","🧘","🚴","🌲"];

  // reads a File into a square base64 jpeg (max 120px) to keep storage small
  const resizeToBase64 = (file) => new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const SIZE = 120;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE; canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      const min = Math.min(img.width, img.height);
      const sx = (img.width  - min) / 2;
      const sy = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = url;
  });

  // renders either an emoji or a circular photo
  const AvatarCircle = ({ avatar, size = 34, border = false, active = false }) => {
    const isImg = avatar?.startsWith("data:");
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
        background: active ? "#1a3528" : "#0c1c17",
        border: `${border ? 2 : 1}px solid ${active ? "#3ecfb9" : "#1e3d30"}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45 }}>
        {isImg
          ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : avatar}
      </div>
    );
  };

  // emoji grid + upload button used in both onboard and settings
  const AvatarPicker = ({ value, onChange }) => {
    const handleFile = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const b64 = await resizeToBase64(file);
      onChange(b64);
      e.target.value = "";
    };
    const isCustom = value?.startsWith("data:");
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center", marginBottom: 10 }}>
          {AVATARS.map(a => (
            <button key={a} onClick={() => onChange(a)}
              style={{ width: 42, height: 42, borderRadius: "50%", background: value === a ? "#1a3528" : "#0c1c17",
                border: `2px solid ${value === a ? "#3ecfb9" : "#1e3d30"}`, fontSize: 20, cursor: "pointer" }}>
              {a}
            </button>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: isCustom ? "#1a3528" : "#152820", border: `1px solid ${isCustom ? "#3ecfb9" : "#1e3d30"}`,
          borderRadius: 14, padding: "11px 16px", cursor: "pointer" }}>
          {isCustom
            ? <><AvatarCircle avatar={value} size={32} active /><span style={{ fontSize: 13, color: "#3ecfb9" }}>Custom photo selected ✓</span></>
            : <><span style={{ fontSize: 18 }}>📷</span><span style={{ fontSize: 13, color: "#6aad8a" }}>Upload a photo from your device</span></>}
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        </label>
      </div>
    );
  };

  // ── storage helpers (namespaced per user) ─────────────────────
  const vKey = (uid) => `lr_visits_v2_${uid}`;
  const sKey = (uid) => `lr_settings_v1_${uid}`;
  const lsGet = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  const saveVisits   = (v, uid) => lsSet(vKey(uid || activeUser?.id), v);
  const saveSettings = (s, uid) => lsSet(sKey(uid || activeUser?.id), s);

  const loadUserData = (uid) => {
    const v = lsGet(vKey(uid));
    setVisits(v ?? SEED);
    const s = lsGet(sKey(uid));
    if (s) { setSettings(s); setSettingsForm(s); }
    else   { setSettings({ passCost: DEFAULT_PASS_COST, passDate: DEFAULT_PASS_DATE }); setSettingsForm({ passCost: DEFAULT_PASS_COST, passDate: DEFAULT_PASS_DATE }); }
  };

  // ── bootstrap ─────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(link);

    const allUsers = lsGet("lr_users") || [];
    const lastId   = lsGet("lr_active_user");
    setUsers(allUsers);

    if (allUsers.length > 0) {
      const found = allUsers.find(u => u.id === lastId) || allUsers[0];
      setActiveUser(found);
      loadUserData(found.id);
    }
    setReady(true);
  }, []);

  const switchUser = (user) => {
    setActiveUser(user);
    lsSet("lr_active_user", user.id);
    loadUserData(user.id);
    setTab("home");
    setShowUserPicker(false);
    setEditId(null);
    setDeleteId(null);
  };

  const createUser = () => {
    const name = newUserName.trim();
    if (!name) return;
    const id = `user_${Date.now()}`;
    const user = { id, name, avatar: newUserAvatar, created: today() };
    const updated = [...users, user];
    setUsers(updated);
    lsSet("lr_users", updated);
    setNewUserName("");
    setNewUserAvatar("🏃");
    switchUser(user);
  };

  const deleteUser = (uid) => {
    if (!window.confirm("Delete this user and all their data? This cannot be undone.")) return;
    localStorage.removeItem(vKey(uid));
    localStorage.removeItem(sKey(uid));
    const updated = users.filter(u => u.id !== uid);
    setUsers(updated);
    lsSet("lr_users", updated);
    if (activeUser?.id === uid) {
      if (updated.length > 0) switchUser(updated[0]);
      else { setActiveUser(null); lsSet("lr_active_user", null); setVisits([]); }
    }
    setShowUserPicker(false);
  };

  // ── visit actions ─────────────────────────────────────────────
  const addVisit = () => {
    if (!form.date || !form.duration) return;
    const v = { id: Date.now(), date: form.date, parkingCost: parseFloat(form.parkingCost) || 0, duration: parseInt(form.duration) || 0, activity: form.activity, weight: parseFloat(form.weight) || null, distance: parseFloat(form.distance) || null, dog: !!form.dog, notes: form.notes.trim() };
    const updated = [...visits, v].sort((a, b) => b.date.localeCompare(a.date));
    setVisits(updated); saveVisits(updated);
    setLogSuccess(true);
    setTimeout(() => { setLogSuccess(false); setForm(blankForm()); setTab("home"); }, 1400);
  };

  const deleteVisit = (id) => {
    const updated = visits.filter(v => v.id !== id);
    setVisits(updated); saveVisits(updated); setDeleteId(null);
  };

  const openEdit = (v) => {
    setEditId(v.id);
    setEditForm({ date: v.date, parkingCost: v.parkingCost ?? "", duration: v.duration ?? "", activity: v.activity, weight: v.weight ?? "", distance: v.distance ?? "", dog: !!v.dog, notes: v.notes ?? "" });
    setDeleteId(null);
  };

  const commitEdit = () => {
    const updated = visits.map(v => v.id !== editId ? v : { ...v, date: editForm.date, parkingCost: parseFloat(editForm.parkingCost) || 0, duration: parseInt(editForm.duration) || 0, activity: editForm.activity, weight: parseFloat(editForm.weight) || null, distance: parseFloat(editForm.distance) || null, dog: !!editForm.dog, notes: editForm.notes.trim() })
      .sort((a, b) => b.date.localeCompare(a.date));
    setVisits(updated); saveVisits(updated); setEditId(null);
  };

  const commitSettings = () => {
    const s = { passCost: parseFloat(settingsForm.passCost) || DEFAULT_PASS_COST, passDate: settingsForm.passDate || DEFAULT_PASS_DATE };
    setSettings(s); saveSettings(s); setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // ── derived values ────────────────────────────────────────────
  const PASS_COST    = settings.passCost;
  const totalParking = visits.reduce((s, v) => s + v.parkingCost, 0);
  const totalMins    = visits.reduce((s, v) => s + v.duration, 0);
  const remaining    = Math.max(0, PASS_COST - totalParking);
  const pct          = Math.min(100, (totalParking / PASS_COST) * 100);

  const byMonth = {};
  visits.forEach(v => {
    const k = v.date.slice(0, 7);
    if (!byMonth[k]) byMonth[k] = { solo: 0, dog: 0 };
    if (v.dog) byMonth[k].dog += 1; else byMonth[k].solo += 1;
  });
  const monthData = Object.entries(byMonth).sort().map(([k, { solo, dog }]) => ({ name: fmtMo(k), solo, dog }));

  const sortedAsc = [...visits].sort((a, b) => a.date.localeCompare(b.date));
  const cumData = [{ name: "Start", amount: 0 }];
  let cum = 0;
  sortedAsc.forEach((v, i) => { cum = parseFloat((cum + v.parkingCost).toFixed(2)); cumData.push({ name: `V${i + 1}`, amount: cum, date: fmtDate(v.date) }); });

  const totalMiles   = visits.reduce((s, v) => s + (v.distance || 0), 0);

  const distData = [{ name: "Start", miles: 0 }];
  let cumMiles = 0;
  sortedAsc.forEach((v, i) => { cumMiles = parseFloat((cumMiles + (v.distance || 0)).toFixed(2)); distData.push({ name: `V${i + 1}`, miles: cumMiles, date: fmtDate(v.date) }); });

  const byMonthMiles = {};
  visits.forEach(v => { const k = v.date.slice(0, 7); byMonthMiles[k] = parseFloat(((byMonthMiles[k] || 0) + (v.distance || 0)).toFixed(2)); });
  const milesMonthData = Object.entries(byMonthMiles).sort().map(([k, miles]) => ({ name: fmtMo(k), miles }));

  const weightData  = sortedAsc.filter(v => v.weight).map(v => ({ date: fmtDate(v.date), weight: v.weight }));
  const latestW     = weightData.length ? weightData[weightData.length - 1].weight : null;
  const firstW      = weightData.length ? weightData[0].weight : null;
  const weightDelta = latestW && firstW ? parseFloat((latestW - firstW).toFixed(1)) : null;

  const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false });

  if (!ready) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#060d0a", color: "#3ecfb9", fontFamily: "sans-serif" }}>Loading…</div>;

  // ── shared helpers ────────────────────────────────────────────
  const ActivityPills = ({ value, onChange }) => (
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
      {ACTIVITIES.map(a => (
        <button key={a} className="pill" onClick={() => onChange(a)}
          style={value === a ? { background: ACT_COLOR[a] + "28", color: ACT_COLOR[a], borderColor: ACT_COLOR[a] + "66" } : {}}>
          {ACT_ICON[a]} {a}
        </button>
      ))}
    </div>
  );

  const SuccessBanner = ({ msg }) => (
    <div style={{ background: "#0f3020", border: "1px solid #3ecfb9", borderRadius: 14, padding: "13px 16px", textAlign: "center", color: "#3ecfb9", fontSize: 14, fontWeight: 500, marginBottom: 18 }}>
      ✓ {msg}
    </div>
  );

  const TipBar    = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const solo = payload.find(p => p.dataKey === "solo")?.value || 0;
    const dog  = payload.find(p => p.dataKey === "dog")?.value  || 0;
    const total = solo + dog;
    return (
      <div style={{ background: "#152820", border: "1px solid #2a5040", borderRadius: 10, padding: "8px 12px", minWidth: 110 }}>
        <div style={{ color: "#4f8c6e", fontSize: 11, marginBottom: 5 }}>{label}</div>
        <div style={{ color: "#3ecfb9", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{total} visit{total !== 1 ? "s" : ""}</div>
        {dog > 0 && <div style={{ color: "#d4a853", fontSize: 11 }}>🐕 {dog} with dog</div>}
        {solo > 0 && <div style={{ color: "#6aad8a", fontSize: 11 }}>solo {solo}</div>}
      </div>
    );
  };
  const TipArea   = ({ active, payload }) => !active || !payload?.length ? null : <div style={{ background: "#152820", border: "1px solid #2a5040", borderRadius: 10, padding: "8px 12px" }}><div style={{ color: "#4f8c6e", fontSize: 11, marginBottom: 3 }}>{payload[0].payload.date}</div><div style={{ color: "#3ecfb9", fontSize: 14, fontWeight: 600 }}>${payload[0].value.toFixed(2)} saved</div></div>;
  const TipDist   = ({ active, payload, label }) => !active || !payload?.length ? null : <div style={{ background: "#152820", border: "1px solid #2a5040", borderRadius: 10, padding: "8px 12px" }}><div style={{ color: "#4f8c6e", fontSize: 11, marginBottom: 3 }}>{label}</div><div style={{ color: "#9fd46a", fontSize: 14, fontWeight: 600 }}>{payload[0].value.toFixed(1)} mi</div></div>;
  const TipWeight = ({ active, payload }) => !active || !payload?.length ? null : <div style={{ background: "#152820", border: "1px solid #2a5040", borderRadius: 10, padding: "8px 12px" }}><div style={{ color: "#4f8c6e", fontSize: 11, marginBottom: 3 }}>{payload[0].payload.date}</div><div style={{ color: "#7ab8e8", fontSize: 14, fontWeight: 600 }}>{payload[0].value} lbs</div></div>;

  // ─────────────────────────────────────────────────────────────
  // SCREENS (called as functions to preserve input focus)
  // ─────────────────────────────────────────────────────────────

  const HomeScreen = () => (
    <div style={{ paddingBottom: 24, position: "relative" }}>

      {/* photo background */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 268, overflow: "hidden", zIndex: 0 }}>
        <img src={RESERVOIR_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(12,28,23,0) 45%, rgba(12,28,23,0.7) 78%, rgba(12,28,23,1) 100%)" }} />
      </div>

      {/* header content over background */}
      <div style={{ position: "relative", zIndex: 1, padding: "12px 18px 22px", textAlign: "center" }}>      {/* header content over background */}
      <div style={{ position: "relative", zIndex: 1, padding: "12px 18px 22px", textAlign: "center" }}>
        {users.length > 1 && (
          <button onClick={() => setShowUserPicker(true)}
            style={{ position: "absolute", top: 12, right: 18, background: "rgba(21,40,32,0.85)", border: "1px solid #1e3d30", color: "#6aad8a", borderRadius: 20, padding: "5px 10px 5px 5px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            <AvatarCircle avatar={activeUser?.avatar} size={24} />
            <span>{activeUser?.name}</span>
          </button>
        )}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, marginTop: 8 }}><Logo /></div>
        <div style={{ display: "inline-block", background: "rgba(10,22,16,0.52)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderRadius: 18, padding: "14px 22px", border: "1px solid rgba(62,207,185,0.15)" }}>
          <div style={{ fontSize: 10.5, color: "#3ecfb9", letterSpacing: 2.8, textTransform: "uppercase", fontWeight: 500, marginBottom: 5, opacity: 0.9 }}>Welcome back, {activeUser?.name || "friend"}</div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#f0f8f4", fontWeight: 400, lineHeight: 1.25 }}>Lafayette<br />Reservoir</div>
          <div style={{ fontSize: 11, color: "#5aad82", marginTop: 6 }}>Annual Pass · Purchased {fmtDate(settings.passDate)}</div>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 18px", marginBottom: 14 }}>
        {[{ val: visits.length, lbl: "Visits" }, { val: fmtDur(totalMins), lbl: "Time" }, { val: `$${totalParking.toFixed(0)}`, lbl: "Saved" }, { val: `${totalMiles.toFixed(1)} mi`, lbl: "Miles" }].map(({ val, lbl }) => (
          <div key={lbl} className="card" style={{ textAlign: "center", padding: "14px 8px" }}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 22, color: "#3ecfb9", fontWeight: 600, marginBottom: 3 }}>{val}</div>
            <div style={{ fontSize: 9.5, color: "#4f8c6e", textTransform: "uppercase", letterSpacing: 1.2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <div className="sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="card">
          <div className="lbl" style={{ marginBottom: 14 }}>Break-Even Progress</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "#6aad8a", marginBottom: 3 }}>Parking saved</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 30, color: "#d8ece0", lineHeight: 1 }}>${totalParking.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#6aad8a", marginBottom: 3 }}>{remaining === 0 ? "Achieved!" : "Still need"}</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 30, color: remaining === 0 ? "#9fd46a" : "#d4a853", lineHeight: 1 }}>
                {remaining === 0 ? "✓" : `$${remaining.toFixed(2)}`}
              </div>
            </div>
          </div>
          <div style={{ height: 7, background: "#0c1c17", borderRadius: 10, overflow: "hidden", marginBottom: 7 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#3ecfb9,#d4a853)", borderRadius: 10, transition: "width .8s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: "#3a6652" }}>$0</span>
            <span style={{ fontSize: 10, color: "#6aad8a" }}>{pct.toFixed(0)}% recovered</span>
            <span style={{ fontSize: 10, color: "#3a6652" }}>${PASS_COST}</span>
          </div>
        </div>
      </div>

      {visits.length > 0 && (
        <div className="sec" style={{ paddingBottom: 0, position: "relative", zIndex: 1 }}>
          <div className="lbl">Last Visit</div>
          <div className="card" style={{ display: "flex", gap: 13, alignItems: "center" }}>
            <div style={{ fontSize: 26 }}>{ACT_ICON[visits[0].activity]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#d8ece0", fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{fmtDate(visits[0].date)}</div>
              <div style={{ color: "#4f8c6e", fontSize: 12 }}>{visits[0].activity} · {fmtDur(visits[0].duration)}</div>
              {visits[0].notes && <div style={{ color: "#3a6652", fontSize: 11, marginTop: 4, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{visits[0].notes}"</div>}
            </div>
            <div style={{ color: visits[0].parkingCost > 0 ? "#9fd46a" : "#3a6652", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
              {visits[0].parkingCost > 0 ? `+$${visits[0].parkingCost.toFixed(2)}` : "Pass"}
            </div>
          </div>
        </div>
      )}

      {visits.length === 0 && (
        <div className="sec" style={{ position: "relative", zIndex: 1 }}>
          <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏞️</div>
            <div style={{ color: "#6aad8a", fontSize: 14 }}>No visits logged yet</div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", paddingTop: 8, paddingBottom: 4, position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: 10, color: "#243d30", letterSpacing: 1 }}>v0.5</span>
      </div>
    </div>
  );

  const LogScreen = () => (
    <div style={{ padding: "18px 18px 32px" }}>
      <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, marginBottom: 4 }}>Log a Visit</div>
      <div style={{ fontSize: 12.5, color: "#4f8c6e", marginBottom: 24 }}>Record your time at the reservoir</div>
      {logSuccess && <SuccessBanner msg="Visit logged!" />}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div className="lbl">Date</div>
          <input type="date" className="ifield" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ colorScheme: "dark" }} />
        </div>
        <div>
          <div className="lbl">Activity</div>
          <ActivityPills value={form.activity} onChange={a => setForm({ ...form, activity: a })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
          <div>
            <div className="lbl">Duration (min)</div>
            <input type="number" className="ifield" placeholder="e.g. 90" min="0" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div>
            <div className="lbl">Parking Saved ($)</div>
            <input type="number" className="ifield" placeholder="e.g. 6.00" min="0" step="0.01" value={form.parkingCost} onChange={e => setForm({ ...form, parkingCost: e.target.value })} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
          <div>
            <div className="lbl">Distance (miles) <span style={{ color: "#3a6652", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span></div>
            <input type="number" className="ifield" placeholder="e.g. 5.0" min="0" step="0.1" value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} />
          </div>
          <div>
            <div className="lbl">Weight (lbs) <span style={{ color: "#3a6652", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span></div>
            <input type="number" className="ifield" placeholder="e.g. 178.5" min="0" step="0.1" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
          </div>
        </div>
        <div onClick={() => setForm({ ...form, dog: !form.dog })}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#152820", borderRadius: 14, padding: "13px 15px", border: `1px solid ${form.dog ? "#3ecfb9" : "#1e3d30"}`, cursor: "pointer", userSelect: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🐕</span>
            <div>
              <div style={{ fontSize: 14, color: "#d8ece0" }}>Walked with dog</div>
              <div style={{ fontSize: 11, color: "#4f8c6e" }}>Optional</div>
            </div>
          </div>
          <div style={{ width: 44, height: 26, borderRadius: 13, background: form.dog ? "#3ecfb9" : "#0c1c17", border: `1px solid ${form.dog ? "#3ecfb9" : "#2a5040"}`, position: "relative", transition: "background .2s" }}>
            <div style={{ position: "absolute", top: 3, left: form.dog ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: form.dog ? "#071510" : "#2a5040", transition: "left .2s" }} />
          </div>
        </div>
        <div>
          <div className="lbl">Notes</div>
          <textarea className="ifield" rows={3} placeholder="How was your visit?" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: "none", lineHeight: 1.55 }} />
        </div>
        <button className="cta" onClick={addVisit} disabled={!form.date || !form.duration}>+ Log Visit</button>
        <div style={{ fontSize: 11, color: "#3a6652", textAlign: "center", lineHeight: 1.5 }}>Enter the daily parking rate you saved by using your annual pass</div>
      </div>
    </div>
  );

  const exportCSV = () => {
    const header = ["Date", "Activity", "Duration (min)", "Parking Saved ($)", "Distance (mi)", "Weight (lbs)", "Dog", "Notes"];
    const rows = [...visits].sort((a, b) => a.date.localeCompare(b.date)).map(v => [
      v.date, v.activity, v.duration ?? "", v.parkingCost ?? "", v.distance ?? "", v.weight ?? "", v.dog ? "Yes" : "No",
      `"${(v.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "lafayette-visits.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const payload = { version: "0.5", exported: new Date().toISOString(), visits };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "lafayette-backup.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const incoming = parsed.visits ?? parsed;
        if (!Array.isArray(incoming)) { alert("Invalid backup file."); return; }
        if (!window.confirm(`Import ${incoming.length} visits? This will replace your current data.`)) return;
        const updated = incoming.sort((a, b) => b.date.localeCompare(a.date));
        setVisits(updated); saveVisits(updated);
      } catch { alert("Could not read file. Make sure it's a valid JSON backup."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const HistoryScreen = () => (
    <div style={{ padding: "18px 18px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400 }}>Visit Log</div>
      </div>
      <div style={{ fontSize: 12.5, color: "#4f8c6e", marginBottom: 12 }}>{visits.length} visit{visits.length !== 1 ? "s" : ""} · {fmtDur(totalMins)} total</div>

      {/* export / import toolbar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button onClick={exportJSON} style={{ flex: 1, background: "#3ecfb9", color: "#071510", border: "none", borderRadius: 12, padding: "10px 6px", fontSize: 12, fontWeight: 600, cursor: "pointer", lineHeight: 1.3, textAlign: "center" }}>
          ↓ Backup<br/><span style={{ fontSize: 10, fontWeight: 400 }}>JSON</span>
        </button>
        <label style={{ flex: 1, background: "#1a3528", border: "1px solid #2a5040", color: "#3ecfb9", borderRadius: 12, padding: "10px 6px", fontSize: 12, fontWeight: 500, cursor: "pointer", lineHeight: 1.3, textAlign: "center", display: "block" }}>
          ↑ Restore<br/><span style={{ fontSize: 10, fontWeight: 400 }}>JSON</span>
          <input type="file" accept=".json" onChange={importJSON} style={{ display: "none" }} />
        </label>
        <button onClick={exportCSV} disabled={visits.length === 0} style={{ flex: 1, background: "#152820", border: "1px solid #1e3d30", color: "#6aad8a", borderRadius: 12, padding: "10px 6px", fontSize: 12, fontWeight: 500, cursor: visits.length === 0 ? "default" : "pointer", opacity: visits.length === 0 ? 0.4 : 1, lineHeight: 1.3, textAlign: "center" }}>
          ↓ Export<br/><span style={{ fontSize: 10, fontWeight: 400 }}>CSV</span>
        </button>
      </div>

      {visits.length === 0 && <div style={{ textAlign: "center", color: "#3a6652", padding: "48px 0", fontSize: 13 }}>No visits yet</div>}
      {visits.map(v => (
        <div key={v.id} className="visit-row">
          {editId === v.id ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div style={{ fontSize: 12, color: "#3ecfb9", fontWeight: 500 }}>Editing visit</div>
              <div>
                <div className="lbl">Date</div>
                <input type="date" className="ifield" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <div className="lbl">Activity</div>
                <ActivityPills value={editForm.activity} onChange={a => setEditForm({ ...editForm, activity: a })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div className="lbl">Duration (min)</div>
                  <input type="number" className="ifield" min="0" value={editForm.duration} onChange={e => setEditForm({ ...editForm, duration: e.target.value })} />
                </div>
                <div>
                  <div className="lbl">Parking ($)</div>
                  <input type="number" className="ifield" min="0" step="0.01" value={editForm.parkingCost} onChange={e => setEditForm({ ...editForm, parkingCost: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div className="lbl">Distance (mi)</div>
                  <input type="number" className="ifield" min="0" step="0.1" placeholder="optional" value={editForm.distance} onChange={e => setEditForm({ ...editForm, distance: e.target.value })} />
                </div>
                <div>
                  <div className="lbl">Weight (lbs)</div>
                  <input type="number" className="ifield" min="0" step="0.1" placeholder="optional" value={editForm.weight} onChange={e => setEditForm({ ...editForm, weight: e.target.value })} />
                </div>
              </div>
              <div onClick={() => setEditForm({ ...editForm, dog: !editForm.dog })}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0c1c17", borderRadius: 14, padding: "11px 13px", border: `1px solid ${editForm.dog ? "#3ecfb9" : "#1e3d30"}`, cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 17 }}>🐕</span>
                  <span style={{ fontSize: 13, color: "#d8ece0" }}>Walked with dog</span>
                </div>
                <div style={{ width: 40, height: 24, borderRadius: 12, background: editForm.dog ? "#3ecfb9" : "#0c1c17", border: `1px solid ${editForm.dog ? "#3ecfb9" : "#2a5040"}`, position: "relative", transition: "background .2s" }}>
                  <div style={{ position: "absolute", top: 3, left: editForm.dog ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: editForm.dog ? "#071510" : "#2a5040", transition: "left .2s" }} />
                </div>
              </div>
              <div>
                <div className="lbl">Notes</div>
                <textarea className="ifield" rows={2} placeholder="Notes…" value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} style={{ resize: "none", lineHeight: 1.55 }} />
              </div>
              <div style={{ display: "flex", gap: 9 }}>
                <button onClick={() => setEditId(null)} style={{ flex: 1, padding: 10, background: "#152820", color: "#6aad8a", border: "1px solid #1e3d30", borderRadius: 12, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                <button onClick={commitEdit} style={{ flex: 2, padding: 10, background: "#3ecfb9", color: "#071510", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#d8ece0", fontSize: 14, fontWeight: 500, marginBottom: 7 }}>{fmtDate(v.date)}</div>
                  <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="badge" style={{ background: ACT_COLOR[v.activity] + "20", color: ACT_COLOR[v.activity], border: `1px solid ${ACT_COLOR[v.activity]}44` }}>
                      {ACT_ICON[v.activity]} {v.activity}
                    </span>
                    <span style={{ fontSize: 11.5, color: "#6aad8a" }}>{fmtDur(v.duration)}</span>
                    {v.dog && <span style={{ fontSize: 11.5, color: "#d4a853" }}>🐕</span>}
                    {v.distance && <span style={{ fontSize: 11.5, color: "#9fd46a" }}>📍 {v.distance} mi</span>}
                    {v.weight && <span style={{ fontSize: 11.5, color: "#7ab8e8" }}>⚖️ {v.weight} lbs</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                  <div style={{ color: v.parkingCost > 0 ? "#9fd46a" : "#3a6652", fontSize: 13, fontWeight: 600 }}>
                    {v.parkingCost > 0 ? `+$${v.parkingCost.toFixed(2)}` : "Pass"}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 7, justifyContent: "flex-end" }}>
                    <button className="btn-edit" onClick={() => openEdit(v)}>edit</button>
                    <button className="btn-del" onClick={() => setDeleteId(deleteId === v.id ? null : v.id)}>{deleteId === v.id ? "cancel" : "delete"}</button>
                  </div>
                </div>
              </div>
              {v.notes && <div className="row-sep" style={{ fontSize: 12.5, color: "#6aad8a", fontStyle: "italic", lineHeight: 1.55 }}>"{v.notes}"</div>}
              {deleteId === v.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: 8, background: "#152820", color: "#6aad8a", border: "1px solid #1e3d30", borderRadius: 10, fontSize: 13, cursor: "pointer" }}>Keep</button>
                  <button onClick={() => deleteVisit(v.id)} style={{ flex: 1, padding: 8, background: "#c84040", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );

  const StatsScreen = () => (
    <div style={{ padding: "18px 18px 36px" }}>
      <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, marginBottom: 3 }}>Analytics</div>
      <div style={{ fontSize: 12.5, color: "#4f8c6e", marginBottom: 22 }}>Your reservoir activity</div>

      <div style={{ marginBottom: 22 }}>
        <div className="lbl">Visits per month</div>
        <div className="card" style={{ height: 175, paddingLeft: 4, paddingRight: 6 }}>
          {monthData.length === 0
            ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#3a6652", fontSize: 12 }}>No data yet</div>
            : <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthData} margin={{ top: 12, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#1c3529" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "#4f8c6e", fontSize: 10, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#4f8c6e", fontSize: 10, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<TipBar />} cursor={{ fill: "rgba(62,207,185,.04)" }} />
                  <Bar dataKey="solo" stackId="a" fill="#3ecfb9" radius={[0, 0, 0, 0]} maxBarSize={44} />
                  <Bar dataKey="dog"  stackId="a" fill="#d4a853" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 10, paddingLeft: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#3ecfb9" }} />
            <span style={{ fontSize: 10.5, color: "#4f8c6e" }}>Solo</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#d4a853" }} />
            <span style={{ fontSize: 10.5, color: "#4f8c6e" }}>🐕 With dog</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div className="lbl">Activity breakdown</div>
        <div className="card">
          {ACTIVITIES.map(a => {
            const count = visits.filter(v => v.activity === a).length;
            const ap    = visits.length ? Math.round((count / visits.length) * 100) : 0;
            const mins  = visits.filter(v => v.activity === a).reduce((s, v) => s + v.duration, 0);
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

      <div style={{ marginBottom: 22 }}>
        <div className="lbl">Miles per month</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[
            { val: visits.filter(v => v.distance).length > 0 ? `${totalMiles.toFixed(1)} mi` : "—", lbl: "Total" },
            { val: visits.filter(v => v.distance).length > 0 ? `${(totalMiles / visits.filter(v => v.distance).length).toFixed(1)} mi` : "—", lbl: "Avg/Visit" },
            { val: visits.filter(v => v.distance).length > 0 ? `${Math.max(...visits.filter(v => v.distance).map(v => v.distance)).toFixed(1)} mi` : "—", lbl: "Longest" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="card" style={{ textAlign: "center", padding: "12px 8px" }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 16, color: "#9fd46a", fontWeight: 600, marginBottom: 3 }}>{val}</div>
              <div style={{ fontSize: 9.5, color: "#4f8c6e", textTransform: "uppercase", letterSpacing: 1.2 }}>{lbl}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ height: 175, paddingLeft: 4, paddingRight: 6 }}>
          {milesMonthData.length === 0
            ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#3a6652", fontSize: 12 }}>No distance data yet</div>
            : <ResponsiveContainer width="100%" height="100%">
                <BarChart data={milesMonthData} margin={{ top: 12, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#1c3529" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "#4f8c6e", fontSize: 10, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#4f8c6e", fontSize: 10, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TipDist />} cursor={{ fill: "rgba(159,212,106,.06)" }} />
                  <Bar dataKey="miles" fill="#9fd46a" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>}
        </div>
      </div>

      <div>
        {weightData.length < 2 ? (
          <div className="card" style={{ textAlign: "center", padding: "28px 16px" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚖️</div>
            <div style={{ color: "#4f8c6e", fontSize: 13, marginBottom: 4 }}>{weightData.length === 0 ? "No weight data yet" : "Log one more visit with weight to see your trend"}</div>
            <div style={{ color: "#3a6652", fontSize: 11 }}>Add weight when logging visits</div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[
                { val: `${latestW} lbs`, lbl: "Current",  col: "#7ab8e8" },
                { val: `${firstW} lbs`,  lbl: "Starting", col: "#7ab8e8" },
                { val: weightDelta === null ? "—" : `${weightDelta > 0 ? "+" : ""}${weightDelta} lbs`, lbl: "Change", col: weightDelta < 0 ? "#9fd46a" : weightDelta > 0 ? "#d4a853" : "#6aad8a" },
              ].map(({ val, lbl, col }) => (
                <div key={lbl} className="card" style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: 16, color: col, fontWeight: 600, marginBottom: 3 }}>{val}</div>
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
                  <Tooltip content={<TipWeight />} cursor={{ stroke: "#7ab8e8", strokeWidth: 1, strokeDasharray: "3 3" }} />
                  <Area type="monotone" dataKey="weight" stroke="#7ab8e8" strokeWidth={2.5} fill="url(#wtGrad)" dot={{ r: 3, fill: "#7ab8e8", stroke: "#0c1c17", strokeWidth: 2 }} activeDot={{ r: 5, fill: "#7ab8e8", stroke: "#0c1c17", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const SettingsScreen = () => {
    const expiry = settings.passDate
      ? (() => { const d = new Date(settings.passDate + "T12:00:00"); d.setFullYear(d.getFullYear() + 1); return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); })()
      : "—";
    const daysHeld = settings.passDate ? Math.max(0, Math.floor((Date.now() - new Date(settings.passDate + "T12:00:00")) / 86400000)) : 0;
    const daysLeft = Math.max(0, 365 - daysHeld);
    return (
      <div style={{ padding: "18px 18px 36px" }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, marginBottom: 3 }}>Settings</div>
        <div style={{ fontSize: 12.5, color: "#4f8c6e", marginBottom: 24 }}>Manage your annual pass details</div>
        {settingsSaved && <SuccessBanner msg="Settings saved" />}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div className="lbl">Annual Pass Cost ($)</div>
            <input type="number" className="ifield" min="1" step="1" placeholder="140" value={settingsForm.passCost} onChange={e => setSettingsForm({ ...settingsForm, passCost: e.target.value })} />
            <div style={{ fontSize: 11, color: "#3a6652", marginTop: 6 }}>Update if the pass price changes at renewal</div>
          </div>
          <div>
            <div className="lbl">Purchase Date</div>
            <input type="date" className="ifield" value={settingsForm.passDate} onChange={e => setSettingsForm({ ...settingsForm, passDate: e.target.value })} style={{ colorScheme: "dark" }} />
            <div style={{ fontSize: 11, color: "#3a6652", marginTop: 6 }}>Update when you renew for next year</div>
          </div>
          <button className="cta" onClick={commitSettings}>Save Settings</button>
        </div>
        <div style={{ marginTop: 28 }}>
          <div className="lbl">Current Pass Summary</div>
          <div className="card">
            {[
              { label: "Pass cost",      val: `$${settings.passCost.toFixed(2)}` },
              { label: "Purchased",      val: fmtDate(settings.passDate) },
              { label: "Expires",        val: expiry },
              { label: "Days active",    val: `${daysHeld} days` },
              { label: "Days remaining", val: `${daysLeft} days` },
              { label: "Daily value",    val: `$${(settings.passCost / 365).toFixed(3)}/day` },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1c3529" }}>
                <span style={{ fontSize: 13, color: "#4f8c6e" }}>{label}</span>
                <span style={{ fontSize: 13, color: "#c8ddd0", fontWeight: 500 }}>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span style={{ fontSize: 13, color: "#4f8c6e" }}>Break-even needed</span>
              <span style={{ fontSize: 13, color: remaining === 0 ? "#9fd46a" : "#d4a853", fontWeight: 500 }}>{remaining === 0 ? "Achieved ✓" : `$${remaining.toFixed(2)} more`}</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="lbl">Users</div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {users.map((u, i) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < users.length - 1 ? "1px solid #1c3529" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AvatarCircle avatar={u.avatar} size={34} active={u.id === activeUser?.id} />
                  <div>
                    <div style={{ fontSize: 13, color: u.id === activeUser?.id ? "#3ecfb9" : "#c8ddd0", fontWeight: u.id === activeUser?.id ? 500 : 400 }}>{u.name}{u.id === activeUser?.id ? " ✓" : ""}</div>
                    <div style={{ fontSize: 10.5, color: "#3a6652" }}>Since {fmtDate(u.created)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  {u.id !== activeUser?.id && (
                    <button onClick={() => switchUser(u)} style={{ background: "#1a3528", border: "1px solid #2a5040", color: "#3ecfb9", borderRadius: 10, padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>Switch</button>
                  )}
                  {users.length > 1 && (
                    <button onClick={() => deleteUser(u.id)} style={{ background: "#2a0f0f", border: "1px solid #7a2020", color: "#e07070", borderRadius: 10, padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="lbl">Add User</div>
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input className="ifield" placeholder="Name" value={newUserName} onChange={e => setNewUserName(e.target.value)} style={{ fontSize: 14 }} />
              <div>
                <div style={{ fontSize: 10.5, color: "#4f8c6e", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Avatar</div>
                <AvatarPicker value={newUserAvatar} onChange={setNewUserAvatar} />
              </div>
              <button onClick={createUser} disabled={!newUserName.trim()}
                style={{ padding: "11px", background: newUserName.trim() ? "#3ecfb9" : "#0c1c17", color: newUserName.trim() ? "#071510" : "#3a6652", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: newUserName.trim() ? "pointer" : "default" }}>
                Create User
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div className="lbl">Danger Zone</div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, color: "#4f8c6e", lineHeight: 1.5 }}>Reset all visit data for {activeUser?.name || "this user"}. This cannot be undone.</div>
            <button onClick={() => { if (window.confirm("Delete all visit history? This cannot be undone.")) { setVisits([]); saveVisits([]); } }}
              style={{ background: "#2a0f0f", border: "1px solid #7a2020", color: "#e07070", borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              Clear All Visit Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────
  const HOURS = [
    { month: "January",   hours: "6:30 am – 5:30 pm" },
    { month: "February",  hours: "6:30 am – 6:00 pm" },
    { month: "March",     hours: "6:30 am – 7:30 pm" },
    { month: "April",     hours: "6:00 am – 8:00 pm" },
    { month: "May",       hours: "6:00 am – 8:30 pm" },
    { month: "June",      hours: "6:00 am – 9:00 pm" },
    { month: "July",      hours: "6:00 am – 9:00 pm" },
    { month: "August",    hours: "6:00 am – 8:30 pm" },
    { month: "September", hours: "6:30 am – 8:00 pm" },
    { month: "October",   hours: "6:30 am – 7:00 pm" },
    { month: "November",  hours: "6:30 am – 5:30 pm" },
    { month: "December",  hours: "6:30 am – 5:30 pm" },
  ];

  const currentMonthHours = HOURS[new Date().getMonth()].hours;

  const InfoScreen = () => (
    <div style={{ padding: "18px 18px 36px" }}>
      <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, marginBottom: 3 }}>Park Info</div>
      <div style={{ fontSize: 12.5, color: "#4f8c6e", marginBottom: 18 }}>Lafayette Reservoir Recreation Area</div>

      {/* Map */}
      <div style={{ marginBottom: 18 }}>
        <div className="lbl">Map</div>
        <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid #1e3d30", height: 220 }}>
          <iframe
            title="Lafayette Reservoir Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.2!2d-122.1341!3d37.8877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80857e5b0de1f015%3A0x2f8e1e6d1e2d1234!2sLafayette%20Reservoir%20Recreation%20Area!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
            width="100%"
            height="220"
            style={{ border: 0, display: "block" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Contact */}
      <div style={{ marginBottom: 18 }}>
        <div className="lbl">Contact</div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { icon: "📍", label: "Address", val: "3849 Mt. Diablo Blvd, Lafayette, CA 94549" },
            { icon: "📞", label: "Phone",   val: "(925) 284-9669" },
          ].map(({ icon, label, val }) => (
            <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #1c3529" }}>
              <span style={{ fontSize: 15, lineHeight: 1.4 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 10.5, color: "#4f8c6e", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#c8ddd0" }}>{val}</div>
              </div>
            </div>
          ))}
          <div style={{ padding: "10px 0" }}>
            <div style={{ fontSize: 10.5, color: "#4f8c6e", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>🌐 Website</div>
            <a href="https://www.ebmud.com/recreation/east-bay/lafayette-reservoir" target="_blank" rel="noreferrer"
              style={{ fontSize: 12.5, color: "#3ecfb9", wordBreak: "break-all", textDecoration: "none" }}>
              ebmud.com/recreation/east-bay/lafayette-reservoir
            </a>
          </div>
        </div>
      </div>

      {/* Today's hours highlight */}
      <div style={{ marginBottom: 18 }}>
        <div className="lbl">Today's Hours</div>
        <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: "#4f8c6e", marginBottom: 3 }}>{HOURS[new Date().getMonth()].month}</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 20, color: "#3ecfb9" }}>{currentMonthHours}</div>
          </div>
          <div style={{ fontSize: 28 }}>🕐</div>
        </div>
      </div>

      {/* Monthly hours */}
      <div style={{ marginBottom: 18 }}>
        <div className="lbl">Hours by Month</div>
        <div className="card" style={{ padding: "6px 18px" }}>
          {HOURS.map(({ month, hours }, i) => {
            const isCurrent = i === new Date().getMonth();
            return (
              <div key={month} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < 11 ? "1px solid #1c3529" : "none", background: isCurrent ? "transparent" : "transparent" }}>
                <span style={{ fontSize: 13, color: isCurrent ? "#3ecfb9" : "#6aad8a", fontWeight: isCurrent ? 600 : 400 }}>{month}{isCurrent ? " ←" : ""}</span>
                <span style={{ fontSize: 12.5, color: isCurrent ? "#d8ece0" : "#4f8c6e", fontWeight: isCurrent ? 500 : 400 }}>{hours}</span>
              </div>
            );
          })}
          <div style={{ fontSize: 10, color: "#3a6652", paddingTop: 8, lineHeight: 1.5 }}>
            Visitor Center: Sep–Mar 6:30 am–4:00 pm · Apr–Aug 6:30 am–5:00 pm
          </div>
        </div>
      </div>

      {/* Trails */}
      <div style={{ marginBottom: 18 }}>
        <div className="lbl">Trails</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "Lakeside Nature Trail", dist: "2.79 mi", type: "Paved loop", diff: "Easy", icon: "🚶", color: "#3ecfb9", desc: "Circles the reservoir. Open to bicyclists during limited hours. Dogs allowed." },
            { name: "Rim Trail",             dist: "4.97 mi", type: "Unpaved fire road", diff: "Moderate", icon: "⛰️", color: "#d4a853", desc: "Traverses ridgetops through brushland and oak forests overlooking the reservoir." },
          ].map(t => (
            <div key={t.name} className="card" style={{ borderLeft: `3px solid ${t.color}`, borderRadius: "0 18px 18px 0", paddingLeft: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, color: "#d8ece0", fontWeight: 500, marginBottom: 3 }}>{t.icon} {t.name}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 11, background: t.color + "22", color: t.color, border: `1px solid ${t.color}44`, borderRadius: 20, padding: "2px 8px" }}>{t.dist}</span>
                    <span style={{ fontSize: 11, background: "#1e3d30", color: "#6aad8a", borderRadius: 20, padding: "2px 8px" }}>{t.diff}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#4f8c6e", lineHeight: 1.55 }}>{t.desc}</div>
              <div style={{ fontSize: 11, color: "#3a6652", marginTop: 6 }}>{t.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div>
        <div className="lbl">Key Rules</div>
        <div className="card">
          {[
            { icon: "🐕", rule: "Dogs must be leashed at all times (6 ft max). No pets in water." },
            { icon: "🚲", rule: "Bikes on Lakeside Trail only — Sun until noon, Tue & Thu afternoons." },
            { icon: "🎣", rule: "EBMUD daily fishing permit required. Purchase at Visitor Center." },
            { icon: "🏊", rule: "No swimming or wading in the reservoir." },
            { icon: "🔥", rule: "BBQ in designated areas only, charcoal only." },
            { icon: "🍄", rule: "Do not eat or collect mushrooms — toxic species present." },
          ].map(({ icon, rule }) => (
            <div key={rule} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid #1c3529" }}>
              <span style={{ fontSize: 15, lineHeight: 1.5, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: 12.5, color: "#6aad8a", lineHeight: 1.55 }}>{rule}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingTop: 9 }}>
            <span style={{ fontSize: 15, lineHeight: 1.5, flexShrink: 0 }}>🦁</span>
            <span style={{ fontSize: 12.5, color: "#6aad8a", lineHeight: 1.55 }}>Mountain lion habitat. Hike in groups, make noise at dusk and dawn.</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  const TABS = [
    { id: "home",     icon: "🏞️" },
    { id: "log",      icon: "✏️" },
    { id: "history",  icon: "📋" },
    { id: "stats",    icon: "📊" },
    { id: "info",     icon: "ℹ️"  },
    { id: "settings", icon: "⚙️" },
  ];
  const TAB_LABELS = { home: "Home", log: "Log", history: "History", stats: "Stats", info: "Info", settings: "Settings" };

  // ── onboarding (no users yet) ─────────────────────────────────
  const OnboardScreen = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px", textAlign: "center" }}>
      <Logo />
      <div style={{ fontFamily: "'Lora', serif", fontSize: 26, color: "#d8ece0", fontWeight: 400, marginTop: 20, marginBottom: 6 }}>Lafayette Reservoir</div>
      <div style={{ fontSize: 13, color: "#4f8c6e", marginBottom: 36 }}>Create your profile to get started</div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        <input className="ifield" placeholder="Your name" value={newUserName} onChange={e => setNewUserName(e.target.value)}
          style={{ textAlign: "center", fontSize: 16 }} />
        <div>
          <div style={{ fontSize: 10.5, color: "#4f8c6e", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Pick an avatar</div>
          <AvatarPicker value={newUserAvatar} onChange={setNewUserAvatar} />
        </div>
        <button onClick={createUser} disabled={!newUserName.trim()} className="cta" style={{ marginTop: 8, opacity: newUserName.trim() ? 1 : 0.4 }}>
          Let's go →
        </button>
      </div>
      <div style={{ fontSize: 10, color: "#243d30", marginTop: 24 }}>v0.8</div>
    </div>
  );

  // ── user picker overlay ───────────────────────────────────────
  const UserPickerOverlay = () => (
    <div style={{ position: "absolute", inset: 0, background: "rgba(6,13,10,.92)", zIndex: 50, display: "flex", flexDirection: "column", padding: "32px 22px 28px" }}>
      <div style={{ fontFamily: "'Lora', serif", fontSize: 22, color: "#d8ece0", marginBottom: 4 }}>Switch User</div>
      <div style={{ fontSize: 12, color: "#4f8c6e", marginBottom: 22 }}>Each user has their own data</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {users.map(u => (
          <button key={u.id} onClick={() => switchUser(u)}
            style={{ display: "flex", alignItems: "center", gap: 14, background: u.id === activeUser?.id ? "#1a3528" : "#152820", border: `1px solid ${u.id === activeUser?.id ? "#3ecfb9" : "#1e3d30"}`, borderRadius: 16, padding: "13px 16px", cursor: "pointer", textAlign: "left" }}>
            <AvatarCircle avatar={u.avatar} size={44} active={u.id === activeUser?.id} />
            <div>
              <div style={{ fontSize: 15, color: u.id === activeUser?.id ? "#3ecfb9" : "#d8ece0", fontWeight: 500 }}>{u.name}{u.id === activeUser?.id ? " ✓" : ""}</div>
              <div style={{ fontSize: 11, color: "#3a6652" }}>Since {fmtDate(u.created)}</div>
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => setShowUserPicker(false)}
        style={{ padding: 14, background: "transparent", border: "1px solid #1e3d30", color: "#6aad8a", borderRadius: 14, fontSize: 14, cursor: "pointer" }}>
        Cancel
      </button>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="phone-wrap">
        <div className="phone" style={{ position: "relative" }}>
          <div className="status">
            <span className="status-time">{timeStr}</span>
            <div className="status-icons">
              <span style={{ color: "#c8ddd0" }}><SignalIcon /></span>
              <span style={{ fontSize: 11, color: "#c8ddd0", fontWeight: 500 }}>LTE</span>
              <span style={{ color: "#c8ddd0" }}><BatteryIcon /></span>
            </div>
          </div>

          {!activeUser ? (
            <div className="screen">{OnboardScreen()}</div>
          ) : (
            <>
              <div className="screen">
                {tab === "home"     && HomeScreen()}
                {tab === "log"      && LogScreen()}
                {tab === "history"  && HistoryScreen()}
                {tab === "stats"    && StatsScreen()}
                {tab === "info"     && InfoScreen()}
                {tab === "settings" && SettingsScreen()}
              </div>
              <div className="tabbar">
                {TABS.map(t => (
                  <div key={t.id} className="tab" onClick={() => setTab(t.id)}>
                    <span className="tab-ic" style={{ opacity: tab === t.id ? 1 : 0.35 }}>{t.icon}</span>
                    <span className="tab-lb" style={{ color: tab === t.id ? "#3ecfb9" : "#2e6045" }}>{TAB_LABELS[t.id]}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {showUserPicker && <UserPickerOverlay />}
        </div>
      </div>
    </>
  );
}
