import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
  Stethoscope, Target, UserRound, UsersRound, X, Zap,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type IconType = typeof HeartPulse;

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

const pillars: { title: string; description: string; icon: IconType; number: string; status?: string }[] = [
  { number: '01', title: 'Universal Health ID', description: 'One private, portable identity for records, allergies, blood group and care history.', icon: KeyRound },
  { number: '02', title: 'Healer Connect', description: 'A trusted directory for allopathy, Ayurveda, Yoga, Unani, Siddha and Homeopathy.', icon: Stethoscope },
  { number: '03', title: 'Dawa Ghar', description: 'A transparent route from prescription to genuine, affordable medicines at home.', icon: Pill },
  { number: '04', title: 'Sahayata', description: 'Rapid emergency alerts to hospitals, ambulances and the people who matter.', icon: Zap },
  { number: '05', title: 'Swasthya Yojana', description: 'Government health schemes explained simply, with eligibility made visible.', icon: Award },
  { number: '06', title: 'Bharat Health Pulse', description: 'Privacy-protected signals that help the nation see and respond to health trends.', icon: BarChart3, status: 'Coming soon' },
  { number: '07', title: 'Suraksha Kavach', description: 'Encryption, consent and governance that put citizens in control of their health data.', icon: ShieldCheck },
];

const quickServices = [
  { label: 'Book an appointment', icon: Stethoscope },
  { label: 'Order medicines', icon: Pill },
  { label: 'Check scheme eligibility', icon: Award },
  { label: 'Find a blood bank', icon: HeartPulse },
  { label: 'Download health records', icon: Download },
];

const team = [
  { initials: 'GV', name: 'Guvvala Venkata Narayana', role: 'Chief Architect · Integration', quote: 'We are not doctors. We are architects of the bridge.' },
  { initials: 'AS', name: 'Aaradhya S.', role: 'Empathy & Experience Lead', quote: 'Trust begins when a system feels understandable.' },
  { initials: 'PK', name: 'Pavani K.', role: 'Data & Logic Lead', quote: 'Good information should travel as far as need does.' },
  { initials: 'NR', name: 'Nandini R.', role: 'Systems & Integration', quote: 'The golden hour is a design problem we can solve.' },
  { initials: 'SH', name: 'Sahithi H.', role: 'Innovation & Future Tech', quote: 'A prototype can be a promise with working edges.' },
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
  return <div className="stat-item" ref={ref} data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`}>
    <div className="stat-number">{number.toLocaleString('en-IN')}{suffix}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-desc">{description}</div>
  </div>;
}

function IconMark() {
  return <div className="brand-mark" aria-hidden="true"><Cross size={19} strokeWidth={2.6} /></div>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [slide, setSlide] = useState(0);
  const [toast, setToast] = useState('');
  const [showTop, setShowTop] = useState(false);
  const [language, setLanguage] = useState('English');
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

  return <div className="sanjeevani-page noise-layer">
    <div className="topline">
      <div className="container-wide topline-inner">
        <span><strong>PROJECT SANJEEVANI</strong> · A student design-thinking prototype from RGUKT Nuzvid</span>
        <div className="topline-links">
          <button onClick={() => notify('Accessibility preferences are part of the next prototype milestone.')} data-testid="button-accessibility">Accessibility</button>
          <button onClick={() => notify('The IHO help desk module is coming soon.')} data-testid="button-help">Help centre</button>
          <span aria-hidden="true">|</span>
          <span>Last updated 08 Aug 2026</span>
        </div>
      </div>
    </div>
    <header className="site-nav">
      <div className="container-wide nav-inner">
        <a href="#top" className="brand" data-testid="link-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <IconMark />
          <span className="brand-copy"><span className="brand-name">Indian Health Organization</span><span className="brand-sub">Ministry of Health & Family Welfare · Government of India</span></span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#about" data-testid="link-about">About IHO</a>
          <a href="#ecosystem" data-testid="link-services">The ecosystem</a>
          <a href="#process" data-testid="link-process">Our approach</a>
          <a href="#updates" data-testid="link-updates">Updates</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-button" aria-label="Open search" onClick={() => setSearchOpen(true)} data-testid="button-search"><Search size={17} /></button>
          <button className="outline-button" onClick={() => notify('Health ID sign-in is a future module in this prototype.')} data-testid="button-health-id-login"><LockKeyhole size={14} /> Health ID login</button>
          <button className="emergency-button" onClick={() => notify('Sahayata emergency response module is ready for the next build.')} data-testid="button-emergency"><Zap size={14} fill="currentColor" /> Emergency</button>
          <button className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} data-testid="button-mobile-menu">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-menu container-wide" aria-label="Mobile navigation">
        <a href="#about" onClick={() => setMenuOpen(false)} data-testid="mobile-link-about">About IHO</a>
        <a href="#ecosystem" onClick={() => setMenuOpen(false)} data-testid="mobile-link-ecosystem">The ecosystem</a>
        <a href="#impact" onClick={() => setMenuOpen(false)} data-testid="mobile-link-impact">National impact</a>
        <a href="#process" onClick={() => setMenuOpen(false)} data-testid="mobile-link-process">Our approach</a>
        <a href="#team" onClick={() => setMenuOpen(false)} data-testid="mobile-link-team">The student team</a>
        <a href="#updates" onClick={() => setMenuOpen(false)} data-testid="mobile-link-updates">News & updates</a>
      </nav>}
    </header>

    <main id="top">
      <section className="hero" aria-label="Project Sanjeevani introduction">
        <div className="container-wide hero-shell">
          <div className="hero-content reveal" key={slide}>
            <div className="hero-kicker">{slides[slide].kicker}</div>
            <h1 className="hero-title">{slides[slide].title}</h1>
            <p className="hero-copy">{slides[slide].copy}</p>
            <div className="hero-cta">
              <button className="solid-button" onClick={() => notify('Health ID creation will open in the next prototype module.')} data-testid="button-hero-cta">{slides[slide].cta} <ArrowRight size={15} /></button>
              <a className="text-link" href="#about" data-testid="link-hero-learn">See how it works <ChevronRight size={14} /></a>
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
          {slides.map((item, index) => <button key={item.kicker} className={`slide-dot ${index === slide ? 'active' : ''}`} aria-label={`Show slide ${index + 1}`} onClick={() => setSlide(index)} data-testid={`button-slide-${index + 1}`} />)}
        </div>
        <div className="slide-controls">
          <button aria-label="Previous slide" onClick={() => setSlide((slide + slides.length - 1) % slides.length)} data-testid="button-slide-prev"><ArrowLeft size={16} /></button>
          <button aria-label="Next slide" onClick={() => setSlide((slide + 1) % slides.length)} data-testid="button-slide-next"><ArrowRight size={16} /></button>
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

      <section className="section services-section" id="ecosystem">
        <div className="container-wide">
          <div className="services-head">
            <div><span className="eyebrow">One connected ecosystem</span><h2 className="section-heading" style={{ marginTop: 22 }}>Seven pillars.<br /><em>One direction.</em></h2></div>
            <p className="section-copy">From an elderly woman looking for diabetes medicine to a family in an emergency, IHO brings the next step closer — without asking citizens to become experts in the system.</p>
          </div>
          <div className="pillar-grid">
            {pillars.map(({ icon: PillarIcon, ...pillar }) => <button className="pillar-card" key={pillar.number} onClick={() => notify(`${pillar.title} is mapped as a future module. This homepage is the connected front door.`)} data-testid={`button-pillar-${pillar.number}`}>
              <span className="pillar-number">{pillar.number} / 07</span>{pillar.status && <span className="future-badge">{pillar.status}</span>}
              <PillarIcon className="pillar-icon" size={25} strokeWidth={1.8} />
              <h3>{pillar.title}</h3><p>{pillar.description}</p><span className="pillar-explore">Explore concept <ChevronRight size={13} /></span>
            </button>)}
          </div>
        </div>
      </section>

      <section className="section impact-section" id="impact">
        <div className="container-wide">
          <div className="impact-head"><div><span className="eyebrow">A national scale of care</span><h2 className="section-heading" style={{ marginTop: 22 }}>The promise is<br /><em>measurable.</em></h2></div><p className="section-copy">These are prototype direction markers — the outcomes we want a future IHO to make visible, accountable and human.</p></div>
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
              ['05', 'Test', 'We bring it to citizens, mentors and a jury — and ask what we missed.'],
            ].map(([no, title, copy]) => <article className="process-step" key={no}><span className="step-no">{no}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section people-section" id="team">
        <div className="container-wide">
          <div className="people-head"><div><span className="eyebrow">The people behind the proposal</span><h2 className="section-heading" style={{ marginTop: 22 }}>Students with<br /><em>a national brief.</em></h2></div><p className="section-copy">First-year Computer Science students from RGUKT Nuzvid, learning in public and building with the seriousness this idea deserves.</p></div>
          <div className="people-grid">
            {team.map((person) => <article className="person-card" key={person.initials}><div className="person-avatar" aria-label={`${person.name} initials`}>{person.initials}</div><h3>{person.name}</h3><div className="person-role">{person.role}</div><blockquote>“{person.quote}”</blockquote></article>)}
          </div>
        </div>
      </section>

      <section className="section updates-section" id="updates">
        <div className="container-wide">
          <div className="updates-head"><div><span className="eyebrow">Field notes & updates</span><h2 className="section-heading" style={{ marginTop: 22 }}>A project in<br /><em>motion.</em></h2></div><button className="text-link" style={{ color: 'var(--teal)', border: 0, background: 'none', cursor: 'pointer' }} onClick={() => notify('The full journal is planned for the next release.')} data-testid="button-all-updates">View all notes <ArrowRight size={14} /></button></div>
          <div className="updates-track">
            {updates.map((update, index) => <article className="update-card" key={update.title}><div className="update-art" aria-hidden="true" /><div className="update-date">{update.date} · 0{index + 1}</div><h3>{update.title}</h3><p>{update.description}</p><button className="update-link" onClick={() => notify('This story is part of the Sanjeevani presentation archive.')} data-testid={`button-read-update-${index + 1}`}>Read field note <ArrowRight size={12} /></button></article>)}
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="container-wide quote-panel"><div className="quote-mark">“</div><blockquote className="citizen-quote">With IHO, my mother got her diabetes medicine for ₹50 instead of ₹500. This is what a connected system can change.</blockquote><div className="quote-attribution">— Radha · Rural Telangana · Future citizen story</div></div>
      </section>
      <section className="cta-section">
        <div className="container-wide cta-inner"><div><span className="eyebrow">The next step belongs to all of us</span><h2>Let’s make health easier to find, understand and trust.</h2></div><button className="solid-button" onClick={() => notify('Thank you for believing in the idea. Citizen feedback opens in the next build.')} data-testid="button-create-health-id">Create Health ID <ArrowRight size={15} /></button></div>
      </section>
    </main>

    <footer className="footer">
      <div className="container-wide footer-grid">
        <div><a href="#top" className="brand" data-testid="link-footer-brand"><IconMark /><span className="brand-copy"><span className="brand-name">Indian Health Organization</span><span className="brand-sub">Project Sanjeevani · Digital health ecosystem</span></span></a><p className="footer-description">A student-led proposal for a trusted digital front door to healthcare for every Indian. Built at Rajiv Gandhi University of Knowledge Technologies, Nuzvid.</p></div>
        <div><h3>Navigate</h3><div className="footer-links"><a href="#about" data-testid="footer-link-about">About IHO</a><a href="#ecosystem" data-testid="footer-link-ecosystem">The ecosystem</a><a href="#process" data-testid="footer-link-process">Design thinking</a><a href="#team" data-testid="footer-link-team">The team</a></div></div>
        <div><h3>In the wider system</h3><div className="footer-links"><button onClick={() => notify('National Health Portal link will be connected at launch.')} data-testid="footer-link-nhp">National Health Portal <ExternalLink size={11} /></button><button onClick={() => notify('Ayushman Bharat link will be connected at launch.')} data-testid="footer-link-ab">Ayushman Bharat <ExternalLink size={11} /></button><button onClick={() => notify('MyGov link will be connected at launch.')} data-testid="footer-link-mygov">MyGov <ExternalLink size={11} /></button><button onClick={() => notify('Privacy centre is a future module.')} data-testid="footer-link-privacy">Privacy centre <ExternalLink size={11} /></button></div></div>
        <div><h3>Write to the team</h3><div className="contact-line"><MapPin size={14} />RGUKT Nuzvid<br />Eluru district, Andhra Pradesh</div><div className="contact-line"><Mail size={14} />sanjeevani@iho-prototype.in</div><div className="contact-line"><Phone size={14} />National health helpline · 1800-XXX-XXX</div></div>
      </div>
      <div className="container-wide footer-bottom"><span>© 2026 Indian Health Organization · A student design-thinking prototype. Simulated data for demonstration.</span><span className="footer-legal"><a href="#top" data-testid="footer-link-privacy-policy">Privacy policy</a><a href="#top" data-testid="footer-link-terms">Terms of service</a></span></div>
    </footer>

    <div className="container-wide" style={{ paddingBottom: 26, paddingTop: 16, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, color: '#5f7471', fontSize: 11 }}>
      <Globe2 size={14} /><label htmlFor="language-select">Language</label><select id="language-select" value={language} onChange={(event) => { setLanguage(event.target.value); notify(`Language preference set to ${event.target.value}. Full translations are planned.`); }} style={{ background: 'transparent', border: '1px solid var(--line)', padding: '6px 9px', color: 'var(--deep)' }} data-testid="select-language"><option>English</option><option>हिन्दी</option><option>తెలుగు</option><option>தமிழ்</option><option>বাংলা</option></select>
    </div>

    {showTop && <button className="back-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-testid="button-back-to-top"><ArrowUp size={18} /></button>}
    {searchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search IHO" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}><div className="search-box"><div className="search-input-wrap"><Search size={17} color="var(--teal)" /><input ref={searchRef} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the IHO homepage..." aria-label="Search the IHO homepage" data-testid="input-search" /><button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search" data-testid="button-close-search"><X size={16} /></button></div><div className="search-results">{filteredResults.length > 0 ? filteredResults.map((result) => <button className="search-result" key={result.title} onClick={() => goTo(result.id)} data-testid={`search-result-${result.title.toLowerCase().replaceAll(' ', '-')}`}><span><strong>{result.title}</strong><span>{result.type}</span></span><ArrowRight size={15} color="var(--teal)" /></button>) : <div style={{ padding: 20, color: '#687b79', fontSize: 12 }}>No matching IHO stories yet. Try “Health ID” or “team”.</div>}</div></div></div>}
    {toast && <div className="toast-note" role="status" data-testid="status-toast">{toast}</div>}
  </div>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;