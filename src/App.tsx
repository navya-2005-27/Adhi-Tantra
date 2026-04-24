
import { useEffect, useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import { Moon, Sun, Users, User, CalendarDays, MapPin, Timer } from 'lucide-react';
import './App.css';

type CountdownParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const getCountdownParts = (distanceMs: number): CountdownParts => {
  const safeDistance = Math.max(0, distanceMs);
  const days = Math.floor(safeDistance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((safeDistance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((safeDistance % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
};

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [now, setNow] = useState(new Date());

  const currentYear = new Date().getFullYear();
  const registrationStart = new Date(`${currentYear}-04-25T00:00:00+05:30`);
  const registrationEnd = new Date(`${currentYear}-05-05T23:59:59+05:30`);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isBeforeStart = now < registrationStart;
  const isRegistrationOpen = now >= registrationStart && now <= registrationEnd;
  const targetDate = isBeforeStart ? registrationStart : registrationEnd;
  const countdown = getCountdownParts(targetDate.getTime() - now.getTime());

  const regProgress = isRegistrationOpen
    ? Math.min(
        100,
        Math.max(
          0,
          ((now.getTime() - registrationStart.getTime()) /
            (registrationEnd.getTime() - registrationStart.getTime())) * 100,
        ),
      )
    : isBeforeStart
      ? 0
      : 100;

  return (
    <div className="app-container">
      <div className="top-strip">
        <p>Hardware Hackathon</p>
      </div>

      <header className="site-header">
        <div className="header-row">
          <div className="status-pill" aria-label="Registration status">
            Registration Open
          </div>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle color theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>

        <h1 className="hero-title">
          Welcome to <span className="text-gradient">Adhi Tantra</span>
        </h1>

        <div className="hero-subtitle-wrap">
          <div className="dept-badge">
            <span>
              Organized by Department of CSE,
              <strong className="text-gradient"> BGSIT</strong>
            </span>
          </div>
        </div>

        <p className="hero-copy">
          Join the ultimate arena of innovation. Register your team below and be part of solving real-world challenges.
        </p>

        <section className="countdown-section" aria-live="polite">
          <div className="countdown-headline">
            <Timer size={18} />
            <span>
              {isBeforeStart && 'Registration opens in'}
              {isRegistrationOpen && 'Registration closes in'}
              {!isBeforeStart && !isRegistrationOpen && 'Registration window has closed'}
            </span>
          </div>

          <div className="countdown-grid">
            <div className="time-tile">
              <strong>{countdown.days}</strong>
              <span>Days</span>
            </div>
            <div className="time-tile">
              <strong>{countdown.hours}</strong>
              <span>Hours</span>
            </div>
            <div className="time-tile">
              <strong>{countdown.minutes}</strong>
              <span>Minutes</span>
            </div>
            <div className="time-tile">
              <strong>{countdown.seconds}</strong>
              <span>Seconds</span>
            </div>
          </div>

          <div className="countdown-progress" role="presentation">
            <div className="countdown-progress-value" style={{ width: `${regProgress}%` }}></div>
          </div>

          <div className="event-meta-grid">
            <div className="event-meta-chip">
              <CalendarDays size={16} />
              <span>Registration: 25 April to 5 May</span>
            </div>
            <div className="event-meta-chip">
              <CalendarDays size={16} />
              <span>Hackathon: 7 April</span>
            </div>
            <div className="event-meta-chip">
              <MapPin size={16} />
              <span>Venue: BGSIT</span>
            </div>
          </div>
        </section>
      </header>

      <main className="main-content">
        <div className="registration-shell glass-panel spaced-panel">
          <div className="registration-inner">
            <RegistrationForm />
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-title-wrap">
            <h2 className="footer-title">
              <span className="text-gradient">Contact</span>
            </h2>
          </div>

          <div className="coordinator-grid">
            <div className="coordinator-card">
              <div className="coordinator-icon-wrap">
                <Users size={24} color="var(--accent-primary)" />
              </div>
              <h4 className="coordinator-title">Student Coordinators</h4>
              <div className="coordinator-block">
                <div className="coordinator-person">
                  <p className="coordinator-name">Kavya GS</p>
                  <p className="coordinator-phone">+91 9900969105</p>
                </div>
                <div>
                  <p className="coordinator-name">Navyashree SD</p>
                  <p className="coordinator-phone">+91 9972594105</p>
                </div>
              </div>
            </div>

            <div className="coordinator-card">
              <div className="coordinator-icon-wrap">
                <User size={24} color="var(--accent-primary)" />
              </div>
              <h4 className="coordinator-title">Staff Coordinators</h4>
              <div className="coordinator-block">
                <div className="coordinator-person">
                  <p className="coordinator-name">Mrs. Arpitha K</p>
                  <p className="coordinator-phone">+91 9880958203</p>
                </div>
                <div>
                  <p className="coordinator-name">Mr. Santhosh BJ</p>
                  <p className="coordinator-phone">+91 9036156311</p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-copy">
            &copy; {new Date().getFullYear()} Adhi Tantra Hackathon. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
