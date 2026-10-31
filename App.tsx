import { useEffect, useMemo, useState } from "react";
import { Menu, X, Sun, Moon, Zap, ShieldCheck, Headphones, Smartphone, Wifi, ChevronRight, MessageCircle, CheckCircle2, AlertTriangle } from "lucide-react";

type Category = "ALL NETWORKS" | "MTN NORMAL" | "MTN EXPRESS" | "TELECEL";
type Bundle = { network: "MTN NORMAL" | "MTN EXPRESS" | "TELECEL"; size: string; price: number; note: string };
type Status = { main: boolean; alternative: boolean };
const MAIN_URL = "https://mystore.dakazinabusinessconsult.com/store/fastdealgh-data-bundles-emmanuel-adjei-8-enterprise";
const ALT_URL = "https://dealsgh.store/fastdealgh";
const bundles: Bundle[] = [
  ...[[ "1GB",5],[ "2GB",9.9],[ "3GB",14.9],[ "4GB",19.9],[ "5GB",24.9],[ "6GB",29.9],[ "7GB",34.9],[ "8GB",39.9],[ "10GB",45]].map(([size,price])=>({network:"MTN NORMAL" as const,size:String(size),price:Number(price),note:"Standard delivery; may be slower."})),
  ...[[ "1GB",5.5],[ "2GB",11.5],[ "3GB",16],[ "4GB",21],[ "5GB",26],[ "6GB",31],[ "10GB",47]].map(([size,price])=>({network:"MTN EXPRESS" as const,size:String(size),price:Number(price),note:"Designed for faster delivery."})),
  ...[[ "5GB",25],[ "10GB",45],[ "15GB",70],[ "20GB",90]].map(([size,price])=>({network:"TELECEL" as const,size:String(size),price:Number(price),note:"Telecel data bundle."}))
];
const services = ["MTN Normal Data Bundles","MTN Express Data Bundles","Telecel Data Bundles","MTN Agent SIM Registration","Telecel Agent SIM Registration","MTN AFA Registration","NHIS Registration","NHIS Renewal","MTN Mobile Money","Telecel Cash","Phones","Phone Accessories"];
const money = (n:number) => `GH₵${n.toFixed(2)}`;

export default function App() {
  const isAdminPath = window.location.pathname.replace(/\/+$/, "") === "/admin";
  const [theme,setTheme] = useState<"dark"|"light">((localStorage.getItem("fd-theme") as "dark"|"light") || "dark");
  const [category,setCategory] = useState<Category>("ALL NETWORKS");
  const [mobileOpen,setMobileOpen] = useState(false);
  const [phone,setPhone] = useState("0559363548");
  const [selected,setSelected] = useState<Bundle|null>(null);
  const [status,setStatus] = useState<Status>({main:true,alternative:true});
  const [notice,setNotice] = useState("");
  const [waOpen,setWaOpen] = useState(false);
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem("fd-theme",theme)},[theme]);
  useEffect(()=>{fetch("/api/status").then(r=>r.ok?r.json():null).then(d=>d&&setStatus(d.status)).catch(()=>{});},[]);
  const filtered = useMemo(()=>category==="ALL NETWORKS"?bundles:bundles.filter(b=>b.network===category),[category]);

  if (isAdminPath) return <Admin theme={theme} setTheme={setTheme} />;
  const startCheckout = (provider:"main"|"alternative") => { window.location.href = `/checkout/${provider}`; };
  const scrollTo = (id:string) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMobileOpen(false); };

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#home" onClick={e=>{e.preventDefault();scrollTo("home")}}><span className="brand-mark">F</span><span>FASTDEAL<span className="gold">GH</span><small>EMMANUEL ADJEI 8 ENTERPRISE</small></span></a>
      <button className="icon-btn mobile-toggle" aria-label="Toggle menu" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button>
      <nav className={mobileOpen?"nav-links open":"nav-links"}>
        {["Home","Data Bundles","Services","About Us","Contact"].map((label,i)=><button key={label} onClick={()=>scrollTo(["home","bundles","services","about","contact"][i])}>{label}</button>)}
        <button className="icon-btn theme-btn" aria-label="Toggle theme" onClick={()=>setTheme(theme==="dark"?"light":"dark")}>{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button>
        <button className="btn btn-gold nav-buy" onClick={()=>scrollTo("bundles")}>BUY DATA NOW <ChevronRight size={16}/></button>
      </nav>
    </header>
    <main>
      <section className="hero section" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot"/> DIGITAL SERVICES ACROSS GHANA</div>
          <h1>FAST & AFFORDABLE<br/><span className="gold">DATA BUNDLES</span><br/>IN GHANA</h1>
          <p>Buy affordable MTN Normal, MTN Express and Telecel Data Bundles through FASTDEALGH. We also offer selected registration, mobile money, NHIS, phone and accessory services.</p>
          <div className="hero-actions"><button className="btn btn-gold" onClick={()=>scrollTo("bundles")}>BUY DATA NOW <ChevronRight size={18}/></button><button className="btn btn-outline" onClick={()=>scrollTo("services")}>OUR SERVICES</button></div>
          <div className="hero-trust"><span><ShieldCheck size={16}/> Convenient ordering</span><span><Zap size={16}/> Bundle choices</span><span><Headphones size={16}/> Customer support</span></div>
        </div>
        <div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="phone-card"><div className="phone-top"><span/><span/><span/></div><div className="signal-icon"><Wifi size={38}/></div><div className="phone-title">DATA BUNDLES</div><div className="phone-sub">Choose your network</div><div className="network-row"><b className="mtn">MTN</b><b className="telecel">Telecel</b></div><div className="mini-price"><span>From</span><strong>GH₵5.00</strong></div><div className="mini-bar"/></div><div className="floating-chip"><CheckCircle2 size={17}/> Simple online ordering</div></div>
      </section>

      <section className="section bundle-section" id="bundles">
        <div className="section-heading"><div><span className="eyebrow">CHOOSE YOUR PACKAGE</span><h2>Data <span className="gold">Bundles</span></h2><p>Select your network and package. All prices are in Ghana cedis.</p></div><span className="package-count">{bundles.length} packages</span></div>
        <div className="filters">{(["ALL NETWORKS","MTN NORMAL","MTN EXPRESS","TELECEL"] as Category[]).map(c=><button key={c} className={category===c?"filter active":"filter"} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className="bundle-grid">{filtered.map((b,i)=><article className="bundle-card" key={`${b.network}-${b.size}`}><div className="card-top"><span className={`network-pill ${b.network==="TELECEL"?"red":b.network==="MTN EXPRESS"?"express":""}`}>{b.network}</span>{b.network==="MTN EXPRESS"&&<span className="priority">⚡ PRIORITY DELIVERY</span>}</div><div className="data-size">{b.size}</div><div className="bundle-price">{money(b.price)}</div><p className="bundle-note">{b.note}</p><label className="phone-label" htmlFor={`phone-${i}`}>Phone number <span>(optional)</span></label><input id={`phone-${i}`} className="phone-input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Enter number (optional)" inputMode="tel"/><button className="btn btn-gold buy-btn" onClick={()=>setSelected(b)}>BUY NOW <ChevronRight size={16}/></button></article>)}</div>
        <div className="delivery-note"><Zap size={19}/><p><strong>Choose the delivery type that suits you.</strong> MTN Normal uses standard delivery and may be slower. MTN Express is designed for faster delivery. Delivery times are not guaranteed.</p></div>
      </section>

      <section className="section services-section" id="services"><div className="section-heading"><div><span className="eyebrow">MORE THAN DATA</span><h2>Our <span className="gold">Services</span></h2><p>Explore digital services available through FASTDEALGH.</p></div></div><div className="service-grid">{services.map((s,i)=><article className="service-card" key={s}><div className="service-icon">{i<3?<Wifi/>:i<8?<ShieldCheck/>:i<10?<Smartphone/>:<Smartphone/>}</div><h3>{s}</h3><p>Contact our team for details and availability.</p><a href="https://wa.me/233559363548" target="_blank" rel="noreferrer">Ask about service <ChevronRight size={15}/></a></article>)}</div></section>

      <section className="section why-section"><div className="section-heading"><div><span className="eyebrow">THE FASTDEALGH EXPERIENCE</span><h2>Why Choose <span className="gold">Us?</span></h2></div></div><div className="features-grid">{[["Affordable Prices","Clear package prices in Ghana cedis."],["Convenient Online Ordering","Choose a package and select a checkout option."],["Customer Support","Reach our team through WhatsApp or phone."],["Digital Services in One Place","Explore data and selected digital services."],["Easy Access to Services","Mobile-friendly pages and clear navigation."],["Across Ghana","Online service information for customers throughout Ghana."]].map(([t,d],i)=><div className="feature-card" key={t}><span className="feature-num">0{i+1}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>

      <section className="section about-section" id="about"><div className="about-panel"><div><span className="eyebrow">ABOUT FASTDEALGH</span><h2>Digital services, made <span className="gold">convenient.</span></h2></div><div><p>FASTDEAL GH is a digital service provider based in Kumasi, Ghana, serving customers throughout Ghana online. We provide data bundles and a range of convenient digital services, including selected registration services, mobile money services, NHIS services, phones and accessories.</p><p><strong>Our mission:</strong> Our mission is to provide convenient, affordable and reliable digital services for customers across Ghana.</p><div className="about-tags"><span>Kumasi, Ghana</span><span>Serving all Ghana</span><span>EMMANUEL ADJEI 8 ENTERPRISE</span></div></div></div></section>

      <section className="section contact-section" id="contact"><div className="section-heading"><div><span className="eyebrow">WE'RE HERE TO HELP</span><h2>Contact <span className="gold">Us</span></h2><p>Get in touch with FASTDEALGH.</p></div></div><div className="contact-grid"><a className="contact-card" href="tel:0559363548"><span className="service-icon"><Smartphone/></span><small>PHONE 1</small><strong>0559363548</strong></a><a className="contact-card" href="tel:0205453552"><span className="service-icon"><Smartphone/></span><small>PHONE 2</small><strong>0205453552</strong></a><a className="contact-card" href="mailto:fastdealgh88@gmail.com"><span className="service-icon"><MessageCircle/></span><small>EMAIL</small><strong>fastdealgh88@gmail.com</strong></a><div className="contact-card"><span className="service-icon"><Wifi/></span><small>LOCATION & SERVICE AREA</small><strong>Kumasi, Ghana</strong><span>Serving customers across Ghana</span></div></div></section>
    </main>
    <footer className="footer"><div className="footer-main"><div><a className="brand" href="#home"><span className="brand-mark">F</span><span>FASTDEAL<span className="gold">GH</span><small>EMMANUEL ADJEI 8 ENTERPRISE</small></span></a><p>Fast & Affordable Digital Services in Ghana.</p></div><div><h4>Explore</h4><button onClick={()=>scrollTo("bundles")}>Data Bundles</button><button onClick={()=>scrollTo("services")}>Services</button><button onClick={()=>scrollTo("about")}>About Us</button></div><div><h4>Contact</h4><a href="tel:0559363548">0559363548</a><a href="tel:0205453552">0205453552</a><a href="mailto:fastdealgh88@gmail.com">fastdealgh88@gmail.com</a></div><div><h4>WhatsApp</h4><a href="https://wa.me/233559363548" target="_blank" rel="noreferrer">Chat with Admin</a><a href="https://whatsapp.com/channel/0029VbDgY9zJP214llq2OS27" target="_blank" rel="noreferrer">Join our Channel</a></div></div><div className="footer-bottom"><span>© 2026 FASTDEALGH — EMMANUEL ADJEI 8 ENTERPRISE. All rights reserved.</span><a href="/admin">Admin</a></div></footer>

    <div className="whatsapp-float"><button className="wa-button" aria-label="WhatsApp options" onClick={()=>setWaOpen(!waOpen)}><MessageCircle/></button>{waOpen&&<div className="wa-menu"><a href="https://wa.me/233559363548" target="_blank" rel="noreferrer"><strong>Chat with Admin</strong><span>Get Instant Support</span></a><a href="https://whatsapp.com/channel/0029VbDgY9zJP214llq2OS27" target="_blank" rel="noreferrer"><strong>Join Our WhatsApp Channel</strong><span>Get Updates & Deals</span></a></div>}</div>

    {selected&&<div className="modal-backdrop" role="presentation" onClick={()=>setSelected(null)}><div className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onClick={e=>e.stopPropagation()}><button className="modal-close icon-btn" aria-label="Close" onClick={()=>setSelected(null)}><X/></button><span className="eyebrow">YOUR SELECTION</span><h2 id="checkout-title">Choose checkout</h2><div className="selected-summary"><span>{selected.network} · {selected.size}</span><strong>{money(selected.price)}</strong><small>Phone number: {phone.trim()||"Not provided"}</small></div><p>Select an available checkout option. Your phone number is optional.</p><button className={`checkout-choice ${!status.main?"unavailable":""}`} onClick={()=>startCheckout("main")}><span><strong>FASTDEALGH — MAIN</strong><small>{status.main?"Available":"Unavailable"}</small></span><ChevronRight/></button><button className={`checkout-choice ${!status.alternative?"unavailable":""}`} onClick={()=>startCheckout("alternative")}><span><strong>FASTDEALGH — ALTERNATIVE</strong><small>{status.alternative?"Available":"Unavailable"}</small></span><ChevronRight/></button><small className="modal-footnote">Checkout availability is checked by the server when you select an option.</small></div></div>}
    {notice&&<div className="toast" onClick={()=>setNotice("")}><AlertTriangle size={17}/>{notice}</div>}
  </div>;
}

function Admin({theme,setTheme}:{theme:"dark"|"light";setTheme:(t:"dark"|"light")=>void}) {
  const [password,setPassword]=useState("");
  const [loggedIn,setLoggedIn]=useState(false);
  const [status,setStatus]=useState<Status>({main:true,alternative:true});
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);
  async function login(e:React.FormEvent){e.preventDefault();setLoading(true);setMessage("");try{const r=await fetch("/api/admin-login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Login failed");setLoggedIn(true);setStatus(d.status);setMessage("Signed in successfully.");}catch(err){setMessage(err instanceof Error?err.message:"Login failed");}finally{setLoading(false)}}
  async function refresh(){const r=await fetch("/api/admin-status");const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not load settings");setStatus(d.status)}
  useEffect(()=>{if(loggedIn)refresh().catch(e=>setMessage(e.message))},[loggedIn]);
  async function toggle(which:"main"|"alternative",active:boolean){setLoading(true);setMessage("");try{const r=await fetch("/api/admin-status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:which,active})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not save");setStatus(d.status);setMessage("Checkout status saved.");}catch(e){setMessage(e instanceof Error?e.message:"Save failed");}finally{setLoading(false)}}
  return <div className="admin-page"><header className="topbar"><a className="brand" href="/"><span className="brand-mark">F</span><span>FASTDEAL<span className="gold">GH</span><small>ADMINISTRATION</small></span></a><div className="admin-actions"><button className="icon-btn" onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label="Toggle theme">{theme==="dark"?<Sun/>:<Moon/>}</button><a className="btn btn-outline" href="/">Back to website</a></div></header><main className="admin-main"><div className="admin-heading"><span className="eyebrow">PRIVATE ADMIN AREA</span><h1>Checkout <span className="gold">Controls</span></h1><p>Manage each checkout independently. Changes are saved on the server.</p></div>{!loggedIn?<form className="admin-login" onSubmit={login}><h2>Administrator login</h2><p>Enter the administrator password configured in Cloudflare Pages.</p><label htmlFor="admin-password">Admin password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="btn btn-gold" disabled={loading}>{loading?"Checking…":"Sign in"}</button>{message&&<p className="admin-message">{message}</p>}</form>:<div className="admin-controls">{(["main","alternative"] as const).map(k=><article className="admin-status-card" key={k}><div><span className="eyebrow">{k==="main"?"MAIN CHECKOUT":"ALTERNATIVE CHECKOUT"}</span><h2>FASTDEALGH — {k.toUpperCase()}</h2><span className={status[k]?"status-active":"status-inactive"}>{status[k]?"● ACTIVE":"● INACTIVE"}</span></div><div className="switch-row"><button className={`btn ${status[k]?"btn-gold":"btn-outline"}`} disabled={loading||status[k]} onClick={()=>toggle(k,true)}>Turn ON</button><button className={`btn ${!status[k]?"btn-danger":"btn-outline"}`} disabled={loading||!status[k]} onClick={()=>toggle(k,false)}>Turn OFF</button></div></article>)}<button className="btn btn-outline" onClick={()=>{setLoggedIn(false);setPassword("");setMessage("Signed out.");}}>Sign out</button>{message&&<p className="admin-message">{message}</p>}</div>}<div className="admin-warning"><ShieldCheck size={20}/><p><strong>Configuration note:</strong> This dashboard requires Cloudflare Pages Functions, the CHECKOUT_ADMIN_PASSWORD secret, and the FASTDEALGH_SETTINGS KV namespace binding. Configure these before using checkout controls.</p></div></main></div>;
}
