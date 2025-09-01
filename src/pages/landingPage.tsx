import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import "../Styles/landingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setUsername(session.user.email || 'User');
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUsername("");
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, observerOptions);

    const sections = sectionsRef.current?.querySelectorAll('.fade-in-section');
    sections?.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections?.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="landing-page" ref={sectionsRef}>
      {/* Navigation */}
      <nav className="landing-nav fade-in-section">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">⚽</span>
            <span className="logo-text">SportStats</span>
          </div>
          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <span className="welcome-text">Welcome, {username}</span>
                <button className="nav-btn secondary" onClick={() => navigate('/user-dashboard')}>
                  Dashboard
                </button>
                <button className="nav-btn danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="nav-btn secondary" onClick={() => navigate('/login')}>
                  Sign In
                </button>
                <button className="nav-btn primary" onClick={() => navigate('/signup')}>
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section fade-in-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Track. Analyze. 
              <span className="highlight"> Dominate.</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate platform for football statistics, team management, and performance analytics. 
              Whether you're a passionate fan or a dedicated coach, get the insights you need to succeed.
            </p>
            <div className="hero-actions">
              {!isLoggedIn ? (
                <>
                  <button className="cta-btn primary" onClick={() => navigate('/signup')}>
                    Start Free Trial
                  </button>
                  <button className="cta-btn secondary" onClick={() => navigate('/login')}>
                    Sign In
                  </button>
                </>
              ) : (
                <button className="cta-btn primary" onClick={() => navigate('/user-dashboard')}>
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="stats-dashboard-preview">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">98.5%</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚽</div>
                <div className="stat-value">24/7</div>
                <div className="stat-label">Live Updates</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">10K+</div>
                <div className="stat-label">Teams</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section fade-in-section">
        <div className="features-container">
          <h2 className="section-title">Why Choose SportStats?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Precision Analytics</h3>
              <p>Get detailed statistics with 98.5% accuracy. Track every pass, shot, and tackle with precision.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Real-time Updates</h3>
              <p>Live match statistics, instant notifications, and up-to-the-minute performance data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Team Management</h3>
              <p>Comprehensive tools for coaches to manage players, analyze performance, and optimize strategies.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Performance Insights</h3>
              <p>Advanced analytics and visualizations to understand team and player performance trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Features */}
      <section className="roles-section fade-in-section">
        <div className="roles-container">
          <h2 className="section-title">Built for Everyone</h2>
          <div className="roles-grid">
            <div className="role-card coach">
              <div className="role-header">
                <div className="role-icon">⚽</div>
                <h3>For Coaches</h3>
              </div>
              <ul className="role-features">
                <li>Team roster management</li>
                <li>Player performance tracking</li>
                <li>Match analysis tools</li>
                <li>Lineup optimization</li>
                <li>Performance reports</li>
              </ul>
              <button className="role-cta" onClick={() => navigate('/signup')}>
                Start Coaching
              </button>
            </div>
            <div className="role-card fan">
              <div className="role-header">
                <div className="role-icon">👥</div>
                <h3>For Fans</h3>
              </div>
              <ul className="role-features">
                <li>Live match statistics</li>
                <li>Team and player tracking</li>
                <li>Historical data access</li>
                <li>Favorite teams management</li>
                <li>Performance comparisons</li>
              </ul>
              <button className="role-cta" onClick={() => navigate('/signup')}>
                Start Following
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section fade-in-section">
        <div className="cta-container">
          <h2>Ready to Transform Your Football Experience?</h2>
          <p>Join thousands of coaches and fans who trust SportStats for their football analytics needs.</p>
          {!isLoggedIn ? (
            <button className="cta-btn primary large" onClick={() => navigate('/signup')}>
              Get Started Today
            </button>
          ) : (
            <button className="cta-btn primary large" onClick={() => navigate('/user-dashboard')}>
              Go to Dashboard
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer fade-in-section">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-icon">⚽</span>
              <span className="logo-text">SportStats</span>
            </div>
            <p className="footer-tagline">
              Empowering football success through data-driven insights
            </p>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;