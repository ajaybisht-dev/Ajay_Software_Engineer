import { useEffect, useState } from "react";
import {
  ArrowRight, ArrowUpRight, BrainCircuit, CheckCircle2, Code2,
  Download, Github, Linkedin, Mail, Menu, X
} from "lucide-react";
import { getPortfolio } from "./api/portfolioApi";
import Chatbot from "./components/Chatbot";
import "./styles.css";

type Portfolio = {
  profile: {
    name: string; role: string; headline: string; about: string;
    email: string; linkedin: string; github: string;
  };
  stats: { label: string; value: string }[];
  skills: string[];
  experience: { period: string; role: string; company: string; description: string }[];
  projects: {
    id: number;
    title: string;
    category: string;
    description: string;
    contributions: string[];
    technologies: string[];
    links?: {
      googlePlay?: string;
      appStore?: string;
    };
  }[];
};

export default function App() {
  const [data, setData] = useState<Portfolio | null>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    getPortfolio().then(setData).catch(console.error);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  const downloadResume = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/resume`
      );

      if (!response.ok) {
        throw new Error(`Resume API failed: ${response.status}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "Ajay-Bisht-Resume.pdf";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Resume download error:", error);
      alert("Unable to download resume");
    }
  };

  if (!data) return <div className="loading">Loading portfolio…</div>;

  const p = data.profile;

  return (
    <>
      <header>
        <div className="nav">
          <button className="logo" onClick={() => go("home")}>AJAY SINGH BISHT<span>.</span></button>
          <nav className={menu ? "show" : ""}>
            {["about", "skills", "experience", "projects", "contact"].map(x =>
              <button key={x} onClick={() => go(x)}>{x}</button>
            )}
          </nav>
          <button className="menu" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div>
            <small>● {p.role.toUpperCase()}</small>
            <h1>Building<br /><b>Digital</b><br />Experiences.</h1>
            <h3>{p.headline}</h3>
            <p>{p.about}</p>
            <div className="actions">
              <button onClick={() => go("projects")}>
                Explore Work <ArrowRight />
              </button>

              <a href={`mailto:${p.email}`}>
                Contact Me <Mail />
              </a>

              <button onClick={downloadResume}>
                Download Resume <Download />
              </button>
            </div>
            <div className="social">
              <a href={p.github} target="_blank"><Github /> GitHub</a>
              <a href={p.linkedin} target="_blank"><Linkedin /> LinkedIn</a>
            </div>
          </div>

          <div className="visual">
            <div className="code">
              <div>● ● ● <span>ajay.ts</span></div>
              <pre>{`const developer = {
  name: "${p.name}",
  role: "SDE 2",
  mobile: "React Native",
  backend: "Python / Node.js",
  ai: "GenAI / RAG"
};`}</pre>
            </div>
            <div className="float one"><BrainCircuit /> GenAI<small>RAG • LLM • Tool Calling</small></div>
            <div className="float two"><Code2 /> Mobile<small>React Native • Android • iOS</small></div>
          </div>
        </section>

        <div className="stats">
          {data.stats.map(s => <b key={s.label}>{s.value}<small>{s.label}</small></b>)}
        </div>

        <section id="about" className="section">
          <div className="label">01 / ABOUT</div>
          <h2>Engineer by <span>craft.</span></h2>
          <div className="about">
            <p>{p.about}</p>
            <div className="checks">
              <span><CheckCircle2 /> Production Mobile Apps</span>
              <span><CheckCircle2 /> Full-Stack Development</span>
              <span><CheckCircle2 /> GenAI / RAG</span>
              <span><CheckCircle2 /> CI/CD & Cloud</span>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="label">02 / SKILLS</div>
          <h2>Technical <span>arsenal.</span></h2>
          <div className="skills">{data.skills.map(s => <span key={s}>{s}</span>)}</div>
        </section>

        <section id="experience" className="section">
          <div className="label">03 / EXPERIENCE</div>
          <h2>Experience that<br /><span>ships.</span></h2>
          <div className="timeline">
            {data.experience.map(e => (
              <article className="exp" key={`${e.company}-${e.role}`}>
                <small>{e.period}</small>
                <h3>{e.role} — {e.company}</h3>
                <p>{e.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section">
          <div className="label">04 / PROJECTS</div>
          <h2>Selected <span>work.</span></h2>
          <div className="projects">
            {data.projects.map((project) => (
              <article key={project.id} className="project-card">
                <small>
                  {String(project.id).padStart(2, "0")} • {project.category}
                </small>

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <ul>
                  {project.contributions.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>

                <div className="tags">
                  {project.technologies.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>

                {project.links && (
                  <div
                    className="project-links"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.links.googlePlay && (
                      <a
                        href={project.links.googlePlay}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Google Play
                        <ArrowUpRight size={16} />
                      </a>
                    )}

                    {project.links.appStore && (
                      <a
                        href={project.links.appStore}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        App Store
                        <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="label">05 / CONTACT</div>
          <h2>Let's build<br /><span>something great.</span></h2>
          <p>Have an opportunity or an interesting engineering problem?</p>
          <a href={`mailto:${p.email}`}>Start a conversation <ArrowUpRight /></a>
        </section>
      </main>

      <footer>© {new Date().getFullYear()} {p.name} • React Native • Full Stack • GenAI</footer>
      <Chatbot />
    </>
  );
}
