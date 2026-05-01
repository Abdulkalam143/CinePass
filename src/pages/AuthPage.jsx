/**
 * AuthPage — Login / Sign Up with toggle, form validation, and localStorage auth
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff,
  Film, ArrowRight, CheckCircle,
} from 'lucide-react';
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | signup
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (mode === 'signup' && !form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Minimum 6 characters';
    }
    if (mode === 'signup' && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    if (mode === 'signup') {
      // Save user to localStorage
      const users = JSON.parse(localStorage.getItem('cinepass_users') || '[]');
      const exists = users.find((u) => u.email === form.email);
      if (exists) {
        setErrors({ email: 'Account already exists. Please login.' });
        setLoading(false);
        return;
      }
      users.push({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem('cinepass_users', JSON.stringify(users));
    } else {
      // Check credentials
      const users = JSON.parse(localStorage.getItem('cinepass_users') || '[]');
      const user = users.find((u) => u.email === form.email && u.password === form.password);
      if (!user) {
        setErrors({ email: 'Invalid email or password' });
        setLoading(false);
        return;
      }
    }

    // Store session
    localStorage.setItem('cinepass_session', JSON.stringify({
      email: form.email,
      name: form.name || form.email.split('@')[0],
      loggedIn: true,
      timestamp: Date.now(),
    }));

    setLoading(false);
    navigate('/');
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <motion.div
      className="auth-page"
      id="auth-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="auth-page__wrapper">
        {/* Left branding panel */}
        <div className="auth-brand">
          <div className="auth-brand__content">
            <div className="auth-brand__logo">
              <Film size={32} />
            </div>
            <h2 className="auth-brand__title">CinePass</h2>
            <p className="auth-brand__tagline">
              Your premium movie ticket booking experience
            </p>
            <div className="auth-brand__features">
              {['GPS Theater Discovery', 'Interactive Seat Maps', 'Instant Booking'].map((f) => (
                <div key={f} className="auth-brand__feature">
                  <CheckCircle size={14} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-panel__inner">
            {/* Mode toggle */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => toggleMode()}
              >
                <LogIn size={16} /> Login
              </button>
              <button
                className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => toggleMode()}
              >
                <UserPlus size={16} /> Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="auth-form__title">
                  {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
                </h1>
                <p className="auth-form__subtitle">
                  {mode === 'login'
                    ? 'Login to access your bookings and wallet'
                    : 'Join CinePass for the best movie experience'}
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                  {/* Name (signup only) */}
                  {mode === 'signup' && (
                    <div className={`auth-field ${errors.name ? 'auth-field--error' : ''}`}>
                      <label htmlFor="auth-name"><User size={14} /> Full Name</label>
                      <input
                        type="text" id="auth-name" name="name"
                        value={form.name} onChange={handleChange}
                        placeholder="Abdul Kalam"
                      />
                      {errors.name && <span className="auth-field__error">{errors.name}</span>}
                    </div>
                  )}

                  {/* Email */}
                  <div className={`auth-field ${errors.email ? 'auth-field--error' : ''}`}>
                    <label htmlFor="auth-email"><Mail size={14} /> Email</label>
                    <input
                      type="email" id="auth-email" name="email"
                      value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                    />
                    {errors.email && <span className="auth-field__error">{errors.email}</span>}
                  </div>

                  {/* Password */}
                  <div className={`auth-field ${errors.password ? 'auth-field--error' : ''}`}>
                    <label htmlFor="auth-password"><Lock size={14} /> Password</label>
                    <div className="auth-field__password-wrap">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="auth-password" name="password"
                        value={form.password} onChange={handleChange}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="auth-field__eye"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <span className="auth-field__error">{errors.password}</span>}
                  </div>

                  {/* Confirm Password (signup only) */}
                  {mode === 'signup' && (
                    <div className={`auth-field ${errors.confirmPassword ? 'auth-field--error' : ''}`}>
                      <label htmlFor="auth-confirm"><Lock size={14} /> Confirm Password</label>
                      <input
                        type="password" id="auth-confirm" name="confirmPassword"
                        value={form.confirmPassword} onChange={handleChange}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && <span className="auth-field__error">{errors.confirmPassword}</span>}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="auth-form__submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="auth-form__loader" />
                    ) : (
                      <>
                        {mode === 'login' ? 'Login' : 'Create Account'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {mode === 'login' && (
                  <button className="auth-form__forgot">Forgot password?</button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
