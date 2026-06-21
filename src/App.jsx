import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [taoPrice, setTaoPrice] = useState('Loading...');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroVideoRef = useRef(null);

  // Smooth video loop: seek to start just before the video ends
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.currentTime >= video.duration - 0.3) {
        video.currentTime = 0;
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);

    // Robust autoplay for mobile (Brave iOS, Safari iOS, etc.)
    const attemptPlay = () => {
      video.muted = true;
      const p = video.play();
      if (p) {
        p.catch(() => {
          // play failed — will be handled by touch fallback
        });
      }
    };

    // Try on loadeddata (first frame ready)
    const onLoadedData = () => {
      attemptPlay();
    };

    // Try on loadedmetadata
    const onLoadedMeta = () => {
      attemptPlay();
    };

    // Try on canplay
    const onCanPlay = () => {
      attemptPlay();
    };

    video.addEventListener('loadeddata', onLoadedData, { once: true });
    video.addEventListener('loadedmetadata', onLoadedMeta, { once: true });
    video.addEventListener('canplay', onCanPlay, { once: true });

    // If already ready enough, try immediately
    if (video.readyState >= 2) {
      attemptPlay();
    }

    // Touch-based fallback: create a transparent overlay that triggers play
    // on the first user interaction, then removes itself
    const hero = document.getElementById('hero');
    if (!hero) return;

    const touchOverlay = document.createElement('div');
    touchOverlay.style.cssText =
      'position:absolute;inset:0;z-index:1;background:transparent;cursor:pointer;';
    touchOverlay.setAttribute('aria-hidden', 'true');

    const triggerPlay = () => {
      video.muted = true;
      video.play().catch(() => {});
      touchOverlay.removeEventListener('touchstart', triggerPlay);
      touchOverlay.removeEventListener('click', triggerPlay);
      if (touchOverlay.parentNode) {
        touchOverlay.parentNode.removeChild(touchOverlay);
      }
    };

    touchOverlay.addEventListener('touchstart', triggerPlay, { once: true });
    touchOverlay.addEventListener('click', triggerPlay, { once: true });
    hero.appendChild(touchOverlay);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('loadedmetadata', onLoadedMeta);
      video.removeEventListener('canplay', onCanPlay);
      touchOverlay.removeEventListener('touchstart', triggerPlay);
      touchOverlay.removeEventListener('click', triggerPlay);
      if (touchOverlay.parentNode) {
        touchOverlay.parentNode.removeChild(touchOverlay);
      }
    };
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=TAOUSDT');
        const data = await res.json();
        const price = parseFloat(data.price);
        if (!isNaN(price)) {
          setTaoPrice('$' + price.toFixed(2));
        }
      } catch {
        // keep last known price on error; if still loading, show "—"
        setTaoPrice(prev => prev === 'Loading...' ? '—' : prev);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => scrollTo('hero')}>
            <img src="/logos/ZIIX_symbol.svg" alt="Z·II·X Capital" className="nav-symbol" />
            <div className="nav-logo-text">
              <span className="nav-wordmark">Z·II·X</span>
              <span className="nav-sublabel">CAPITAL</span>
            </div>
          </div>
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <button
              className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
            <a href="#thesis" onClick={(e) => { e.preventDefault(); scrollTo('thesis'); }}>Thesis</a>
            <a href="#synthex" onClick={(e) => { e.preventDefault(); scrollTo('synthex'); }}>Synthex Forge</a>
            <a href="#acquisitions" onClick={(e) => { e.preventDefault(); scrollTo('acquisitions'); }}>Acquisitions</a>
            <a href="#reports" onClick={(e) => { e.preventDefault(); scrollTo('reports'); }}>Reports</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <video ref={heroVideoRef} className="hero-video" muted playsInline autoPlay preload="auto" webkit-playsinline="true">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-accent-line"></div>
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <div className="hero-badge">Private Capital</div>
          <h1 className="hero-headline">A private capital machine<br />built to compound.</h1>
          <p className="hero-subheadline">Systematic trading. Strategic acquisitions. Digital asset treasury.</p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => scrollTo('thesis')}>Read the thesis</button>
            <button className="btn btn-outline" onClick={() => scrollTo('synthex')}>Explore Synthex Forge</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">7</span>
              <span className="hero-stat-label">Active Strategies</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">99.7%</span>
              <span className="hero-stat-label">System Uptime</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{taoPrice}</span>
              <span className="hero-stat-label">TAO Price</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">10 TAO</span>
              <span className="hero-stat-label">TAO Holdings</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span className="hero-scroll-text">Scroll</span>
          <span className="hero-scroll-line"></span>
        </div>
      </section>

      {/* Capital Engines Section */}
      <section id="engines" className="engines">
        <div className="section-inner">
          <div className="section-label">Capital Engines</div>
          <h2 className="section-title">Three Machines + One Treasury,<br />One Purpose</h2>
          <div className="section-accent"></div>
          <p className="section-lede">We operate at the intersection of systematic trading, disciplined acquisitions, operational value creation, and digital asset treasury — compounding capital across traditional and decentralized markets.</p>
          <div className="engines-grid">
            <div className="engine-card">
              <div className="engine-number">01</div>
              <h3 className="engine-title">Algorithmic Trading</h3>
              <p className="engine-desc">
                Proprietary systematic strategies across global markets. Our trading OS, Synthex Forge, executes with machine precision — capturing alpha through statistical arbitrage, momentum, and mean-reversion models.
              </p>
            </div>
            <div className="engine-card">
              <div className="engine-number">02</div>
              <h3 className="engine-title">LBO Acquisitions</h3>
              <p className="engine-desc">
                We acquire controlling stakes in profitable, cash-flow-generating businesses. Target companies with durable moats, recurring revenue, and clear paths to operational improvement.
              </p>
            </div>
            <div className="engine-card">
              <div className="engine-number">03</div>
              <h3 className="engine-title">Operational Value Creation</h3>
              <p className="engine-desc">
                Post-acquisition, we deploy capital, talent, and systems to accelerate growth. Our holding company structure enables long-term thinking without quarterly earnings pressure.
              </p>
            </div>
            <div className="engine-card engine-card-full">
              <div className="engine-number">04</div>
              <h3 className="engine-title">Digital Asset Treasury</h3>
              <p className="engine-desc">
                A portion of operating cash flows is deployed into Bittensor (TAO), a decentralised AI network asset. Holdings are staked at ~17.7% APY, compounding the treasury alongside our traditional portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capital Flywheel Section */}
      <section id="flywheel" className="flywheel">
        <div className="flywheel-bg"></div>
        <div className="section-inner">
          <div className="section-label light">Capital Flywheel</div>
          <h2 className="section-title light">The Z·II·X Capital Flywheel</h2>
          <div className="section-accent"></div>
          <p className="flywheel-subtitle">Six steps. Infinite compounding.</p>
          <div className="flywheel-steps">
            <div className="flywheel-step">
              <div className="flywheel-step-number">1</div>
              <div className="flywheel-step-content">
                <h3 className="flywheel-step-title">Acquire Businesses</h3>
                <p className="flywheel-step-desc">Build a portfolio of durable operating companies with repeatable cash flow</p>
              </div>
            </div>
            <div className="flywheel-arrow">↓</div>
            <div className="flywheel-step">
              <div className="flywheel-step-number">2</div>
              <div className="flywheel-step-content">
                <h3 className="flywheel-step-title">Run Synthex Forge</h3>
                <p className="flywheel-step-desc">Generate systematic trading profits through a Hermes Agent-powered, 24/7 multi-agent, multi-strategy engine</p>
              </div>
            </div>
            <div className="flywheel-arrow">↓</div>
            <div className="flywheel-step">
              <div className="flywheel-step-number">3</div>
              <div className="flywheel-step-content">
                <h3 className="flywheel-step-title">Validate &amp; Manage Risk</h3>
                <p className="flywheel-step-desc">Each strategy is statistically validated, correlation-diversified, and institutionally risk-managed</p>
              </div>
            </div>
            <div className="flywheel-arrow">↓</div>
            <div className="flywheel-step">
              <div className="flywheel-step-number">4</div>
              <div className="flywheel-step-content">
                <h3 className="flywheel-step-title">Deploy Surplus Cash Flow</h3>
                <p className="flywheel-step-desc">Operating profits and systematic trading profits fund TAO accumulation</p>
              </div>
            </div>
            <div className="flywheel-arrow">↓</div>
            <div className="flywheel-step">
              <div className="flywheel-step-number">5</div>
              <div className="flywheel-step-content">
                <h3 className="flywheel-step-title">Stake TAO</h3>
                <p className="flywheel-step-desc">Compound treasury assets through native staking and disciplined reserve management</p>
              </div>
            </div>
            <div className="flywheel-arrow">↓</div>
            <div className="flywheel-step">
              <div className="flywheel-step-number">6</div>
              <div className="flywheel-step-content">
                <h3 className="flywheel-step-title">Reinvest Into Scale</h3>
                <p className="flywheel-step-desc">More treasury strength, more acquisition capacity, more systems, more compounding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Principles Section */}
      <section id="principles" className="principles">
        <div className="principles-bg"></div>
        <div className="section-inner">
          <div className="section-label light">Operating Principles</div>
          <h2 className="section-title light">The Fortress Ethos</h2>
          <div className="section-accent"></div>
          <ul className="principles-list">
            <li><span className="principle-bullet"></span>Think in decades, not quarters.</li>
            <li><span className="principle-bullet"></span>Protect capital before pursuing growth.</li>
            <li><span className="principle-bullet"></span>Acquire enduring businesses with long-term ownership potential</li>
            <li><span className="principle-bullet"></span>Asymmetric accumulation of digital assets</li>
            <li><span className="principle-bullet"></span>Build systems that scale and beyond</li>
            <li><span className="principle-bullet"></span>Use data to inform decisions; use judgment to make them</li>
            <li><span className="principle-bullet"></span>Improve operations with discipline, structure, and accountability</li>
            <li><span className="principle-bullet"></span>Remain private, selective, and focused</li>
            <li><span className="principle-bullet"></span>Fortress balance sheet. Machine-like execution</li>
          </ul>
        </div>
      </section>

      {/* Investment Thesis Section */}
      <section id="thesis" className="thesis">
        <div className="section-inner">
          <div className="section-label">Investment Thesis</div>
          <h2 className="section-title">How We Think<br />About Capital</h2>
          <div className="section-accent"></div>
          <p className="thesis-lede">
            "We believe the greatest compounding machines are built at the intersection of systematic trading and disciplined acquisitions."
          </p>
          <div className="thesis-grid">
            <div className="thesis-block">
              <h4>Systematic Edge</h4>
              <p>Markets are inefficient in predictable ways. Our proprietary models exploit these inefficiencies with rigor and repeatability — removing emotion from every trade.</p>
            </div>
            <div className="thesis-block">
              <h4>Acquisition Discipline</h4>
              <p>We seek businesses with strong unit economics, defensible market positions, and management teams that welcome a patient, value-aligned partner.</p>
            </div>
            <div className="thesis-block">
              <h4>Capital Allocation</h4>
              <p>Free cash flow from operations funds reinvestment in existing businesses, deployment into new opportunities, and strategic accumulation of digital assets. Every dollar has a job.</p>
            </div>
            <div className="thesis-block">
              <h4>Long Horizons</h4>
              <p>As a private holding company, we are unburdened by quarterly reporting cycles. This allows us to make decisions that maximize value over decades, not days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Synthex Forge Section */}
      <section id="synthex" className="synthex">
        <div className="synthex-bg"></div>
        <div className="section-inner">
          <div className="synthex-header">
            <span className="synthex-badge">Product</span>
            <h2 className="section-title light">Synthex Forge</h2>
            <div className="section-accent"></div>
            <p className="synthex-tagline">The trading operating system powering our capital machine.</p>
          </div>
          <div className="synthex-grid">
            <div className="synthex-card">
              <h4>Multi-Asset Execution</h4>
              <p>Equities, futures, FX, and fixed income — all routed through a unified execution layer with sub-millisecond latency.</p>
            </div>
            <div className="synthex-card">
              <h4>Strategy Studio</h4>
              <p>Design, backtest, and deploy strategies in a Python-native environment. From simple moving average crossovers to complex ML ensembles.</p>
            </div>
            <div className="synthex-card">
              <h4>Risk Framework</h4>
              <p>Real-time position sizing, VaR limits, and drawdown controls. The system enforces discipline so you don't have to.</p>
            </div>
            <div className="synthex-card">
              <h4>Portfolio Analytics</h4>
              <p>Comprehensive attribution, performance reporting, and scenario analysis. Know exactly where your returns come from.</p>
            </div>
          </div>
          <div className="synthex-cta">
            <a
              href="https://synthexforge.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-view-white"
            >
              View
            </a>
          </div>
        </div>
      </section>

      {/* Acquisition Criteria Section */}
      <section id="acquisitions" className="acquisitions">
        <div className="section-inner">
          <div className="section-label">Acquisition Criteria</div>
          <h2 className="section-title">What We Look For<br />In a Business</h2>
          <div className="section-accent"></div>
          <p className="section-lede">We acquire controlling stakes in profitable small to mid-size businesses, that are cash-flow-generating and have durable competitive advantages.</p>
          <div className="acq-grid">
            <div className="acq-card">
              <h4>Revenue</h4>
              <p>€500k–€5M annual revenue with demonstrated profitability and positive free cash flow.</p>
            </div>
            <div className="acq-card">
              <h4>Moat</h4>
              <p>Defensible market position — network effects, proprietary technology, regulatory barriers, or brand strength.</p>
            </div>
            <div className="acq-card">
              <h4>Management</h4>
              <p>Strong existing leadership willing to stay post-acquisition with aligned incentives.</p>
            </div>
            <div className="acq-card">
              <h4>Industry</h4>
              <p>Technology, business services, industrial, healthcare, or niche manufacturing. No early-stage or pre-revenue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section id="reports" className="reports">
        <div className="reports-bg"></div>
        <div className="section-inner">
          <div className="section-label light">Reports &amp; Memos</div>
          <h2 className="section-title light">Research &amp; Analysis</h2>
          <div className="section-accent"></div>
          <p className="reports-subtitle">Strategy reports, acquisition memos, and market commentary.</p>
          <div className="reports-list">
            <div className="report-item">
              <span className="report-date">Daily</span>
              <a href="/reports/performance.html" target="_blank" rel="noopener noreferrer" className="report-title" style={{ textDecoration: 'none', display: 'block' }}>
                Trading Performance Report
              </a>
              <a href="/reports/performance.html" target="_blank" rel="noopener noreferrer" className="report-tag" style={{ textDecoration: 'none' }}>
                View Report
              </a>
            </div>
            <div className="report-item">
              <span className="report-date">Q1 2026</span>
              <a href="/reports/ZIIX_Capital_Report_2026.pdf" target="_blank" rel="noopener noreferrer" className="report-title" style={{ textDecoration: 'none', display: 'block' }}>
                Bittensor Treasury &amp; Acquisition Strategy — Full Report
              </a>
              <a href="/reports/ZIIX_Capital_Report_2026.pdf" target="_blank" rel="noopener noreferrer" className="report-tag" style={{ textDecoration: 'none' }}>
                View / Download
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="section-inner">
          <div className="section-label">Contact</div>
          <h2 className="section-title">Get in Touch</h2>
          <div className="section-accent centered"></div>
          <p className="contact-text">
            Z·II·X Capital does not accept outside capital. Inquiries regarding acquisition opportunities or institutional partnerships may be directed below.
          </p>
          <a href="mailto:enquiries@ziixcapital.com" className="contact-email">enquiries@ziixcapital.com</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/logos/ZIIX_symbol.svg" alt="" className="footer-symbol" />
            <span>Z·II·X Capital</span>
          </div>
          <p className="footer-tagline">Built like a fortress. Run like a machine.</p>
          <div className="footer-divider"></div>
          <p className="footer-copy">&copy; {new Date().getFullYear()} Z·II·X Capital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
