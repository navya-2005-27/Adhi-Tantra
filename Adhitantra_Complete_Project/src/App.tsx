
import RegistrationForm from './components/RegistrationForm';
import { Sparkles } from 'lucide-react';

function App() {
  return (
    <div className="app-container">
      {/* Decorative Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Absolute Top Banner */}
      <div style={{ width: '100%', background: 'linear-gradient(90deg, rgba(99,102,241,0.2), rgba(236,72,153,0.3), rgba(99,102,241,0.2))', padding: '15px 0', textAlign: 'center', borderBottom: '1px solid rgba(236,72,153,0.4)', boxShadow: '0 4px 30px rgba(236,72,153,0.3)' }}>
        <p className="anim-pop-blink" style={{ color: '#fff', fontWeight: 900, letterSpacing: '5px', textTransform: 'uppercase', fontSize: '1.5rem', margin: 0, textShadow: '0px 0px 10px rgba(236,72,153,1)' }}>
          🚀 HARDWARE PROJECTS 🚀
        </p>
      </div>

      <header style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'var(--bg-glass)', padding: '8px 24px', borderRadius: '100px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
          <Sparkles size={20} color="var(--accent-tertiary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Hackathon Registration Open
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, marginBottom: '12px' }}>
          Welcome to <span className="text-gradient">Adhi Tantra</span>
        </h1>
        <div style={{ marginBottom: '24px' }}>
          <div className="dept-badge">
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>
              Org. by Dep of CSE, <strong className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 800, marginLeft: '6px' }}>BGSIT</strong>
            </span>
          </div>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Join the ultimate arena of innovation. Register your team below and be part of solving real-world challenges.
        </p>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px 60px' }}>
        <div style={{ width: '100%', maxWidth: '800px' }} className="glass-panel">
          <div style={{ padding: '40px' }}>
            <RegistrationForm />
          </div>
        </div>
      </main>

      <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem', background: 'var(--bg-secondary)', marginTop: '20px' }}>
        <div style={{ marginBottom: '20px', lineHeight: '1.8' }}>
          <p>
            <strong>Tel:</strong> 08234287285 <span style={{ margin: '0 8px', color: 'var(--glass-border-focus)' }}>|</span>
            <strong>Email:</strong> info@acu.edu.in, registrar@acu.edu.in <span style={{ margin: '0 8px', color: 'var(--glass-border-focus)' }}>|</span>
            <a href="http://www.acu.edu.in" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>www.acu.edu.in</a>
          </p>
          <p>
            <strong>BGSIT:</strong> +91 98459 73725, +91 98459 73725 <span style={{ margin: '0 8px', color: 'var(--glass-border-focus)' }}>|</span>
            <strong>Email:</strong> bgsit@acu.edu.in <span style={{ margin: '0 8px', color: 'var(--glass-border-focus)' }}>|</span>
            <a href="http://www.bgsit.ac.in" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>www.bgsit.ac.in</a>
          </p>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} Adhi Tantra Hackathon. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default App;
