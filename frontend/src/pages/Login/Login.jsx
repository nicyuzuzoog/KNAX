// src/pages/Login/Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';
import {
  FaEnvelope, FaLock, FaSignInAlt, FaGraduationCap,
  FaEye, FaEyeSlash, FaLaptopCode, FaNetworkWired,
  FaChartLine, FaMicrochip, FaWifi, FaCheckCircle,
  FaExclamationCircle, FaShieldAlt, FaBolt
} from 'react-icons/fa';
import './Login.css';

/* ── tiny particle helper ── */
const PARTICLE_COUNT = 18;
function Particles() {
  return (
    <div className="particle-field" aria-hidden="true">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <span
          key={i}
          className="ptcl"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${(Math.random() * 12).toFixed(2)}s`,
            animationDuration: `${(10 + Math.random() * 14).toFixed(2)}s`,
            width: `${Math.random() > 0.6 ? 4 : 2}px`,
            height: `${Math.random() > 0.6 ? 4 : 2}px`,
            opacity: (0.3 + Math.random() * 0.5).toFixed(2),
          }}
        />
      ))}
    </div>
  );
}

/* ── typewriter for left panel headline ── */
const WORDS = ['Innovate.', 'Build.', 'Grow.', 'Excel.'];
function Typewriter() {
  const [wi, setWi] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const timeout = useRef(null);

  useEffect(() => {
    const word = WORDS[wi % WORDS.length];
    const speed = deleting ? 60 : 100;
    const pause = deleting ? 0 : 1600;

    if (!deleting && text === word) {
      timeout.current = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === '') {
      setDeleting(false);
      setWi(p => p + 1);
    } else {
      timeout.current = setTimeout(() => {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }, speed);
    }
    return () => clearTimeout(timeout.current);
  }, [text, deleting, wi]);

  return (
    <span className="typewriter-text">
      {text}<span className="tw-cursor">|</span>
    </span>
  );
}

/* ── main component ── */
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [focused, setFocused] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('userEmail');
    if (saved && savedEmail) { setFormData(p => ({ ...p, email: savedEmail })); setRememberMe(true); }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors below'); return; }
    setLoading(true);
    try {
      const data = await login({ email: formData.email.trim().toLowerCase(), password: formData.password });
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }
      toast.success(`Welcome back, ${data.user.fullName}! 👋`);
      setTimeout(() => {
        const routes = { super_admin: '/super-admin/dashboard', junior_admin: '/admin/dashboard', student: '/student/dashboard' };
        navigate(routes[data.user.role] || '/', { replace: true });
      }, 500);
    } catch (error) {
      const msg = error.response?.data?.message
        || (error.response?.status === 401 ? 'Invalid email or password'
          : error.response?.status === 404 ? 'Account not found. Register first.'
          : 'Login failed. Please try again.');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const fieldState = (name) => errors[name] ? 'error' : (formData[name] && !errors[name] ? 'success' : '');

  return (
    <>
      <Navbar />
      <div className="login-split">

        {/* ══════════════ LEFT ══════════════ */}
        <aside className="login-left" aria-hidden="true">
          <Particles />

          {/* grid overlay */}
          <div className="ll-grid" />
          {/* radial glow */}
          <div className="ll-glow" />

          <div className="ll-content">
            {/* brand */}
            <div className="ll-brand">
              <div className="ll-logo-box">
                <FaGraduationCap />
              </div>
              <h1>KNAX<span>_250</span></h1>
              <p className="ll-sub">Technical Training Center</p>
            </div>

            {/* headline */}
            <div className="ll-headline">
              <p className="ll-eyebrow"><FaBolt /> Rwanda's #1 Tech School</p>
              <h2>Learn. <Typewriter /></h2>
              <p className="ll-desc">
                Transform your career with hands-on technical training,
                RTB certification, and guaranteed job placement support.
              </p>
            </div>

            {/* feature cards */}
            <div className="ll-features">
              {[
                { icon: <FaLaptopCode />, title: 'Software Dev', sub: 'Web & Mobile Apps', color: '#42A5F5' },
                { icon: <FaNetworkWired />, title: 'Networking & IT', sub: 'Infrastructure & Security', color: '#10B981' },
                { icon: <FaChartLine />, title: 'Accounting', sub: 'Financial Management', color: '#F59E0B' },
                { icon: <FaMicrochip />, title: 'Electronics', sub: 'Repair & Maintenance', color: '#A78BFA' },
              ].map((f, i) => (
                <div className="ll-card" key={i} style={{ '--accent': f.color, animationDelay: `${i * 0.1 + 0.3}s` }}>
                  <div className="ll-card-icon">{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* stats */}
            <div className="ll-stats">
              {[['500+', 'Students'], ['100%', 'Job Support'], ['3 mo', 'Duration'], ['RTB', 'Certified']].map(([v, l]) => (
                <div className="ll-stat" key={l}>
                  <strong>{v}</strong><span>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* decorative blobs */}
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </aside>

        {/* ══════════════ RIGHT ══════════════ */}
        <main className="login-right">
          <div className="lr-dot-bg" />
          <div className="lr-corner-glow" />

          <div className="login-card">
            {/* top accent */}
            <div className="lc-accent" />

            {/* mobile brand */}
            <div className="lc-mobile-brand">
              <div className="lc-mb-icon"><FaGraduationCap /></div>
              <h1>KNAX<span>_250</span></h1>
            </div>

            {/* header */}
            <div className="lc-header">
              <div className="lc-header-badge">
                <FaShieldAlt /> Secure Login
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to your KNAX_250 account</p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="lc-form" noValidate>

              {/* email */}
              <div className={`lc-field ${fieldState('email')}`}>
                <label htmlFor="email">
                  <FaEnvelope /> Email Address
                </label>
                <div className={`lc-input-wrap ${focused.email ? 'focused' : ''}`}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused(p => ({ ...p, email: true }))}
                    onBlur={() => setFocused(p => ({ ...p, email: false }))}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                  {fieldState('email') === 'success' && <span className="field-icon success"><FaCheckCircle /></span>}
                  {fieldState('email') === 'error'   && <span className="field-icon error"><FaExclamationCircle /></span>}
                </div>
                {errors.email && <p className="field-msg error"><FaExclamationCircle />{errors.email}</p>}
                {!errors.email && formData.email && <p className="field-msg success"><FaCheckCircle />Valid email</p>}
              </div>

              {/* password */}
              <div className={`lc-field ${fieldState('password')}`}>
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
                <div className={`lc-input-wrap ${focused.password ? 'focused' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused(p => ({ ...p, password: true }))}
                    onBlur={() => setFocused(p => ({ ...p, password: false }))}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    style={{ paddingRight: '52px' }}
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="field-msg error"><FaExclamationCircle />{errors.password}</p>}
              </div>

              {/* options */}
              <div className="lc-options">
                <label className="lc-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span className="lc-checkbox-box" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="lc-forgot">Forgot password?</Link>
              </div>

              {/* submit */}
              <button
                type="submit"
                className={`lc-btn${loading ? ' loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="lc-btn-inner"><span className="lc-spinner" />Signing in…</span>
                ) : (
                  <span className="lc-btn-inner"><FaSignInAlt />Login to Dashboard</span>
                )}
                <span className="lc-btn-shine" />
              </button>
            </form>

            {/* divider */}
            <div className="lc-divider"><span /><p>or</p><span /></div>

            {/* perks */}
            <div className="lc-perks">
              {[
                { icon: <FaWifi />, text: 'Free WiFi included' },
                { icon: <FaCheckCircle />, text: 'RTB Certified programs' },
              ].map((p, i) => (
                <div className="lc-perk" key={i}>
                  <span className="lc-perk-icon">{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="lc-footer">
              <p>Don't have an account? <Link to="/register" className="lc-link">Register here</Link></p>
              <p>Need help? <Link to="/contact" className="lc-link">Contact Support</Link></p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;
