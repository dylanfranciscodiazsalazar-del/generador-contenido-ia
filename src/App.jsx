import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const NICHE_OPTIONS = ["Bienes Raíces","Moda / Apparel","Alimentación & Restaurantes","Salud & Bienestar","Educación","Tecnología","Turismo & Hospitalidad","Retail / E-commerce","Servicios Profesionales","Otro"];
const BUSINESS_OPTIONS = ["Marca Personal","Startup","PYME","Empresa Corporativa","E-commerce","Franquicia","ONG / Causa Social"];
const CONTENT_TYPE_OPTIONS = ["Post de Instagram","Reel / Video corto","Story","Ad Copy (Anuncio)","UGC (Contenido generado por usuario)","Contenido Sensorial / Experiencial","Prompt para IA de imágenes","Guión de video","Newsletter / Email","Carrusel educativo"];
const CTA_OPTIONS = ["Compra directa","Captura de lead","Visita al sitio web","DM / Mensaje directo","WhatsApp","Llamada a agendar","Visita a tienda","Registro / Suscripción","Compartir / Viral"];
const TONE_OPTIONS = ["Profesional","Amigable & Cercano","Aspiracional / Lifestyle","Urgente / FOMO","Educativo","Emocional / Storytelling","Humorístico","Minimalista / Elegante"];
const PLATFORM_OPTIONS = ["Instagram","TikTok","Facebook","LinkedIn","YouTube","Pinterest","Twitter/X","WhatsApp"];
const QUANTITY_OPTIONS = ["1 variación","3 variaciones","5 variaciones","10 variaciones"];
const DAYS = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

function Avatar({ name, size = 36 }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "?";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 500, color: "#185FA5", flexShrink: 0 }}>{initials}</div>
  );
}

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "0.5px solid", background: active ? "#E6F1FB" : "#F1EFE8", color: active ? "#185FA5" : "#5F5E5A", borderColor: active ? "#85B7EB" : "#D3D1C7", fontWeight: active ? 500 : 400 }}>{label}</button>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      if (mode === "register") {
        if (!form.name || !form.email || !form.password) { setErr("Completa todos los campos."); setLoading(false); return; }
        if (form.password !== form.confirm) { setErr("Las contraseñas no coinciden."); setLoading(false); return; }
        if (form.password.length < 6) { setErr("Mínimo 6 caracteres."); setLoading(false); return; }

        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { name: form.name } }
        });
        if (error) { setErr(error.message); setLoading(false); return; }

        if (data.user) {
          await supabase.from("profiles").insert({ id: data.user.id, name: form.name, email: form.email });
        }
        onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) { setErr("Correo o contraseña incorrectos."); setLoading(false); return; }
        onLogin(data.user);
      }
    } catch (e) {
      setErr("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✦</div>
          <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Generador de Contenido IA</h2>
          <p style={{ fontSize: 13, color: "#5F5E5A", marginTop: 6 }}>Tu plataforma de contenido inteligente</p>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "1.5rem" }}>
          <div style={{ display: "flex", borderBottom: "0.5px solid #D3D1C7", marginBottom: 20 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{ flex: 1, padding: "8px 0", fontSize: 13, background: "none", border: "none", borderBottom: `2px solid ${mode===m ? "#2C2C2A" : "transparent"}`, fontWeight: mode===m ? 500 : 400, color: mode===m ? "#2C2C2A" : "#5F5E5A", cursor: "pointer" }}>
                {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>
          {mode === "register" && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#5F5E5A", display: "block", marginBottom: 4 }}>Nombre completo</label>
              <input value={form.name} onChange={f("name")} placeholder="Tu nombre" style={{ width: "100%", boxSizing: "border-box", padding: 8, borderRadius: 6, border: "0.5px solid #D3D1C7" }} />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#5F5E5A", display: "block", marginBottom: 4 }}>Correo electrónico</label>
            <input type="email" value={form.email} onChange={f("email")} placeholder="correo@ejemplo.com" style={{ width: "100%", boxSizing: "border-box", padding: 8, borderRadius: 6, border: "0.5px solid #D3D1C7" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#5F5E5A", display: "block", marginBottom: 4 }}>Contraseña</label>
            <input type="password" value={form.password} onChange={f("password")} placeholder="Mínimo 6 caracteres" style={{ width: "100%", boxSizing: "border-box", padding: 8, borderRadius: 6, border: "0.5px solid #D3D1C7" }} />
          </div>
          {mode === "register" && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#5F5E5A", display: "block", marginBottom: 4 }}>Confirmar contraseña</label>
              <input type="password" value={form.confirm} onChange={f("confirm")} placeholder="Repite tu contraseña" style={{ width: "100%", boxSizing: "border-box", padding: 8, borderRadius: 6, border: "0.5px solid #D3D1C7" }} />
            </div>
          )}
          {err && <p style={{ fontSize: 12, color: "#A32D2D", marginBottom: 12 }}>{err}</p>}
          <button onClick={submit} disabled={loading} style={{ width: "100%", padding: "10px 0", fontSize: 14, fontWeight: 500, background: "#2C2C2A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginTop: 4 }}>
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear mi cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GeneratorTab({ userId, onSaved }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ niche:"", business:"", brand:"", audience:"", contentTypes:[], ctas:[], tone:"", platform:[], quantity:"3 variaciones", extra:"" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [calDay, setCalDay] = useState("Lun");

  const toggle = (field, val) => setConfig(c => ({ ...c, [field]: c[field].includes(val) ? c[field].filter(x=>x!==val) : [...c[field],val] }));
  const canNext = () => {
    if (step===1) return config.niche && config.business;
    if (step===2) return config.contentTypes.length>0 && config.ctas.length>0;
    if (step===3) return config.tone && config.platform.length>0;
    return true;
  };

  const generate = async () => {
    setLoading(true); setResult("");
    const qty = parseInt(config.quantity);
    const prompt = `Eres un estratega de contenido experto en marketing digital y copywriting persuasivo.

Genera ${qty} variación(es) de contenido para redes sociales con estas especificaciones:
NICHO: ${config.niche}
TIPO DE NEGOCIO: ${config.business}
${config.brand ? `MARCA: ${config.brand}` : ""}
${config.audience ? `AUDIENCIA: ${config.audience}` : ""}
FORMATOS: ${config.contentTypes.join(", ")}
CTA: ${config.ctas.join(", ")}
TONO: ${config.tone}
PLATAFORMAS: ${config.platform.join(", ")}
${config.extra ? `INSTRUCCIONES EXTRA: ${config.extra}` : ""}

Para cada variación entrega:
1. 🎯 TIPO DE CONTENIDO & FORMATO
2. 📝 COPY PRINCIPAL (listo para publicar)
3. 📣 CTA específico
4. 🖼️ DESCRIPCIÓN VISUAL
5. #️⃣ HASHTAGS (10-15)
6. ⏰ MEJOR HORARIO PARA PUBLICAR
${config.contentTypes.includes("Prompt para IA de imágenes") ? "7. 🤖 PROMPT IA: [Prompt ultra detallado para DALL-E 3 en inglés, Ultra 4K, fotorrealista]" : ""}

Escribe en español (latinoamérica). Separa cada variación con ---`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, messages:[{role:"user",content:prompt}] }) });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("") || "Error al generar.";
      setResult(text);

      await supabase.from("history").insert({
        user_id: userId,
        niche: config.niche,
        business: config.business,
        content_types: config.contentTypes.join(", "),
        platform: config.platform.join(", "),
        tone: config.tone,
        content: text
      });
      onSaved();
    } catch { setResult("❌ Error de conexión."); }
    setLoading(false);
  };

  const exportDoc = () => {
    window.open("https://docs.google.com/document/create", "_blank");
    navigator.clipboard.writeText(result);
    alert("✅ Se abrió Google Docs y el contenido fue copiado.\nPega con Ctrl+V en el nuevo documento.");
  };

  const saveToCalendar = async () => {
    await supabase.from("calendar").insert({
      user_id: userId,
      day: calDay,
      niche: config.niche,
      platform: config.platform.join(", "),
      content_type: config.contentTypes[0] || "",
      content: result.split("---")[0].trim()
    });
    onSaved();
    alert(`✅ Guardado en el calendario — ${calDay}`);
  };

  const steps = ["Negocio","Contenido","Plataforma","Generar"];

  const selectSingle = (label, field, options) => (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 8, fontWeight: 500 }}>{label}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {options.map(o => <Pill key={o} label={o} active={config[field]===o} onClick={() => setConfig(c=>({...c,[field]:o}))} />)}
      </div>
    </div>
  );

  const selectMulti = (label, field, options) => (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 8, fontWeight: 500 }}>{label}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {options.map(o => <Pill key={o} label={o} active={config[field].includes(o)} onClick={() => toggle(field, o)} />)}
      </div>
    </div>
  );

  if (result) return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <p style={{ fontSize:13, fontWeight:500, color:"#5F5E5A", margin:0 }}>✦ Contenido generado</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2000); }} style={{ fontSize:12 }}>{copied?"¡Copiado!":"Copiar"}</button>
          <button onClick={exportDoc} style={{ fontSize:12 }}>Exportar a Google Docs</button>
          <button onClick={() => setResult("")} style={{ fontSize:12 }}>Regenerar</button>
          <button onClick={() => { setResult(""); setStep(1); setConfig({ niche:"", business:"", brand:"", audience:"", contentTypes:[], ctas:[], tone:"", platform:[], quantity:"3 variaciones", extra:"" }); }} style={{ fontSize:12 }}>Nueva sesión</button>
        </div>
      </div>
      <div style={{ background:"#F1EFE8", borderRadius:12, padding:"1.25rem", border:"0.5px solid #D3D1C7", fontSize:13, lineHeight:1.8, whiteSpace:"pre-wrap", maxHeight:420, overflowY:"auto", marginBottom:16 }}>{result}</div>
      <div style={{ background:"#F1EFE8", borderRadius:8, padding:"1rem", border:"0.5px solid #D3D1C7" }}>
        <p style={{ fontSize:12, fontWeight:500, color:"#5F5E5A", marginBottom:10 }}>Guardar en calendario de contenido</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
          {DAYS.map(d => <Pill key={d} label={d} active={calDay===d} onClick={() => setCalDay(d)} />)}
        </div>
        <button onClick={saveToCalendar} style={{ fontSize:12 }}>Guardar en calendario → {calDay}</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", gap:0, marginBottom:24, borderBottom:"0.5px solid #D3D1C7" }}>
        {steps.map((s,i) => (
          <div key={s} onClick={() => i+1<step && setStep(i+1)} style={{ padding:"8px 14px", fontSize:12, cursor:i+1<step?"pointer":"default", color:i+1===step?"#2C2C2A":"#888780", borderBottom:`2px solid ${i+1===step?"#2C2C2A":"transparent"}`, fontWeight:i+1===step?500:400 }}>{i+1}. {s}</div>
        ))}
      </div>

      {step===1 && <>
        {selectSingle("Nicho de negocio", "niche", NICHE_OPTIONS)}
        {selectSingle("Tipo de negocio", "business", BUSINESS_OPTIONS)}
        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:12, color:"#5F5E5A", marginBottom:6, fontWeight:500 }}>Nombre de marca (opcional)</p>
          <input value={config.brand} onChange={e=>setConfig(c=>({...c,brand:e.target.value}))} placeholder="Ej: Paseo del Bosque Condominio" style={{ width:"100%", boxSizing:"border-box", padding:8, borderRadius:6, border:"0.5px solid #D3D1C7" }} />
        </div>
        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:12, color:"#5F5E5A", marginBottom:6, fontWeight:500 }}>Audiencia objetivo (opcional)</p>
          <input value={config.audience} onChange={e=>setConfig(c=>({...c,audience:e.target.value}))} placeholder="Ej: Mujeres 25-45, profesionales, Managua" style={{ width:"100%", boxSizing:"border-box", padding:8, borderRadius:6, border:"0.5px solid #D3D1C7" }} />
        </div>
      </>}

      {step===2 && <>
        {selectMulti("Tipo(s) de contenido", "contentTypes", CONTENT_TYPE_OPTIONS)}
        {selectMulti("Tipo(s) de CTA", "ctas", CTA_OPTIONS)}
        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:12, color:"#5F5E5A", marginBottom:6, fontWeight:500 }}>Variaciones a generar</p>
          <div style={{ display:"flex", gap:6 }}>
            {QUANTITY_OPTIONS.map(q => <Pill key={q} label={q} active={config.quantity===q} onClick={() => setConfig(c=>({...c,quantity:q}))} />)}
          </div>
        </div>
      </>}

      {step===3 && <>
        {selectSingle("Tono de voz", "tone", TONE_OPTIONS)}
        {selectMulti("Plataforma(s)", "platform", PLATFORM_OPTIONS)}
        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:12, color:"#5F5E5A", marginBottom:6, fontWeight:500 }}>Instrucciones adicionales (opcional)</p>
          <textarea value={config.extra} onChange={e=>setConfig(c=>({...c,extra:e.target.value}))} placeholder="Incluir precio, mencionar ubicación, evitar ciertos términos..." rows={3} style={{ width:"100%", boxSizing:"border-box", padding:8, borderRadius:6, border:"0.5px solid #D3D1C7", resize:"vertical" }} />
        </div>
      </>}

      {step===4 && <>
        <div style={{ background:"#F1EFE8", borderRadius:12, padding:"1.25rem", marginBottom:20, border:"0.5px solid #D3D1C7" }}>
          {[["Nicho",config.niche],["Negocio",config.business],config.brand&&["Marca",config.brand],config.audience&&["Audiencia",config.audience],["Contenido",config.contentTypes.join(", ")],["CTA",config.ctas.join(", ")],["Tono",config.tone],["Plataformas",config.platform.join(", ")],["Variaciones",config.quantity]].filter(Boolean).map(([k,v])=>(
            <div key={k} style={{ display:"flex", gap:12, marginBottom:8, fontSize:12 }}>
              <span style={{ color:"#888780", minWidth:80 }}>{k}</span>
              <span style={{ color:"#2C2C2A", fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={generate} disabled={loading} style={{ width:"100%", padding:"12px 0", fontSize:14, fontWeight:500, cursor:loading?"not-allowed":"pointer", background:loading?"#D3D1C7":"#2C2C2A", color:loading?"#888780":"#fff", border:"none", borderRadius:6 }}>
          {loading?"Generando contenido...":"✦ Generar contenido ahora"}
        </button>
      </>}

      <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
        {step>1 ? <button onClick={()=>setStep(s=>s-1)} style={{ fontSize:12 }}>← Atrás</button> : <span/>}
        {step<4 && <button onClick={()=>setStep(s=>s+1)} disabled={!canNext()} style={{ fontSize:12, opacity:canNext()?1:0.4, cursor:canNext()?"pointer":"not-allowed" }}>Siguiente →</button>}
      </div>
    </div>
  );
}

function HistoryTab({ history, onDelete }) {
  if (!history.length) return (
    <div style={{ textAlign:"center", padding:"3rem 0", color:"#888780", fontSize:13 }}>
      <div style={{ fontSize:32, marginBottom:12 }}>📋</div>
      <p>Aún no tienes generaciones guardadas.</p>
      <p>Ve al generador y crea tu primer contenido.</p>
    </div>
  );
  return (
    <div>
      <p style={{ fontSize:13, color:"#5F5E5A", marginBottom:16 }}>{history.length} generación(es) guardada(s)</p>
      {history.map(h => (
        <div key={h.id} style={{ background:"#F1EFE8", borderRadius:12, padding:"1rem 1.25rem", marginBottom:12, border:"0.5px solid #D3D1C7" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div>
              <p style={{ fontSize:13, fontWeight:500, margin:0 }}>{h.niche} — {h.content_types}</p>
              <p style={{ fontSize:11, color:"#888780", margin:"2px 0 0" }}>{new Date(h.created_at).toLocaleDateString("es-NI")} · {h.platform} · Tono: {h.tone}</p>
            </div>
            <button onClick={() => onDelete(h.id)} style={{ fontSize:11, color:"#A32D2D" }}>Eliminar</button>
          </div>
          <div style={{ fontSize:12, color:"#5F5E5A", lineHeight:1.7, maxHeight:120, overflowY:"auto", whiteSpace:"pre-wrap", borderTop:"0.5px solid #D3D1C7", paddingTop:10 }}>{h.content.slice(0,400)}{h.content.length>400?"...":""}</div>
          <div style={{ marginTop:10, display:"flex", gap:6 }}>
            <button onClick={() => navigator.clipboard.writeText(h.content)} style={{ fontSize:11 }}>Copiar contenido</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarTab({ calendar, onDelete }) {
  const byDay = DAYS.reduce((acc,d)=>({ ...acc, [d]: calendar.filter(e=>e.day===d) }), {});
  return (
    <div>
      <p style={{ fontSize:13, color:"#5F5E5A", marginBottom:16 }}>Calendario semanal de contenido</p>
      {DAYS.map(d => (
        <div key={d} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"#2C2C2A", minWidth:36 }}>{d}</span>
            <div style={{ flex:1, height:"0.5px", background:"#D3D1C7" }} />
            <span style={{ fontSize:11, color:"#888780" }}>{byDay[d].length} pieza(s)</span>
          </div>
          {byDay[d].length === 0 ? (
            <div style={{ padding:"8px 12px", borderRadius:6, border:"0.5px dashed #D3D1C7", fontSize:12, color:"#888780", marginLeft:44 }}>Sin contenido programado</div>
          ) : byDay[d].map(e => (
            <div key={e.id} style={{ marginLeft:44, marginBottom:6, background:"#F1EFE8", borderRadius:6, padding:"10px 12px", border:"0.5px solid #D3D1C7" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <span style={{ fontSize:12, fontWeight:500 }}>{e.content_type || "Contenido"}</span>
                  <span style={{ fontSize:11, color:"#888780", marginLeft:8 }}>{e.niche} · {e.platform}</span>
                </div>
                <button onClick={() => onDelete(e.id)} style={{ fontSize:11, color:"#A32D2D" }}>×</button>
              </div>
              <p style={{ fontSize:11, color:"#5F5E5A", margin:"4px 0 0", lineHeight:1.5 }}>{e.content.slice(0,140)}{e.content.length>140?"...":""}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [tab, setTab] = useState("generator");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) loadData(session.user.id);
  }, [session]);

  const loadData = async (userId) => {
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(prof);
    const { data: hist } = await supabase.from("history").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setHistory(hist || []);
    const { data: cal } = await supabase.from("calendar").select("*").eq("user_id", userId);
    setCalendar(cal || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const deleteHistory = async (id) => {
    await supabase.from("history").delete().eq("id", id);
    loadData(session.user.id);
  };

  const deleteCalendar = async (id) => {
    await supabase.from("calendar").delete().eq("id", id);
    loadData(session.user.id);
  };

  if (checking) return <div style={{ padding: 40, textAlign: "center", fontSize: 13 }}>Cargando...</div>;
  if (!session) return <AuthScreen onLogin={() => {}} />;
  if (!profile) return <div style={{ padding: 40, textAlign: "center", fontSize: 13 }}>Cargando tu perfil...</div>;

  const TABS = [
    { id:"generator", label:"Generador" },
    { id:"history", label:`Historial (${history.length})` },
    { id:"calendar", label:"Calendario" },
  ];

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", maxWidth:680, margin:"0 auto", padding:"1.25rem 1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:16, fontWeight:500 }}>✦</span>
          <span style={{ fontSize:15, fontWeight:500, color:"#2C2C2A" }}>Generador IA</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Avatar name={profile.name} size={30} />
          <span style={{ fontSize:12, color:"#5F5E5A" }}>{profile.name}</span>
          <button onClick={handleLogout} style={{ fontSize:11, color:"#888780", border:"none", background:"none", cursor:"pointer", padding:0 }}>Salir</button>
        </div>
      </div>

      <div style={{ display:"flex", borderBottom:"0.5px solid #D3D1C7", marginBottom:24 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"8px 16px", fontSize:13, background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?"#2C2C2A":"transparent"}`, fontWeight:tab===t.id?500:400, color:tab===t.id?"#2C2C2A":"#5F5E5A", cursor:"pointer" }}>{t.label}</button>
        ))}
      </div>

      {tab==="generator" && <GeneratorTab userId={session.user.id} onSaved={() => loadData(session.user.id)} />}
      {tab==="history" && <HistoryTab history={history} onDelete={deleteHistory} />}
      {tab==="calendar" && <CalendarTab calendar={calendar} onDelete={deleteCalendar} />}
    </div>
  );
}
