import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Award, BarChart3, Bell,
  BookOpen, CheckCircle2, ChevronRight, CircleHelp, Clock3, Compass, Cross,
  Download, ExternalLink, Globe2, HeartHandshake, HeartPulse, KeyRound, LockKeyhole,
  Mail, MapPin, Menu, MessageCircle, Phone, Pill, Search, ShieldCheck, Sparkles,
  Stethoscope, Target, UserRound, UsersRound, X, Zap, Siren, FileText, UploadCloud, 
  AlertTriangle, User, Lock, Linkedin, Landmark, Star, Upload
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
type Language = 'en' | 'te';
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: 'en', setLanguage: () => undefined });
function useLanguage() { return useContext(LanguageContext); }
type IconType = typeof HeartPulse;

const translations = {
  en: {
    topBar: "Government of India | Ministry of Health & Family Welfare",
    heroTitle: <>One nation.<br /><span>One Health ID.</span></>,
    heroSub: "A secure, connected front door to healthcare — designed so no citizen has to navigate care alone.",
    citizen: "A digital public good for every Indian", ecosystem: "One connected ecosystem", about: "The idea behind IHO",
    aboutTitle: <>Health should feel like a <em>right.</em></>, pillars: "Seven pillars. One direction.",
    impact: "The promise is measurable.", team: "Students with a national brief.",
    process: "From human need to working prototype.", updates: "A project in motion.",
    connect: "Connect on LinkedIn", explore: "Explore pillar", national: "Designed for every citizen across India",
    prototype: "Student-led prototype · Not an official government portal",
  },
  te: {
    topBar: "భారత ప్రభుత్వం | ఆరోగ్య మరియు కుటుంబ సంక్షేమ మంత్రిత్వ శాఖ",
    heroTitle: <>ఒక దేశం.<br /><span>ఒక ఆరోగ్య ఐడీ.</span></>,
    heroSub: "ప్రతి పౌరుడికి సురక్షితమైన, అనుసంధానించబడిన ఆరోగ్య సేవల వేదిక.",
    citizen: "ప్రతి భారతీయుడి కోసం డిజిటల్ ప్రజా సేవ", ecosystem: "ఒకే అనుసంధానిత ఆరోగ్య వ్యవస్థ", about: "IHO ఆలోచన వెనుక కథ",
    aboutTitle: <>ఆరోగ్యం ఒక <em>హక్కుగా</em> ఉండాలి.</>, pillars: "ఏడు స్తంభాలు. ఒకే లక్ష్యం.",
    impact: "మన లక్ష్యం కొలవదగినది.", team: "జాతీయ లక్ష్యంతో విద్యార్థులు.",
    process: "ప్రజల అవసరం నుంచి పనిచేసే నమూనా వరకు.", updates: "ముందుకు సాగుతున్న ప్రాజెక్ట్.",
    connect: "లింక్డ్‌ఇన్‌లో కలవండి", explore: "విభాగాన్ని చూడండి", national: "భారతదేశంలోని ప్రతి పౌరుడి కోసం రూపొందించబడింది",
    prototype: "విద్యార్థుల నమూనా · అధికారిక ప్రభుత్వ పోర్టల్ కాదు",
  }
};

const slides = [
  {
    kicker: 'A digital public good for every Indian',
    title: <>One nation.<br /><span>One Health ID.</span></>,
    copy: 'A secure, connected front door to healthcare — designed so no citizen has to navigate care alone.',
    cta: 'Create your Health ID',
  },
  {
    kicker: 'Care without borders',
    title: <>The right healer.<br /><span>When you need them.</span></>,
    copy: 'Find and connect with doctors across modern medicine and AYUSH, with language and location on your side.',
    cta: 'Find a healer',
  },
  {
    kicker: 'Fair access, clearly priced',
    title: <>Medicines that reach<br /><span>every doorstep.</span></>,
    copy: 'Transparent, government-approved generic medicines, connected from prescription to delivery.',
    cta: 'Explore Dawa Ghar',
  },
  {
    kicker: 'The golden hour matters',
    title: <>One tap to<br /><span>Sahayata.</span></>,
    copy: 'A rapid response layer connecting your family, the nearest hospital and emergency services.',
    cta: 'See emergency response',
  },
];

const pillars: { title: string; description: string; icon: IconType; number: string; status?: string; path: string; color: string }[] = [
  { number: '01', title: 'Universal Health ID', description: 'One private, portable identity for records, allergies, blood group and care history.', icon: KeyRound, path: '/health-id', color: '#2563eb' },
  { number: '02', title: 'Healer Connect', description: 'A trusted directory for allopathy, Ayurveda, Yoga, Unani, Siddha and Homeopathy.', icon: Stethoscope, path: '/healer-connect', color: '#0d9488' },
  { number: '03', title: 'Dawa Ghar', description: 'A transparent route from prescription to genuine, affordable medicines at home.', icon: Pill, path: '/dawa-ghar', color: '#059669' },
  { number: '04', title: 'Sahayata', description: 'Rapid emergency alerts to hospitals, ambulances and the people who matter.', icon: Zap, path: '/sahayata', color: '#dc2626' },
  { number: '05', title: 'Swasthya Yojana', description: 'Government health schemes explained simply, with eligibility made visible.', icon: Award, path: '/swasthya-yojana', color: '#4f46e5' },
  { number: '06', title: 'Bharat Health Pulse', description: 'Privacy-protected signals that help the nation see and respond to health trends.', icon: BarChart3, path: '/bharat-health-pulse', color: '#9333ea' },
  { number: '07', title: 'Suraksha Kavach', description: 'Encryption, consent and governance that put citizens in control of their health data.', icon: ShieldCheck, path: '/suraksha-kavach', color: '#334155' },
];

const team = [
  { initials: 'GV', name: 'Guvvala Venkata Narayana', role: 'Chief Architect · Integration', quote: 'We are not doctors. We are architects of the bridge.', linkedin: 'https://www.linkedin.com/in/venkatanarayana7/' },
  { initials: 'SN', name: 'Shaik Nusrath', role: 'Empathy & Experience Lead', quote: 'Trust begins when a system feels understandable.', linkedin: 'https://in.linkedin.com/in/nusrath-shaik-33943942b/' },
  { initials: 'SS', name: 'Shaik Sameera', role: 'Data & Logic Lead', quote: 'Good information should travel as far as need does.', linkedin: 'https://www.linkedin.com/in/shaik-sameera-a04900427/' },
  { initials: 'VG', name: 'Vikram Gayatri', role: 'Systems & Integration', quote: 'The golden hour is a design problem we can solve.', linkedin: 'https://www.linkedin.com/in/gayatri-vikram-0933b23aa/' },
  { initials: 'JB', name: 'Jegini Bhargavi', role: 'Innovation & Future Tech', quote: 'A prototype can be a promise with working edges.', linkedin: 'https://www.linkedin.com/in/bhargavi-jegini-90365342b/' },
];

const updates = [
  { date: '08 AUG 2026', title: 'Why one Health ID changes the first five minutes of care', description: 'A short field note on continuity, consent and the everyday moments where systems fail citizens.' },
  { date: '01 AUG 2026', title: 'A scheme should not require a middleman', description: 'The thinking behind Swasthya Yojana: make benefits legible before they become urgent.' },
  { date: '27 JUL 2026', title: 'Designing for the golden hour', description: 'How the team mapped the chain between a panic button, a hospital and a family member.' },
];

function useAnimatedNumber(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration]);
  return value;
}

function Counter({ target, suffix, label, description }: { target: number; suffix: string; label: string; description: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const number = useAnimatedNumber(target, visible);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: .3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div className="stat-item" ref={ref}>
    <div className="stat-number">{number.toLocaleString('en-IN')}{suffix}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-desc">{description}</div>
  </div>;
}

function IconMark() {
  return <div className="brand-mark" aria-hidden="true"><Cross size={19} strokeWidth={2.6} /></div>;
}

// ==========================================
// MAIN LANDING PAGE (Original Design Kept)
// ==========================================
function Home() {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [slide, setSlide] = useState(0);
  const [toast, setToast] = useState('');
  const [showTop, setShowTop] = useState(false);
  const { language, setLanguage } = useLanguage();
  const searchRef = useRef<HTMLInputElement>(null);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  };

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 550);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) window.setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    const all = [
      { title: 'Universal Health ID', type: 'Pillar · Identity', id: 'ecosystem' },
      { title: 'Healer Connect', type: 'Pillar · Care access', id: 'ecosystem' },
      { title: 'Swasthya Yojana', type: 'Pillar · Schemes', id: 'ecosystem' },
      { title: 'Our design thinking process', type: 'Story · About IHO', id: 'process' },
      { title: 'Project Sanjeevani team', type: 'People · Students of RGUKT Nuzvid', id: 'team' },
    ];
    return query ? all.filter((item) => `${item.title} ${item.type}`.toLowerCase().includes(query)) : all.slice(0, 4);
  }, [search]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <div className="sanjeevani-page noise-layer">
      <style>{`
        .national-masthead{background:linear-gradient(112deg,#071b35 0%,#12385b 52%,#0b2742 100%);color:#fff;position:relative;overflow:hidden;border-bottom:4px solid #d6a84f}
        .national-masthead:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.13),transparent 45%);pointer-events:none}
        .masthead-inner{max-width:1240px;margin:auto;padding:18px 24px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:22px;position:relative;z-index:1}
        .leader-card{display:flex;align-items:center;gap:13px;min-width:0}.leader-card.right{justify-content:flex-end;text-align:right}
        .leader-photo{width:76px;height:86px;object-fit:cover;object-position:top center;border:2px solid rgba(255,255,255,.75);border-radius:7px;box-shadow:0 8px 24px #0005;background:#e8edf2}
        .leader-name{font-size:14px;font-weight:800;line-height:1.35}.leader-title{font-size:11px;color:#d9e7f4;line-height:1.45;margin-top:4px}
        .masthead-emblem{width:74px;height:74px;object-fit:contain;filter:brightness(0) invert(1);opacity:.95}
        .masthead-center{text-align:center;max-width:340px}.masthead-center strong{display:block;font-family:Georgia,serif;font-size:18px;letter-spacing:.04em}.masthead-center span{display:block;font-size:10px;letter-spacing:.17em;text-transform:uppercase;color:#e4c77d;margin-top:7px}
        .prototype-ribbon{background:#fff7df;color:#674b12;text-align:center;padding:7px 12px;font-size:11px;font-weight:800;letter-spacing:.04em;border-bottom:1px solid #ead9a7}
        .pillar-card{isolation:isolate;min-height:290px!important;padding:26px!important;border:1px solid #dce7ed!important;border-radius:22px!important;background:linear-gradient(145deg,#fff 0%,#f7fbfc 100%)!important;box-shadow:0 12px 35px rgba(16,48,72,.07);text-align:left;transition:transform .28s,box-shadow .28s,border-color .28s!important}
        .pillar-card:before{content:"";position:absolute;inset:auto -40px -70px auto;width:190px;height:190px;border-radius:50%;background:var(--pillar-tint);opacity:.12;z-index:-1;transition:transform .35s}
        .pillar-card:hover{transform:translateY(-9px)!important;box-shadow:0 24px 55px rgba(16,48,72,.16)!important;border-color:var(--pillar-color)!important}
        .pillar-card:hover:before{transform:scale(1.3)}.pillar-visual{width:62px;height:62px;border-radius:18px;display:grid;place-items:center;background:var(--pillar-tint);margin:18px 0 17px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--pillar-color) 16%,transparent)}
        .pillar-mini-metrics{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 13px}.pillar-mini-metrics span{font-size:10px;font-weight:800;color:#38566b;background:#edf4f7;border-radius:999px;padding:6px 9px}
        .pillar-progress{height:4px;background:#e8eef1;border-radius:99px;overflow:hidden;margin:15px 0 10px}.pillar-progress i{display:block;height:100%;border-radius:99px;background:var(--pillar-color)}
        .people-grid{align-items:stretch}.person-card{position:relative;overflow:hidden;border:1px solid #dbe6ec!important;border-radius:22px!important;background:linear-gradient(155deg,#fff,#f5f9fc)!important;box-shadow:0 12px 34px rgba(15,43,65,.08);padding:25px!important;transition:transform .25s,box-shadow .25s!important}
        .person-card:hover{transform:translateY(-7px);box-shadow:0 22px 45px rgba(15,43,65,.15)}.person-card:before{content:"";position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#0a66c2,#36a5df,#e5b85c)}
        .person-avatar{width:82px!important;height:82px!important;border-radius:24px!important;background:linear-gradient(135deg,#0d3558,#1679a7)!important;color:white!important;font-size:25px!important;font-weight:900;box-shadow:0 10px 24px #0b41642b;border:4px solid #fff;outline:1px solid #d7e6ee}
        .person-card h3{font-size:17px!important;line-height:1.35}.person-role{font-weight:800}.person-card blockquote{min-height:58px}
        .person-link{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:17px;background:#0a66c2;color:white;padding:11px 14px;border-radius:10px;font-size:12px;font-weight:800;text-decoration:none;transition:background .2s,transform .2s}.person-link:hover{background:#084f96;transform:translateY(-2px)}
        .featured-post{border:1px solid #cbddeb!important;border-radius:22px!important;overflow:hidden;background:white;box-shadow:0 18px 45px rgba(14,50,78,.12)}.featured-post-top{background:linear-gradient(110deg,#092d4c,#0a66c2);color:white;padding:20px 24px;display:flex;align-items:center;justify-content:space-between}.featured-post-body{padding:25px}.post-tag{font-size:10px;letter-spacing:.14em;font-weight:900;text-transform:uppercase;color:#0a66c2}
        .global-access{display:flex;align-items:center;gap:14px;background:linear-gradient(110deg,#eaf4f8,#fff);border:1px solid #d8e8ee;border-radius:16px;padding:16px 20px;margin:0 auto 26px;max-width:1240px;color:#20455d}.global-access strong{font-size:13px}.global-access span{font-size:12px;color:#607988}
        @media(max-width:760px){.masthead-inner{grid-template-columns:1fr 1fr;padding:14px;gap:10px}.masthead-center{grid-column:1/-1;grid-row:1}.leader-photo{width:55px;height:64px}.leader-name{font-size:11px}.leader-title{font-size:9px}.masthead-center strong{font-size:15px}.masthead-emblem{width:50px;height:50px}.leader-card.right{justify-content:flex-end}.global-access{margin:0 14px 20px}.pillar-card{min-height:unset!important}}
      `}</style>
      <div className="national-masthead" aria-label="National leadership reference masthead">
        <div className="masthead-inner">
          <div className="leader-card">
            <img className="leader-photo" src="https://www.pmindia.gov.in/wp-content/uploads/2025/12/02.jpg" alt="Official portrait of Prime Minister Narendra Modi" />
            <div><div className="leader-name">Shri Narendra Modi</div><div className="leader-title">Hon’ble Prime Minister<br/>Government of India</div></div>
          </div>
          <div className="masthead-center">
            <img className="masthead-emblem" src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="" />
            <strong>भारत सरकार · Government of India</strong><span>Ministry of Health & Family Welfare</span>
          </div>
          <div className="leader-card right">
            <div><div className="leader-name">Shri Jagat Prakash Nadda</div><div className="leader-title">Hon’ble Union Minister<br/>Health & Family Welfare</div></div>
            <img className="leader-photo" src="https://static.pib.gov.in/WriteReadData/Gallery/PhotoGallery//2026/Jun/H20260629212102.JPG" alt="Official photograph of Union Health Minister Jagat Prakash Nadda" />
          </div>
        </div>
      </div>
      <div className="prototype-ribbon">{translations[language].prototype}</div>
      <div className="global-access"><Globe2 size={22}/><div><strong>{translations[language].national}</strong><br/><span>{language === 'en' ? 'English and Telugu interface · Responsive access across devices' : 'ఇంగ్లీష్ మరియు తెలుగు ఇంటర్‌ఫేస్ · అన్ని పరికరాల్లో అందుబాటు'}</span></div></div>

      {/* GOVERNMENT TOP BAR (NEW) */}
      <div style={{ background: '#0f172a', color: 'white', padding: '8px 0', fontSize: '12px', borderBottom: '1px solid #334155' }}>
        <div className="container-wide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <Landmark size={14} color="#f59e0b" />
            <span>{translations[language].topBar}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')} 
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe2 size={12} /> {language === 'en' ? 'తెలుగులో చూడండి' : 'View in English'}
            </button>
            <span>Skip to main content</span>
          </div>
        </div>
      </div>

      <div className="topline">
        <div className="container-wide topline-inner">
          <span><strong>PROJECT SANJEEVANI</strong> · A student design-thinking prototype from RGUKT Nuzvid</span>
          <div className="topline-links">
            <button onClick={() => notify('Accessibility preferences are part of the next prototype milestone.')}>Accessibility</button>
            <button onClick={() => notify('The IHO help desk module is coming soon.')}>Help centre</button>
            <span aria-hidden="true">|</span>
            <span>Last updated 08 Aug 2026</span>
          </div>
        </div>
      </div>
      <header className="site-nav">
        <div className="container-wide nav-inner">
          <a href="#top" className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <IconMark />
            <span className="brand-copy"><span className="brand-name">Indian Health Organization</span><span className="brand-sub">Project Sanjeevani · Student-led digital health prototype</span></span>
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#about">About IHO</a>
            <a href="#ecosystem">The ecosystem</a>
            <a href="#process">Our approach</a>
            <a href="#updates">Updates</a>
          </nav>
          <div className="nav-actions">
            <button className="icon-button" aria-label="Open search" onClick={() => setSearchOpen(true)}><Search size={17} /></button>
            <button className="outline-button" onClick={() => setLocation('/health-id')}><LockKeyhole size={14} /> Health ID login</button>
            <button className="emergency-button" onClick={() => setLocation('/sahayata')}><Zap size={14} fill="currentColor" /> Emergency</button>
            <button className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
          </div>
        </div>
        {menuOpen && <nav className="mobile-menu container-wide" aria-label="Mobile navigation">
          <a href="#about" onClick={() => setMenuOpen(false)}>About IHO</a>
          <a href="#ecosystem" onClick={() => setMenuOpen(false)}>The ecosystem</a>
          <a href="#impact" onClick={() => setMenuOpen(false)}>National impact</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>Our approach</a>
          <a href="#team" onClick={() => setMenuOpen(false)}>The student team</a>
          <a href="#updates" onClick={() => setMenuOpen(false)}>News & updates</a>
        </nav>}
      </header>

      <main id="top">
        <section className="hero" aria-label="Project Sanjeevani introduction">
          <div className="container-wide hero-shell">
            <div className="hero-content reveal" key={slide}>
              <div className="hero-kicker">{slides[slide].kicker}</div>
              <h1 className="hero-title">{language === 'en' ? slides[slide].title : translations[language].heroTitle}</h1>
              <p className="hero-copy">{language === 'en' ? slides[slide].copy : translations[language].heroSub}</p>
              <div className="hero-cta">
                <button className="solid-button" onClick={() => setLocation('/health-id')}>{slides[slide].cta} <ArrowRight size={15} /></button>
                <a className="text-link" href="#about">See how it works <ChevronRight size={14} /></a>
              </div>
              <div className="hero-meta">
                <div><strong>1.4B</strong> citizens in mind</div>
                <div><strong>07</strong> connected pillars</div>
                <div><strong>01</strong> shared promise</div>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="visual-orbit">
                <div className="orbit-node node-a"><UserRound size={19} /></div>
                <div className="orbit-node node-b"><ShieldCheck size={19} /></div>
                <div className="orbit-node node-c"><HeartPulse size={19} /></div>
                <div className="health-emblem"><span>+</span></div>
                <div className="visual-label"><strong>01 / 07</strong>one connected ecosystem</div>
              </div>
            </div>
          </div>
          <div className="slide-dot-row" aria-label="Hero slides">
            {slides.map((item, index) => <button key={item.kicker} className={`slide-dot ${index === slide ? 'active' : ''}`} aria-label={`Show slide ${index + 1}`} onClick={() => setSlide(index)} />)}
          </div>
          <div className="slide-controls">
            <button aria-label="Previous slide" onClick={() => setSlide((slide + slides.length - 1) % slides.length)}><ArrowLeft size={16} /></button>
            <button aria-label="Next slide" onClick={() => setSlide((slide + 1) % slides.length)}><ArrowRight size={16} /></button>
          </div>
        </section>

        <section className="trust-strip" aria-label="IHO trust metrics">
          <div className="container-wide trust-grid">
            <div className="trust-item"><Globe2 className="trust-icon" size={21} /><div><strong>1.4B+</strong><span>citizens, one public promise</span></div></div>
            <div className="trust-item"><HeartHandshake className="trust-icon" size={21} /><div><strong>50,000+</strong><span>care points envisioned</span></div></div>
            <div className="trust-item"><ShieldCheck className="trust-icon" size={21} /><div><strong>Consent first</strong><span>privacy is not an afterthought</span></div></div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container-wide intro-layout">
            <div>
              <span className="eyebrow">The idea behind IHO</span>
              <h2 className="section-heading" style={{ marginTop: 22 }}>Health should feel like a <em>right.</em></h2>
              <div className="intro-stamp"><div><HeartPulse size={23} /><br />SANJEEVANI<br />2026</div></div>
            </div>
            <div className="intro-aside">
              <p>In a country of 1.4 billion people, health should not depend on knowing the right person, carrying the right folder, or finding the right scheme at the right moment.</p>
              <p>Project Sanjeevani is our proposal for a unified digital health ecosystem: one secure Health ID, a connected network of care, and a clearer path through the moments that matter.</p>
              <div className="quote-block">“We are not building a clinic website. We are proposing the operating system for India’s health.”</div>
              <div className="note-line"><Sparkles size={18} /><span>A presentation-first prototype by first-year Computer Science students at Rajiv Gandhi University of Knowledge Technologies, Nuzvid — Andhra Pradesh.</span></div>
            </div>
          </div>
        </section>

        {/* PILLARS (Original layout, added a top border line for visual upgrade) */}
        <section className="section services-section" id="ecosystem">
          <div className="container-wide">
            <div className="services-head">
              <div><span className="eyebrow">{translations[language].ecosystem}</span><h2 className="section-heading" style={{ marginTop: 22 }}>{language === 'en' ? <>Seven pillars.<br/><em>One direction.</em></> : <>ఏడు స్తంభాలు.<br/><em>ఒకే లక్ష్యం.</em></>}</h2></div>
              <p className="section-copy">From an elderly woman looking for diabetes medicine to a family in an emergency, IHO brings the next step closer — without asking citizens to become experts in the system.</p>
            </div>
            <div className="pillar-grid">
              {pillars.map(({ icon: PillarIcon, ...pillar }) => (
                <button className="pillar-card" key={pillar.number} onClick={() => setLocation(pillar.path)} style={{ position: 'relative', overflow: 'hidden', ['--pillar-color' as any]: pillar.color, ['--pillar-tint' as any]: `${pillar.color}18` }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: `linear-gradient(90deg,${pillar.color},${pillar.color}55)` }}></div>
                  <span className="pillar-number">{pillar.number} / 07</span>
                  {pillar.status && <span className="future-badge">{pillar.status}</span>}
                  <div className="pillar-visual"><PillarIcon size={29} strokeWidth={1.8} style={{ color: pillar.color }} /></div>
                  <h3>{pillar.title}</h3><p>{pillar.description}</p>
                  <div className="pillar-mini-metrics"><span>{['Secure records','6 care systems','Generic access','24×7 concept','3 scheme paths','District insights','Consent controls'][Number(pillar.number)-1]}</span><span>{['Identity','Care','Medicine','Emergency','Benefits','Analytics','Security'][Number(pillar.number)-1]}</span></div>
                  <div className="pillar-progress"><i style={{ width: `${[88,82,76,70,72,80,91][Number(pillar.number)-1]}%` }} /></div>
                  <span className="pillar-explore" style={{ color: pillar.color }}>{translations[language].explore} <ChevronRight size={13} /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section impact-section" id="impact">
          <div className="container-wide">
            <div className="impact-head"><div><span className="eyebrow">A national scale of care</span><h2 className="section-heading" style={{ marginTop: 22 }}>The promise is<br /><em>measurable.</em></h2></div><p className="section-copy">Illustrative prototype figures only — not live government or patient records. The future platform would show verified, privacy-safe counts with source and update time.</p></div>
            <div className="stat-grid">
              <Counter target={48} suffix=" Cr" label="Active Health IDs" description="A portable identity for a lifetime of care." />
              <Counter target={284} suffix="k" label="Doctors on platform" description="Across systems, specialities and languages." />
              <Counter target={726} suffix=" L" label="Medicines delivered" description="Transparent supply, closer to home." />
              <Counter target={1840} suffix="/day" label="Emergency responses" description="Every minute matters in the golden hour." />
            </div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="container-wide">
            <div className="process-head"><div><span className="eyebrow">Built by listening first</span><h2 className="section-heading" style={{ marginTop: 22 }}>From human need<br />to <em>working prototype.</em></h2></div><p className="section-copy">Design thinking gave our idea a discipline: stay close to real stories, make the problem precise, and keep testing whether the solution feels possible.</p></div>
            <div className="process-list">
              {[
                ['01', 'Empathize', 'We listened to rural patients, urban doctors and health workers.'],
                ['02', 'Define', 'We named the gaps: fragmented access, opaque prices and emergency delays.'],
                ['03', 'Ideate', 'We imagined a unified ecosystem with seven core pillars.'],
                ['04', 'Prototype', 'We built this interactive front door to make the vision tangible.'],
                ['05', 'Test', 'We bring it to citizens, mentors and a jury - and ask what we missed.'],
              ].map(([no, title, copy]) => <article className="process-step" key={no}><span className="step-no">{no}</span><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          </div>
        </section>

        {/* TEAM SECTION (Added LinkedIn buttons) */}
        <section className="section people-section" id="team">
          <div className="container-wide">
            <div className="people-head"><div><span className="eyebrow">The people behind the proposal</span><h2 className="section-heading" style={{ marginTop: 22 }}>Students with<br /><em>a national brief.</em></h2></div><p className="section-copy">First-year Computer Science students from RGUKT Nuzvid, learning in public and building with the seriousness this idea deserves.</p></div>
            <div className="people-grid">
              {team.map((person) => (
                <article className="person-card" key={person.initials}>
                  <div className="person-avatar" aria-label={`${person.name} initials`}>{person.initials}</div>
                  <h3>{person.name}</h3>
                  <div className="person-role">{person.role}</div>
                  <blockquote>“{person.quote}”</blockquote>
                  {person.linkedin && person.linkedin !== '#' ? <a className="person-link" href={person.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16}/> {translations[language].connect} <ExternalLink size={13}/></a> : <span className="person-link" style={{background:'#e8eef2',color:'#526b7b',cursor:'default'}}><Linkedin size={16}/> LinkedIn profile URL to be added</span>}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* UPDATES SECTION (Replaced first card with LinkedIn Post) */}
        <section className="section updates-section" id="updates">
          <div className="container-wide">
            <div className="updates-head"><div><span className="eyebrow">Field notes & updates</span><h2 className="section-heading" style={{ marginTop: 22 }}>A project in<br /><em>motion.</em></h2></div><button className="text-link" style={{ color: 'var(--teal)', border: 0, background: 'none', cursor: 'pointer' }} onClick={() => notify('The full journal is planned for the next release.')}>View all notes <ArrowRight size={14} /></button></div>
            <div className="updates-track">
              
              {/* Featured LinkedIn Post Card */}
              <article className="update-card featured-post">
                <div className="featured-post-top"><span style={{fontWeight:900,letterSpacing:".12em",fontSize:11}}>SANJEEVANI · LINKEDIN SPOTLIGHT</span><Linkedin size={24}/></div>
                <div className="featured-post-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#0A66C2', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured LinkedIn Post</span>
                    <Linkedin size={20} color="#0A66C2" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>Why we built Sanjeevani: From a class to a National Vision</h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
                    "Last week, our team presented Sanjeevani — a unified digital healthcare ecosystem for India... Today, we are taking the next step. We are beginning to build this as a real software application."
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>GV</div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Guvvala Venkata Narayana</p>
                      <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Chief Architect</p>
                    </div>
                  </div>
                  <a href="https://lnkd.in/p/djWWvnis" target="_blank" rel="noopener noreferrer" className="person-link" style={{display:'inline-flex',width:'fit-content'}}> <Linkedin size={15}/> Open LinkedIn post / profile <ExternalLink size={13}/></a>
                </div>
              </article>

              {/* Other Updates */}
              {updates.slice(1).map((update, index) => (
                <article className="update-card" key={update.title}>
                  <div className="update-art" aria-hidden="true" />
                  <div className="update-date">{update.date} · 0{index + 2}</div>
                  <h3>{update.title}</h3>
                  <p>{update.description}</p>
                  <button className="update-link" onClick={() => notify('This story is part of the Sanjeevani presentation archive.')}>Read field note <ArrowRight size={12} /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="quote-section">
          <div className="container-wide quote-panel"><div className="quote-mark">“</div><blockquote className="citizen-quote">With IHO, my mother got her diabetes medicine for ₹50 instead of ₹500. This is what a connected system can change.</blockquote><div className="quote-attribution">— Radha · Rural Telangana · Future citizen story</div></div>
        </section>
        <section className="cta-section">
          <div className="container-wide cta-inner"><div><span className="eyebrow">The next step belongs to all of us</span><h2>Let’s make health easier to find, understand and trust.</h2></div><button className="solid-button" onClick={() => setLocation('/health-id')}>Create Health ID <ArrowRight size={15} /></button></div>
        </section>
      </main>

      <footer className="footer">
        <div className="container-wide footer-grid">
          <div><a href="#top" className="brand"><IconMark /><span className="brand-copy"><span className="brand-name">Indian Health Organization</span><span className="brand-sub">Project Sanjeevani · Digital health ecosystem</span></span></a><p className="footer-description">A student-led proposal for a trusted digital front door to healthcare for every Indian. Built at Rajiv Gandhi University of Knowledge Technologies, Nuzvid.</p></div>
          <div><h3>Navigate</h3><div className="footer-links"><a href="#about">About IHO</a><a href="#ecosystem">The ecosystem</a><a href="#process">Design thinking</a><a href="#team">The team</a></div></div>
          <div><h3>In the wider system</h3><div className="footer-links"><button onClick={() => notify('National Health Portal link will be connected at launch.')}>National Health Portal <ExternalLink size={11} /></button><button onClick={() => notify('Ayushman Bharat link will be connected at launch.')}>Ayushman Bharat <ExternalLink size={11} /></button><button onClick={() => notify('MyGov link will be connected at launch.')}>MyGov <ExternalLink size={11} /></button><button onClick={() => notify('Privacy centre is a future module.')}>Privacy centre <ExternalLink size={11} /></button></div></div>
          <div><h3>Write to the team</h3><div className="contact-line"><MapPin size={14} />RGUKT Nuzvid<br />Eluru district, Andhra Pradesh</div><div className="contact-line"><Mail size={14} />sanjeevani@iho-prototype.in</div><div className="contact-line"><Phone size={14} />National health helpline · 1800-XXX-XXX</div></div>
        </div>
        <div className="container-wide footer-bottom"><span>© 2026 Indian Health Organization · A student design-thinking prototype. Simulated data for demonstration.</span><span className="footer-legal"><a href="#top">Privacy policy</a><a href="#top">Terms of service</a></span></div>
      </footer>

      <div className="container-wide" style={{ paddingBottom: 26, paddingTop: 16, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, color: '#5f7471', fontSize: 11 }}>
        <Globe2 size={14} /><label htmlFor="language-select">Language</label><select id="language-select" value={language} onChange={(event) => { setLanguage(event.target.value as 'en'|'te'); notify(event.target.value === 'te' ? 'తెలుగు భాష ఎంపిక చేయబడింది.' : 'Language set to English.'); }} style={{ background: 'transparent', border: '1px solid var(--line)', padding: '6px 9px', color: 'var(--deep)' }}><option value="en">English</option><option value="te">తెలుగు</option></select>
      </div>

      {showTop && <button className="back-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp size={18} /></button>}
      {searchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search IHO" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}><div className="search-box"><div className="search-input-wrap"><Search size={17} color="var(--teal)" /><input ref={searchRef} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the IHO homepage..." aria-label="Search the IHO homepage" /><button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={16} /></button></div><div className="search-results">{filteredResults.length > 0 ? filteredResults.map((result) => <button className="search-result" key={result.title} onClick={() => goTo(result.id)}><span><strong>{result.title}</strong><span>{result.type}</span></span><ArrowRight size={15} color="var(--teal)" /></button>) : <div style={{ padding: 20, color: '#687b79', fontSize: 12 }}>No matching IHO stories yet. Try “Health ID” or “team”.</div>}</div></div></div>}
      {toast && <div className="toast-note" role="status">{toast}</div>}
    </div>
  );
}

// ==========================================
// SUB-PAGES (Fully Functional)
// ==========================================

function PageWrapper({ title, subtitle, children, icon: Icon }: { title: string, subtitle: string, children: ReactNode, icon: IconType }) {
  const [, setLocation] = useLocation();
  const { language, setLanguage } = useLanguage();
  const teTitles: Record<string, string> = {
    'Universal Health ID': 'సార్వత్రిక ఆరోగ్య ఐడి', 'Healer Connect': 'వైద్యుల అనుసంధానం', 'Dawa Ghar': 'దవా ఘర్',
    'Sahayata': 'సహాయత', 'Swasthya Yojana': 'ఆరోగ్య పథకాలు', 'Bharat Health Pulse': 'భారత్ ఆరోగ్య పల్స్', 'Suraksha Kavach': 'సురక్షా కవచ్'
  };
  const teSubtitles: Record<string, string> = {
    'Aadhaar-linked secure medical identity': 'సురక్షితమైన డిజిటల్ ఆరోగ్య గుర్తింపు',
    'Find the right doctor across all systems of medicine': 'వివిధ వైద్య విధానాల్లో సరైన వైద్యుడిని కనుగొనండి',
    'Transparent medicine supply and home delivery': 'పారదర్శక ఔషధ సరఫరా మరియు ఇంటి వద్దకే డెలివరీ',
    'One-tap emergency response system': 'ఒక ట్యాప్‌తో అత్యవసర సహాయం',
    'Government schemes and insurance hub': 'ప్రభుత్వ ఆరోగ్య పథకాలు మరియు బీమా సమాచారం',
    'National health data and analytics dashboard': 'ఆరోగ్య డేటా మరియు విశ్లేషణ డ్యాష్‌బోర్డ్',
    'Cybersecurity and data governance': 'సైబర్ భద్రత మరియు డేటా నిర్వహణ'
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <header className="bg-blue-950 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setLocation('/')} className="flex items-center gap-2 font-bold text-xl tracking-widest hover:text-teal-300 transition">
            <Cross className="text-teal-400 w-6 h-6" /> SANJEEVANI
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setLanguage(language === 'en' ? 'te' : 'en')} className="text-xs font-bold border border-white/25 px-3 py-2 rounded-lg hover:bg-white/10">{language === 'en' ? 'తెలుగు' : 'English'}</button>
            <button onClick={() => setLocation('/')} className="text-sm font-semibold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition">
              <ArrowLeft size={16} /> {language === 'te' ? 'డ్యాష్‌బోర్డ్‌కు తిరిగి' : 'Back to Dashboard'}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
        <div className="flex items-center gap-4 mb-8 border-b pb-6">
          <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
            <Icon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{language === 'te' ? (teTitles[title] || title) : title}</h1>
            <p className="text-slate-500 mt-1 font-medium">{language === 'te' ? (teSubtitles[subtitle] || subtitle) : subtitle}</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

function HealthID() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <PageWrapper title="Universal Health ID" subtitle="Aadhaar-linked secure medical identity" icon={User}>
      {isLoggedIn ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <ShieldCheck className="absolute -right-4 -bottom-4 w-40 h-40 text-blue-700 opacity-30" />
            <p className="text-blue-300 text-sm font-bold tracking-widest mb-2">SANJEEVANI HEALTH ID</p>
            <h3 className="text-3xl font-black mb-8">Rukmini Devi</h3>
            <div className="space-y-4 text-sm font-medium bg-black/20 p-4 rounded-xl">
              <p className="flex justify-between border-b border-blue-700/50 pb-2"><span className="text-blue-300">Health ID:</span> 29-1234-5678-9012</p>
              <p className="flex justify-between border-b border-blue-700/50 pb-2"><span className="text-blue-300">Blood Group:</span> B+</p>
              <p className="flex justify-between"><span className="text-blue-300">Allergies:</span> Penicillin, Dust</p>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="mt-8 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg font-bold text-sm transition">Log Out</button>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg"><Activity size={20} className="text-blue-500"/> Recent Medical Records</h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-300 transition cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-slate-800">Blood Test</p>
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">Jul 15, 2026</span>
                </div>
                <p className="text-sm text-slate-500">HbA1c: 7.2%, Fasting Glucose: 130 mg/dL</p>
                <p className="text-xs text-slate-400 mt-2">By Dr. Rao, General Medicine</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-300 transition cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-slate-800">Prescription</p>
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">Jun 02, 2026</span>
                </div>
                <p className="text-sm text-slate-500">Metformin 500mg (1-0-1), Amlodipine 5mg (0-0-1)</p>
                <p className="text-xs text-slate-400 mt-2">By Dr. Reddy, Diabetologist</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-slate-200 text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600"><LockKeyhole size={36} /></div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Secure Access</h2>
          <p className="text-sm text-slate-500 mb-8">Enter Aadhaar to generate Health ID</p>
          <input type="text" placeholder="XXXX XXXX XXXX" className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-center tracking-[0.2em] font-mono text-lg mb-4" />
          <button onClick={() => setIsLoggedIn(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/30">Generate OTP & Login</button>
        </div>
      )}
    </PageWrapper>
  );
}

function HealerConnect() {
  const doctors = [
    { name: 'Dr. Anitha Rao', spec: 'Diabetologist', sys: 'Allopathy', lang: 'Telugu, English', fee: '₹300', exp: '12 Yrs', rating: '4.8' },
    { name: 'Dr. Ramesh Varma', spec: 'Ayurvedic Ortho', sys: 'Ayurveda', lang: 'Telugu, Hindi', fee: '₹200', exp: '18 Yrs', rating: '4.9' },
    { name: 'Dr. K. Srinivas', spec: 'General Physician', sys: 'Allopathy', lang: 'Telugu', fee: '₹250', exp: '8 Yrs', rating: '4.6' },
    { name: 'Dr. Fatima Begum', spec: 'Gynecologist', sys: 'Allopathy', lang: 'Urdu, Hindi, English', fee: '₹400', exp: '15 Yrs', rating: '4.7' },
    { name: 'Dr. Yogi Adityanath', spec: 'Yoga Therapist', sys: 'Yoga', lang: 'Hindi, English', fee: '₹150', exp: '10 Yrs', rating: '4.5' },
    { name: 'Dr. S. Patel', spec: 'Homeopathy', sys: 'Homeopathy', lang: 'Gujarati, Hindi', fee: '₹200', exp: '20 Yrs', rating: '4.8' },
  ];
  return (
    <PageWrapper title="Healer Connect" subtitle="Find the right doctor across all systems of medicine" icon={Stethoscope}>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input type="text" placeholder="Search by symptom, specialty or name..." className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition" />
        </div>
        <select className="px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 font-semibold text-slate-700 outline-none">
          <option>All Systems</option><option>Allopathy</option><option>Ayurveda</option><option>Yoga</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center"><Stethoscope size={28} /></div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>
            </div>
            <h3 className="font-bold text-xl text-slate-900">{doc.name}</h3>
            <p className="text-sm text-teal-600 font-bold mb-4">{doc.spec} • {doc.sys}</p>
            
            <div className="flex gap-4 mb-4 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg">
              <span className="flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500"/> {doc.rating}</span>
              <span className="flex items-center gap-1"><Clock3 size={14} className="text-blue-500"/> {doc.exp}</span>
            </div>

            <div className="text-sm text-slate-500 space-y-2 mb-6">
              <p className="flex items-center gap-2"><MapPin size={16} className="text-slate-400"/> Ongole, Andhra Pradesh</p>
              <p className="flex items-center gap-2"><Globe2 size={16} className="text-slate-400"/> {doc.lang}</p>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-black text-slate-800 text-lg">{doc.fee} <span className="text-xs font-normal text-slate-400">/ visit</span></span>
              <button className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-700 transition shadow-md shadow-teal-500/20">Book</button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function DawaGhar() {
  return (
    <PageWrapper title="Dawa Ghar" subtitle="Transparent medicine supply and home delivery" icon={Pill}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-dashed border-blue-300 text-center bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer">
            <UploadCloud size={48} className="mx-auto text-blue-500 mb-4" />
            <h3 className="font-bold text-xl text-slate-800">Upload Prescription</h3>
            <p className="text-sm text-slate-500 mt-2">Upload a photo or PDF from Dr. Anitha Rao.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Prescription: RX-2026-0001</h3>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Verified by Doctor</span>
            </div>
            <div className="p-6 space-y-4">
              {[
                { name: 'Metformin 500mg', dose: 'Twice daily • 30 days', brand: 180, gen: 60 },
                { name: 'Amlodipine 5mg', dose: 'Once daily • 30 days', brand: 150, gen: 45 }
              ].map((med, i) => (
                <div key={i} className="flex justify-between items-center p-5 border border-slate-200 rounded-2xl hover:border-blue-400 transition">
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">{med.name}</h4>
                    <p className="text-sm text-slate-500">{med.dose}</p>
                  </div>
                  <div className="text-right bg-green-50 p-3 rounded-xl border border-green-100">
                    <p className="text-xs text-slate-400 line-through">Brand: ₹{med.brand}</p>
                    <p className="font-bold text-green-600 text-lg">Generic: ₹{med.gen}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200 h-fit">
          <h3 className="font-bold text-lg mb-4 text-slate-900">Order Summary</h3>
          <div className="space-y-3 text-sm mb-6 border-b pb-4">
            <p className="flex justify-between"><span className="text-slate-500">Item Total</span> <span className="font-bold">₹105.00</span></p>
            <p className="flex justify-between"><span className="text-slate-500">Delivery Fee</span> <span className="font-bold">₹20.00</span></p>
            <p className="flex justify-between text-green-600"><span>Generic Savings</span> <span className="font-bold">- ₹225.00</span></p>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-slate-800">To Pay</span>
            <span className="font-black text-2xl text-slate-900">₹125.00</span>
          </div>
          <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/30 mb-3">Place Order</button>
          <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1"><ShieldCheck size={14}/> 100% Genuine Medicines</p>
        </div>
      </div>
    </PageWrapper>
  );
}

function Sahayata() {
  const [triggered, setTriggered] = useState(false);
  return (
    <PageWrapper title="Sahayata" subtitle="One-tap emergency response system" icon={Siren}>
      {!triggered ? (
        <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-100">
          <h2 className="text-3xl font-black text-red-600 mb-4">Emergency Response</h2>
          <p className="text-slate-600 mb-10 max-w-md mx-auto">Press the button to instantly alert the nearest hospital, ambulance, and your family members.</p>
          <button onClick={() => setTriggered(true)} className="w-64 h-64 bg-red-600 hover:bg-red-700 text-white rounded-full flex flex-col items-center justify-center shadow-2xl shadow-red-500/60 animate-pulse border-8 border-white transition mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500 animate-ping opacity-20"></div>
            <Siren size={72} className="mb-4" />
            <span className="font-black text-3xl tracking-widest leading-none">PRESS<br/>FOR HELP</span>
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white border-2 border-red-500 rounded-3xl p-8 shadow-2xl shadow-red-500/20">
          <div className="flex items-center gap-4 mb-8 border-b border-red-100 pb-6">
            <div className="bg-red-600 text-white p-4 rounded-full animate-ping absolute"></div>
            <div className="bg-red-600 text-white p-4 rounded-full relative"><AlertTriangle size={36} /></div>
            <div>
              <h2 className="text-3xl font-black text-red-700">EMERGENCY ACTIVE</h2>
              <p className="text-red-600 font-bold">Help is on the way. Do not close this screen.</p>
            </div>
          </div>
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><CheckCircle2 className="text-green-500" /><p className="font-bold text-slate-700">Location Sent</p></div>
              <span className="text-sm text-slate-500">NH-16, Ongole</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><CheckCircle2 className="text-green-500" /><p className="font-bold text-slate-700">Ambulance Dispatched</p></div>
              <span className="text-sm text-green-600 font-bold bg-green-100 px-2 py-1 rounded">ETA 12 Mins</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><CheckCircle2 className="text-green-500" /><p className="font-bold text-slate-700">Family Notified</p></div>
              <span className="text-sm text-slate-500">Suresh (Son) - SMS</span>
            </div>
          </div>
          <button onClick={() => setTriggered(false)} className="mt-8 w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">Cancel Alert (False Alarm)</button>
        </div>
      )}
    </PageWrapper>
  );
}

function SwasthyaYojana() {
  return (
    <PageWrapper title="Swasthya Yojana" subtitle="Government schemes and insurance hub" icon={Award}>
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-8 rounded-3xl shadow-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Eligibility Check Complete</h3>
          <p className="text-indigo-200 text-sm">Based on your profile (Income: ₹60k, AP), you qualify for 3 schemes.</p>
        </div>
        <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition whitespace-nowrap">Update Profile</button>
      </div>
      
      <div className="space-y-4">
        {[
          { title: 'Ayushman Bharat (PM-JAY)', desc: 'Cashless treatment up to ₹5 lakh per family per year.', cover: '₹5 Lakhs', tag: 'National' },
          { title: 'Dr. YSR Aarogyasri', desc: 'Cashless treatment for listed diseases for AP residents.', cover: '₹25 Lakhs', tag: 'State' },
          { title: 'Pradhan Mantri Suraksha Bima Yojana', desc: 'Accidental death and disability insurance cover.', cover: '₹2 Lakhs', tag: 'Insurance' }
        ].map((scheme, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-indigo-300 transition">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-bold text-xl text-slate-900">{scheme.title}</h4>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">{scheme.tag}</span>
              </div>
              <p className="text-slate-500 text-sm">{scheme.desc}</p>
            </div>
            <div className="text-center bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-[120px]">
              <p className="text-xs text-slate-500 mb-1">Coverage</p>
              <p className="font-black text-indigo-600 text-lg">{scheme.cover}</p>
            </div>
            <button className="bg-indigo-50 text-indigo-700 font-bold px-4 py-2 rounded-lg hover:bg-indigo-100 transition">Apply Now</button>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function BharatHealthPulse() {
  return (
    <PageWrapper title="Bharat Health Pulse" subtitle="National health data and analytics dashboard" icon={BarChart3}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Cases', val: '12,450', trend: '+12%', color: 'text-red-500' },
          { label: 'Recovered', val: '10,200', trend: '+8%', color: 'text-green-500' },
          { label: 'Vaccination', val: '85%', trend: '+2%', color: 'text-blue-500' },
          { label: 'Alerts', val: '3 Districts', trend: 'High', color: 'text-amber-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase mb-2">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.val}</h3>
            <p className={`text-xs font-bold ${stat.color}`}>{stat.trend}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2"><Activity size={20} className="text-purple-500"/> Regional Outbreak Heatmap</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-bold text-slate-700">Prakasam</span>
              <div className="flex-grow bg-slate-100 rounded-full h-4 overflow-hidden"><div className="bg-red-500 h-full w-[85%]"></div></div>
              <span className="text-sm font-bold text-red-500">85%</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-bold text-slate-700">Guntur</span>
              <div className="flex-grow bg-slate-100 rounded-full h-4 overflow-hidden"><div className="bg-amber-400 h-full w-[45%]"></div></div>
              <span className="text-sm font-bold text-amber-500">45%</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-bold text-slate-700">Nellore</span>
              <div className="flex-grow bg-slate-100 rounded-full h-4 overflow-hidden"><div className="bg-green-500 h-full w-[20%]"></div></div>
              <span className="text-sm font-bold text-green-500">20%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900 to-slate-900 p-6 rounded-3xl shadow-lg text-white">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck size={20} className="text-teal-400"/> Data Privacy Layer</h3>
          <p className="text-sm text-slate-300 mb-6">All data shown on this dashboard is fully aggregated and anonymized. No individual Health ID is traceable.</p>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <p className="text-xs font-bold text-teal-300 mb-1">Differential Privacy Enabled</p>
            <p className="text-xs text-slate-400">Statistical noise added to prevent re-identification attacks.</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function SurakshaKavach() {
  return (
    <PageWrapper title="Suraksha Kavach" subtitle="Cybersecurity and data governance" icon={ShieldCheck}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Data Encryption', desc: 'Data is locked with AES-256 encryption at rest and TLS 1.3 in transit.', icon: Lock, color: 'bg-blue-100 text-blue-600' },
          { title: 'Role-Based Access', desc: 'Doctors see only what they need. Admins see only anonymized counts.', icon: User, color: 'bg-indigo-100 text-indigo-600' },
          { title: 'Consent Management', desc: 'You control who sees your data and can revoke access instantly.', icon: CheckCircle2, color: 'bg-teal-100 text-teal-600' },
          { title: 'Tamper-Proof Audit', desc: 'Every access event is recorded on a cryptographic ledger.', icon: FileText, color: 'bg-purple-100 text-purple-600' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-5 hover:shadow-md transition">
            <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center shrink-0`}><item.icon size={28} /></div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xl mb-2">System Security Score</h3>
          <p className="text-slate-400 text-sm">Continuous monitoring and threat intelligence active.</p>
        </div>
        <div className="text-4xl font-black text-green-400 border-4 border-green-500/30 rounded-full p-4 w-24 h-24 flex items-center justify-center">A+</div>
      </div>
    </PageWrapper>
  );
}

// ==========================================
// ROUTER & APP
// ==========================================

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/health-id" component={HealthID} />
        <Route path="/healer-connect" component={HealerConnect} />
        <Route path="/dawa-ghar" component={DawaGhar} />
        <Route path="/sahayata" component={Sahayata} />
        <Route path="/swasthya-yojana" component={SwasthyaYojana} />
        <Route path="/bharat-health-pulse" component={BharatHealthPulse} />
        <Route path="/suraksha-kavach" component={SurakshaKavach} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    return window.localStorage.getItem('sanjeevani-language') === 'te' ? 'te' : 'en';
  });
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    if (typeof window !== 'undefined') window.localStorage.setItem('sanjeevani-language', next);
  };
  useEffect(() => { document.documentElement.lang = language === 'te' ? 'te' : 'en'; }, [language]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageContext.Provider>
  );
}
export default App;