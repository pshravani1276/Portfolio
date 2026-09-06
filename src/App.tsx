import { FormEvent, KeyboardEvent, useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import profileImg from './assets/profile.jpeg'

type Section = [string, string, string]

const sections: Section[] = [
  ['01', 'ABOUT', 'about'],
  ['02', 'STACK', 'stack'],
  ['03', 'WORK', 'work'],
  ['04', 'EXPERIENCE', 'experience'],
  ['05', 'JOURNEY', 'journey'],
  ['06', 'CONTACT', 'contact'],
]

const skills: Record<string, string[]> = {
  DEVELOPMENT: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'SQL'],
  FRONTEND: ['HTML', 'CSS', 'JavaScript', 'React'],
  DATABASE: ['Oracle', 'MySQL', 'Firebase'],
  SECURITY: ['OWASP ZAP', 'Splunk'],
  TOOLS: ['Tableau', 'Visual Studio', 'Android Studio', 'Git', 'GitHub'],
}

type ProjectProps = {
  number: string
  title: string
  visual: string
  subtitle: string
  description: string
  tags: string[]
  details: string
  highlights?: string[]
}

type ViewMode = 'terminal' | 'portfolio' | 'module'
type FormState = 'idle' | 'loading' | 'success' | 'error'

const emailjsConfig = {
  publicKey: 'l-eLFEvgtiToE-xwT',
  serviceId: 'service_t13nzd1',
  templateId: 'template_ppd4wze',
}

const projects: ProjectProps[] = [
  { number: '01', title: 'AlgoTrace', visual: 'ALGOTRACE', subtitle: 'Interactive Algorithm Visualizer & DSA Learning Platform.', description: 'An interactive DSA learning platform that turns complex algorithms into visual, step-by-step experiences. Built to help students understand how algorithms execute through visual tracing, execution steps, and complexity insights.', details: 'Built an interactive algorithm visualization experience that allows users to follow algorithm execution step by step instead of simply reading code.', tags: ['REACT', 'TYPESCRIPT', 'ALGORITHMS', 'VISUALIZATION'], highlights: ['Algorithm visualization', 'Step-by-step execution', 'DSA learning', 'Time & space complexity', 'Interactive controls', 'Developer-focused UI'] },
  { number: '02', title: 'Scan My Food', visual: 'SCAN MY FOOD', subtitle: 'Android application for a practical food discovery experience.', description: 'A smart Android food discovery experience built to make finding food faster and more engaging. Designed an intuitive mobile experience where users can explore food options through a clean, practical interface.', details: 'Built an Android application focused on creating a simple and engaging food discovery experience with intuitive navigation and practical user interactions.', tags: ['ANDROID', 'MOBILE APP', 'UI/UX'] },
  { number: '03', title: 'SELLMATE-AI', visual: 'SELLMATE AI', subtitle: 'AI Growth & Agentic Automation Platform.', description: 'An AI-powered growth platform combining intelligent automation with agentic AI to help businesses work smarter. Built AI-driven workflows that transform repetitive business tasks into actionable processes.', details: 'Built an AI-driven platform focused on intelligent business automation, growth workflows, and agentic systems that assist with repetitive and decision-oriented tasks.', tags: ['AI', 'AGENTIC AI', 'AUTOMATION', 'FULL STACK'], highlights: ['AI-powered workflows', 'Agentic automation', 'Business growth', 'Intelligent task execution', 'Full-stack development'] },
  { number: '04', title: 'CyberSentinel', visual: 'CYBERSENTINEL', subtitle: 'Behavioral Ransomware Early Detection System.', description: 'A behavioral ransomware early-detection system designed to identify suspicious activity before major damage occurs. Contributed to behavioral monitoring, threat detection, risk scoring, and explainable alerts.', details: 'Contributed to a cybersecurity system that uses behavioral signals to identify suspicious ransomware-like activity and generate explainable risk alerts.', tags: ['CYBERSECURITY', 'MACHINE LEARNING', 'PYTHON', 'THREAT DETECTION'], highlights: ['Behavioral monitoring', 'Ransomware detection', 'Machine learning', 'Risk scoring', 'Explainable alerts', 'Security analytics'] },
  { number: '05', title: 'ClipMind-AI', visual: 'CLIPMIND-AI', subtitle: 'AI-powered productivity and digital content assistant.', description: 'An AI-powered productivity project developed during the Infosys SpringBoard internship. Focused on using AI to organize and understand digital content, creating a smarter way to interact with information.', details: 'Developed an AI-focused productivity experience that explores smarter ways to organize, process, and interact with digital content. Developed during Infosys SpringBoard AI Internship.', tags: ['ARTIFICIAL INTELLIGENCE', 'AI TOOLS', 'PRODUCTIVITY', 'INTERNSHIP'] },
  { number: '06', title: 'MediBridge', visual: 'MEDIBRIDGE', subtitle: 'Technology-driven healthcare accessibility platform.', description: 'A healthcare-focused digital platform designed to bridge the gap between people and accessible medical services. Focused on creating a simple technology-driven experience for connecting users with healthcare information and essential services.', details: 'Designed a technology-driven healthcare experience focused on making essential medical information and services easier for users to access.', tags: ['HEALTHCARE TECH', 'SOFTWARE DEVELOPMENT', 'WEB', 'USER EXPERIENCE'] },
  { number: '07', title: 'Café Management System', visual: 'CAFÉ / SYSTEM', subtitle: 'Digital management solution for streamlined café operations.', description: 'A practical management solution developed during the internship at iGAP Technology to streamline café operations. Worked on products, orders, customers, and day-to-day operations through a structured digital workflow.', details: 'Worked on a Café Management System during the internship at iGAP Technology, contributing to functionality for products, orders, customers, and day-to-day café operations. Developed during internship at iGAP Technology.', tags: ['SOFTWARE DEVELOPMENT', 'DATABASE', 'MANAGEMENT SYSTEM', 'INTERNSHIP'] },
]

const activityCells = Array.from({ length: 70 }, (_, index) => (index * 7 + 3) % 5)

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [command, setCommand] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [roleIndex, setRoleIndex] = useState(0)
  const [activeProject, setActiveProject] = useState<ProjectProps | null>(null)
  const [shellInput, setShellInput] = useState('')
  const [shellHistory, setShellHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [viewMode, setViewMode] = useState<ViewMode>('terminal')
  const [activeModule, setActiveModule] = useState('')
  const roles = ['Developer', 'Cybersecurity Enthusiast', 'AI Project Builder']

  useEffect(() => {
    emailjs.init({ publicKey: emailjsConfig.publicKey })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
      document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.88) {
          element.classList.add('visible')
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setRoleIndex((index) => (index + 1) % roles.length), 2600)
    return () => window.clearInterval(timer)
  }, [roles.length])

  const navigate = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    window.history.pushState({}, '', `#${id}`)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  const enterPortfolio = () => {
    setViewMode('portfolio')
    setActiveModule('')
    window.history.pushState({}, '', '#portfolio')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const returnToTerminal = () => {
    setViewMode('terminal')
    setActiveModule('')
    window.history.pushState({}, '', '#home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openModule = (id: string) => {
    setViewMode('module')
    setActiveModule(id)
    setMenuOpen(false)
    window.history.pushState({}, '', `#${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const runCommand = (value: string) => {
    setCommand(value)
    if (['about', 'stack', 'work', 'experience', 'contact'].includes(value)) navigate(value)
  }

  const executeShellCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = shellInput.trim().toLowerCase()
    if (!value) return
    setShellHistory((history) => [...history, value])
    setShellInput('')
    setHistoryIndex(-1)
    if (value === 'clear') {
      setShellHistory([])
      return
    }
    if (value === 'help') return
    if (value === 'whoami') return
    if (value === 'resume') {
      window.open('/resume.pdf', '_blank', 'noopener,noreferrer')
      return
    }
    const moduleAliases: Record<string, string> = {
      about: 'about',
      stack: 'stack',
      skills: 'stack',
      projects: 'work',
      work: 'work',
      experience: 'experience',
      journey: 'journey',
      education: 'journey',
      achievements: 'achievements',
      contact: 'contact',
    }
    if (moduleAliases[value]) {
      setViewMode('module')
      setActiveModule(moduleAliases[value])
      window.history.pushState({}, '', `#${moduleAliases[value]}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const navigateShellHistory = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()

    if (shellHistory.length === 0) return

    if (event.key === 'ArrowDown' && (historyIndex === shellHistory.length - 1 || historyIndex === -1)) {
      setHistoryIndex(-1)
      setShellInput('')
      return
    }

    const nextIndex = event.key === 'ArrowUp'
      ? Math.max(historyIndex === -1 ? shellHistory.length - 1 : historyIndex - 1, 0)
      : historyIndex + 1

    setHistoryIndex(nextIndex)
    setShellInput(shellHistory[nextIndex])
  }

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')
    const messageBody = String(formData.get('message') ?? '')
    setFormState('loading')
    setMessage('Sending message...')

    emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
      name,
      email,
      message: messageBody,
      reply_to: email,
      time: new Date().toLocaleString(),
    })
      .then(() => {
        setFormState('success')
        setMessage('Message sent successfully.')
        form.reset()
      })
      .catch((error: { text?: string; status?: number }) => {
        setFormState('error')
        const reason = error.status ? `EmailJS ${error.status}` : error.text ?? 'EmailJS request failed'
        setMessage(`${reason}. Use the email link below while EmailJS is configured.`)
      })
  }

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className="navbar">
        <button className="logo" onClick={returnToTerminal}>SHRAVANI<span>.OS</span></button>
        <button className="menu-button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}</button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {sections.map(([number, label, id]) => <button key={id} onClick={() => openModule(id)}>{number} {label}</button>)}
        </nav>
      </header>

      <main>
        {viewMode === 'terminal' && <section id="home" className="shell-landing" aria-labelledby="shell-title">
          <div className="shell-intro">
            <p className="shell-kicker">PORTFOLIO TERMINAL / 2026.09</p>
            <h1 id="shell-title">shravani<span>@portfolio</span>:~$</h1>
            <p>Welcome to Shravani&apos;s digital workspace.</p>
          </div>
          <div className="command-window">
            <div className="command-window-bar"><span /><span /><span /><b>shravani@portfolio:~</b></div>
            <div className="command-output" aria-live="polite">
              <p><i>last login:</i> today · kolhapur, india</p>
              <p><strong>SHRAVANI.OS</strong> — developer / cybersecurity / software</p>
              <p className="command-muted">type <b>help</b> to see available commands</p>
              {shellHistory.map((item, index) => <div key={`${item}-${index}`} className="history-line"><span>shravani@portfolio:~$</span> {item}<small>{item === 'help' ? 'about  stack  skills  projects  experience  journey  education  achievements  contact  resume  clear' : item === 'whoami' ? 'Computer Science & Business Systems · Developer · Cybersecurity Enthusiast' : item === 'clear' ? '' : `opening ${item}...`}</small></div>)}
              <form className="shell-form" onSubmit={executeShellCommand}>
                <label htmlFor="shell-command">shravani@portfolio:~$</label>
                <input id="shell-command" autoComplete="off" value={shellInput} onChange={(event) => { setShellInput(event.target.value); setHistoryIndex(-1) }} onKeyDown={navigateShellHistory} aria-label="Portfolio command" autoFocus />
                <span className="shell-cursor" />
              </form>
            </div>
          </div>
          <div className="shell-shortcuts"><button onClick={() => { setShellInput('help'); document.getElementById('shell-command')?.focus() }}>HELP</button><button onClick={enterPortfolio}>ENTER PORTFOLIO ↗</button><span>↑↓ history · enter execute</span></div>
        </section>}

        {viewMode === 'module' && <button className="terminal-back" onClick={returnToTerminal}>← BACK TO TERMINAL</button>}
        <div className={viewMode === 'terminal' ? 'terminal-mode' : viewMode === 'module' ? `module-mode module-${activeModule}` : ''}>
        {viewMode !== 'terminal' && <section id="identity" className="hero">
          <div className="hero-content reveal">
            <p className="eyebrow">SYSTEM ONLINE <span className="status-dot" /></p>
            <h1>SHRAVANI<em>PATIL</em></h1>
            <p className="hero-role">Computer Science × Software × Cybersecurity</p>
            <p className="typing-line"><span>&gt; </span>{roles[roleIndex]}</p>
            <p className="hero-description">I build practical software experiences, explore intelligent systems, and keep security in the room from the start.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => navigate('work')}>VIEW MY WORK ↗</button>
              <a className="button" href="/resume.pdf" download>DOWNLOAD RÉSUMÉ ↓</a>
            </div>
            <p className="availability"><span className="status-dot" /> AVAILABLE FOR INTERNSHIPS</p>
          </div>
          <div className="portrait-card reveal">
            <img src={profileImg} alt="Portrait of Shravani Patil" />
            <div className="portrait-caption"><b>SHRAVANI PATIL</b><span>CSBS / DEVELOPER / SECURITY</span></div>
          </div>
        </section>}

        {viewMode === 'portfolio' && <section className="terminal-section reveal" aria-label="Shravani operating system">
          <div className="terminal">
            <div className="terminal-bar"><i /><i /><i /><span>SHRAVANI.OS v1.0.0</span></div>
            <div className="terminal-body">
              <p><b>$</b> whoami</p><strong>Computer Science &amp; Business Systems</strong><strong>Developer · Cybersecurity Enthusiast</strong>
              <p><b>$</b> currently_learning</p><strong>React / Backend / Cybersecurity / AI</strong>
              <p><b>$</b> help</p>
              <div className="terminal-commands">{['about', 'stack', 'work', 'experience', 'contact'].map((item) => <button key={item} onClick={() => runCommand(item)}>{item}</button>)}</div>
              {command && <small>command executed: {command}</small>}
            </div>
          </div>
        </section>}

        <section id="about" className="section reveal"><p className="section-label">01 — WHO I AM</p><div className="two-column"><h2>I DON&apos;T JUST LEARN<em> TECHNOLOGIES.</em><br />I BUILD WITH THEM.</h2><div><p className="lead">Computer Science &amp; Business Systems undergraduate with a strong foundation in programming, web development, and cybersecurity. I build real-world projects and internship-based applications with a focus on secure, scalable software.</p><div className="facts"><div><small>CURRENTLY</small><b>B.Tech CSBS · CGPA 9.0</b></div><div><small>FOCUS</small><b>Cybersecurity · Web · Mobile</b></div><div><small>BASED IN</small><b>Kolhapur, India</b></div></div></div></div></section>

        <section id="stack" className="section reveal"><p className="section-label">02 — TECHNICAL CAPABILITY</p><h2 className="display-heading">THE STACK<em> IN CONTEXT.</em></h2><div className="skills-grid">{Object.entries(skills).map(([category, items]) => <article key={category}><small>{category}</small><p>{items.join(' · ')}</p></article>)}</div></section>

        <section id="work" className="section reveal"><p className="section-label">03 — SELECTED WORK</p><h2 className="display-heading">PROJECTS THAT<em> PROVE THE WORK.</em></h2><div className="projects">{projects.map((project) => <Project key={project.number} {...project} onOpen={setActiveProject} />)}</div></section>

        <section id="experience" className="section reveal"><p className="section-label">04 — EXPERIENCE</p><div className="timeline"><article><small>01 / 45 DAYS</small><div><h3>Web Development Intern</h3><p>iGAP Technology Pvt. Ltd., Kolhapur · Café Management Project</p></div></article><article><small>02 / 30 DAYS</small><div><h3>Cybersecurity Intern</h3><p>FutureIntern</p></div></article><article><small>03 / 60 DAYS</small><div><h3>AI Intern</h3><p>Infosys SpringBoard · ClipMind-AI</p></div></article></div></section>

        <section id="journey" className="section reveal"><p className="section-label">05 — JOURNEY</p><div className="timeline"><article><small>2025 — 2028</small><div><h3>B.Tech — Computer Science &amp; Business Systems</h3><p>KIT&apos;s College of Engineering, Kolhapur · CGPA 9.0</p></div></article><article><small>2022 — 2025</small><div><h3>Diploma — Computer Science &amp; Engineering</h3><p>Sanjay Ghodawat Institute, Atigre · 89.77%</p></div></article></div><div className="metrics"><div><b>70/70</b><small>Digital Techniques</small></div><div><b>89.77%</b><small>Diploma result</small></div><div><b>45 DAYS</b><small>Web development internship</small></div></div></section>

        <section id="achievements" className="section reveal"><p className="section-label">PROOF OF WORK</p><h2 className="display-heading">SIGNALS OF <em>PROGRESS.</em></h2><div className="achievement-grid"><article><b>Nimbus 2k25</b><span>Volunteer</span></article><article><b>IJSREM</b><span>Research paper</span></article><article><b>DATA SCIENCE</b><span>Infosys SpringBoard</span></article><article><b>PYTHON FOR DATA ANALYSIS</b><span>Udemy</span></article><article><b>PROMPT ENGINEERING</b><span>Infosys SpringBoard</span></article><article><b>MONGODB</b><span>Udemy</span></article></div></section>

        <section id="contact" className="section contact reveal"><p className="section-label">06 — CONTACT</p><h2>HAVE AN IDEA?<em> LET&apos;S BUILD IT.</em></h2><p className="lead">Open to internships, collaborations, and interesting software problems.</p><a className="github-activity" href="https://github.com/pshravani1276" target="_blank" rel="noreferrer" aria-label="Open Shravani Patil's GitHub profile"><strong>@pshravani1276</strong><div className="activity-grid" aria-hidden="true">{activityCells.map((level, index) => <span key={index} className={`activity-cell level-${level}`} />)}</div><span className="activity-link">OPEN GITHUB ↗</span></a><div className="contact-layout"><div className="contact-links"><a href="mailto:pshravani1276@gmail.com">EMAIL ↗</a><a href="https://github.com/pshravani1276" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="tel:9405238893">9405238893 ↗</a></div><form onSubmit={submitForm}><input name="name" placeholder="YOUR NAME" required /><input name="email" type="email" placeholder="YOUR EMAIL" required /><textarea name="message" placeholder="YOUR MESSAGE" required /><button className="button primary" type="submit" disabled={formState === 'loading'}>{formState === 'loading' ? 'SENDING...' : 'SEND MESSAGE ↗'}</button><small className={`form-status ${formState}`} role="status">{message}</small>{formState === 'error' && <a className="form-fallback" href="mailto:pshravani1276@gmail.com">EMAIL DIRECTLY ↗</a>}</form></div></section>
        </div>
      </main>
      <footer><b>SHRAVANI PATIL</b><span>BUILDING · LEARNING · SECURING</span><small>© 2026</small></footer>
      {activeProject && <div className="modal-backdrop" role="presentation" onClick={() => setActiveProject(null)}><section className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close project details" onClick={() => setActiveProject(null)}>×</button><small>PROJECT / {activeProject.number}</small><h2 id="case-title">{activeProject.title}</h2><p className="case-subtitle">{activeProject.subtitle}</p><div className="case-divider" /><div className="case-detail"><b>WHAT I BUILT</b><span>{activeProject.details}</span></div>{activeProject.highlights && <div className="case-highlights"><b>FOCUS</b><ul>{activeProject.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>}<div className="tags">{activeProject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section></div>}
    </>
  )
}

function Project({ number, title, visual, subtitle, description, tags, details, highlights, onOpen }: ProjectProps & { onOpen: (project: ProjectProps) => void }) {
  const project = { number, title, visual, subtitle, description, tags, details, highlights }
  return <article className="project"><button className="project-visual" onClick={() => onOpen(project)} aria-label={`Open ${title} case study`}><span>PROJECT / {number}</span><strong>{visual}</strong><i>↗</i></button><div className="project-content"><small>PROJECT / {number}</small><h3>{title}</h3><p className="project-subtitle">{project.subtitle}</p><p>{description}</p><div className="tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="text-link" onClick={() => onOpen(project)}>VIEW CASE STUDY ↗</button></div></article>
}

export default App