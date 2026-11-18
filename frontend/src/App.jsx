import { useState } from "react";

import AegiraLogo from "./components/AegiraLogo";
import SOSButton from "./components/SOSButton";
import VoiceAssistant from "./components/VoiceAssistant";
import QuickExit from "./components/QuickExit";

import TrustedContacts from "./pages/TrustedContacts";
import SafetyCheckIn from "./pages/SafetyCheckIn";
import IncidentReport from "./pages/IncidentReport";
import SupportDirectory from "./pages/SupportDirectory";

import "./styles/global.css";

function App() {
  const [page, setPage] = useState("home");

  const goTo = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      {/* ================= HEADER ================= */}

      <header className="topbar">
        <div
          className="brand"
          onClick={() => goTo("home")}
        >
          <AegiraLogo />
        </div>

        <div className="header-actions">
          <div className="safety-indicator">
            <span className="status-dot" />
            AEGIRA Ready
          </div>

          <QuickExit />
        </div>
      </header>

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <button
          className={page === "home" ? "nav-active" : ""}
          onClick={() => goTo("home")}
        >
          Home
        </button>

        <button
          className={page === "checkin" ? "nav-active" : ""}
          onClick={() => goTo("checkin")}
        >
          Safety Check-In
        </button>

        <button
          className={page === "contacts" ? "nav-active" : ""}
          onClick={() => goTo("contacts")}
        >
          Trusted Circle
        </button>

        <button
          className={page === "report" ? "nav-active" : ""}
          onClick={() => goTo("report")}
        >
          Private Report
        </button>

        <button
          className={page === "support" ? "nav-active" : ""}
          onClick={() => goTo("support")}
        >
          Find Support
        </button>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="main-content">
        {page === "home" && (
          <>
            <section className="hero-section">
              <div className="hero-text">
                <div className="hero-kicker">
                  <span className="hero-kicker-dot" />
                  Safety technology designed around you
                </div>

                <h1>
                  Feel safer.
                  <br />

                  <span>
                    Stay connected.
                  </span>
                </h1>

                <p className="hero-description">
                  AEGIRA combines emergency assistance,
                  trusted contacts, smart safety check-ins,
                  private incident documentation and
                  support discovery in one privacy-first
                  platform.
                </p>

                <div className="hero-mini-features">
                  <div>
                    <span>✓</span>
                    Privacy-first
                  </div>

                  <div>
                    <span>✓</span>
                    Location aware
                  </div>

                  <div>
                    <span>✓</span>
                    Voice enabled
                  </div>
                </div>
              </div>

              {/* SOS CARD */}

              <div className="hero-sos-card">
                <div className="sos-card-glow" />

                <div className="emergency-label">
                  <span className="emergency-dot" />
                  EMERGENCY ASSISTANCE
                </div>

                <h2>
                  Need immediate help?
                </h2>

                <p>
                  Activate SOS to capture your current
                  location and prepare an emergency alert
                  for your trusted circle.
                </p>

                <SOSButton />

                <div className="sos-trust-note">
                  <span>🔒</span>

                  <span>
                    Your location is only used when you
                    activate the safety flow.
                  </span>
                </div>

                <small>
                  AEGIRA assists with safety actions but does
                  not replace official emergency services.
                </small>
              </div>
            </section>

            {/* ================= QUICK ACTIONS ================= */}

            <section className="section-heading">
              <div>
                <span className="section-eyebrow">
                  SAFETY TOOLS
                </span>

                <h2>
                  Everything you need,
                  <br />
                  within reach.
                </h2>
              </div>

              <p>
                Designed for quick access when every second
                matters.
              </p>
            </section>

            <section className="quick-actions">
              <div
                className="action-card"
                onClick={() => goTo("checkin")}
              >
                <div className="action-card-top">
                  <div className="action-icon">
                    ⏱
                  </div>

                  <span className="action-number">
                    01
                  </span>
                </div>

                <h3>
                  Safety Check-In
                </h3>

                <p>
                  Start a travel timer and trigger the
                  emergency flow automatically if you miss
                  your check-in.
                </p>

                <span className="action-link">
                  Start Check-In
                  <strong>→</strong>
                </span>
              </div>

              <div
                className="action-card"
                onClick={() => goTo("contacts")}
              >
                <div className="action-card-top">
                  <div className="action-icon">
                    👥
                  </div>

                  <span className="action-number">
                    02
                  </span>
                </div>

                <h3>
                  Trusted Circle
                </h3>

                <p>
                  Keep the people you trust ready for
                  emergency alerts and safety check-ins.
                </p>

                <span className="action-link">
                  Manage Contacts
                  <strong>→</strong>
                </span>
              </div>

              <div
                className="action-card"
                onClick={() => goTo("report")}
              >
                <div className="action-card-top">
                  <div className="action-icon">
                    ✦
                  </div>

                  <span className="action-number">
                    03
                  </span>
                </div>

                <h3>
                  Private Report
                </h3>

                <p>
                  Organize an incident description into a
                  structured and editable private record.
                </p>

                <span className="action-link">
                  Create Report
                  <strong>→</strong>
                </span>
              </div>

              <div
                className="action-card"
                onClick={() => goTo("support")}
              >
                <div className="action-card-top">
                  <div className="action-icon">
                    ♡
                  </div>

                  <span className="action-number">
                    04
                  </span>
                </div>

                <h3>
                  Find Support
                </h3>

                <p>
                  Explore counseling, medical, legal,
                  shelter and other support resources.
                </p>

                <span className="action-link">
                  Explore Support
                  <strong>→</strong>
                </span>
              </div>
            </section>

            {/* ================= PRIVACY ================= */}

            <section className="privacy-feature">
              <div className="privacy-feature-icon">
                <span>⌾</span>
              </div>

              <div>
                <span className="section-eyebrow">
                  PRIVACY BY DESIGN
                </span>

                <h3>
                  Your information stays under your control.
                </h3>

                <p>
                  Trusted contacts and private incident
                  reports remain stored locally in this
                  prototype. AEGIRA never automatically
                  shares a report.
                </p>
              </div>

              <div className="privacy-checks">
                <span>
                  ✓ Local storage
                </span>

                <span>
                  ✓ Opt-in sharing
                </span>

                <span>
                  ✓ Quick Exit
                </span>
              </div>
            </section>
          </>
        )}

        {/* ================= OTHER PAGES ================= */}

        {page === "checkin" && (
          <section className="page-wrapper">
            <div className="page-header-banner">
              <span className="section-eyebrow">
                TRAVEL SAFETY
              </span>

              <h1>
                Safety Check-In
              </h1>

              <p>
                Set a timer and let AEGIRA help watch over
                your journey.
              </p>
            </div>

            <section className="page-card">
              <SafetyCheckIn />
            </section>
          </section>
        )}

        {page === "contacts" && (
          <section className="page-wrapper">
            <div className="page-header-banner">
              <span className="section-eyebrow">
                YOUR PEOPLE
              </span>

              <h1>
                Trusted Circle
              </h1>

              <p>
                Keep the people you trust ready when you need
                them.
              </p>
            </div>

            <section className="page-card">
              <TrustedContacts />
            </section>
          </section>
        )}

        {page === "report" && (
          <section className="page-wrapper">
            <div className="page-header-banner">
              <span className="section-eyebrow">
                PRIVATE DOCUMENTATION
              </span>

              <h1>
                Incident Report
              </h1>

              <p>
                Document concerns privately, clearly and at
                your own pace.
              </p>
            </div>

            <section className="page-card">
              <IncidentReport />
            </section>
          </section>
        )}

        {page === "support" && (
          <section className="page-wrapper">
            <div className="page-header-banner">
              <span className="section-eyebrow">
                SUPPORT NETWORK
              </span>

              <h1>
                Find Support
              </h1>

              <p>
                Discover relevant help based on your needs
                and location.
              </p>
            </div>

            <section className="page-card">
              <SupportDirectory />
            </section>
          </section>
        )}
      </main>

      <VoiceAssistant
        onNavigate={goTo}
      />

      {/* ================= FOOTER ================= */}

      <footer>
        <AegiraLogo compact />

        <div className="footer-center">
          Built for safety, support and privacy.
        </div>

        <span>
          Hackathon Prototype • AEGIRA
        </span>
      </footer>
    </div>
  );
}

export default App;