/**
 * ProfilePage — User profile view with editable details
 * Allows users to update name, email, phone, and password
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Camera, Save,
  ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle,
  Edit3, Shield, Calendar, Ticket,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Load session data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Original data for cancel
  const [originalData, setOriginalData] = useState({});

  // Stats
  const [stats, setStats] = useState({ bookings: 0, memberSince: '' });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('cinepass_session') || '{}');
    const users = JSON.parse(localStorage.getItem('cinepass_users') || '[]');
    const user = users.find((u) => u.email === session.email);

    const data = {
      name: user?.name || session.name || '',
      email: session.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    setUserData(data);
    setOriginalData(data);

    // Calculate stats
    const bookings = JSON.parse(localStorage.getItem('cinepass_bookings') || '[]');
    const userBookings = bookings.filter((b) => b.email === session.email);
    setStats({
      bookings: userBookings.length,
      memberSince: session.timestamp
        ? new Date(session.timestamp).toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'long', year: 'numeric' })
        : 'Recently',
    });
  }, [language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!userData.name.trim()) newErrors.name = 'Name is required';
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (userData.phone && !/^[+]?[\d\s\-()]{7,15}$/.test(userData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    // Password change validation
    if (userData.newPassword) {
      if (!userData.currentPassword) {
        newErrors.currentPassword = 'Enter current password to change';
      }
      if (userData.newPassword.length < 6) {
        newErrors.newPassword = 'Minimum 6 characters';
      }
      if (userData.newPassword !== userData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    // Simulate API
    await new Promise((r) => setTimeout(r, 800));

    const session = JSON.parse(localStorage.getItem('cinepass_session') || '{}');
    const users = JSON.parse(localStorage.getItem('cinepass_users') || '[]');
    const userIndex = users.findIndex((u) => u.email === session.email);

    // Verify current password if changing password
    if (userData.newPassword && userIndex >= 0) {
      if (users[userIndex].password !== userData.currentPassword) {
        setErrors({ currentPassword: 'Incorrect current password' });
        setSaving(false);
        return;
      }
    }

    // Check if email changed and already exists
    if (userData.email !== session.email) {
      const emailExists = users.find((u) => u.email === userData.email && u.email !== session.email);
      if (emailExists) {
        setErrors({ email: 'This email is already in use' });
        setSaving(false);
        return;
      }
    }

    // Update user in users array
    if (userIndex >= 0) {
      users[userIndex].name = userData.name;
      users[userIndex].email = userData.email;
      users[userIndex].phone = userData.phone;
      if (userData.newPassword) {
        users[userIndex].password = userData.newPassword;
      }
      localStorage.setItem('cinepass_users', JSON.stringify(users));
    }

    // Update session
    session.name = userData.name;
    session.email = userData.email;
    localStorage.setItem('cinepass_session', JSON.stringify(session));

    setEditing(false);
    setSaving(false);
    setUserData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    setOriginalData({ ...userData, currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast(t('profile.updated'), 'success');
  };

  const handleCancel = () => {
    setUserData({ ...originalData });
    setEditing(false);
    setErrors({});
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  return (
    <motion.div
      className="profile-page"
      id="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Toast */}
      {toast && (
        <motion.div
          className={`profile-toast profile-toast--${toast.type}`}
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20 }}
        >
          <CheckCircle size={16} />
          {toast.message}
        </motion.div>
      )}

      <div className="profile-page__container container">
        {/* Back button */}
        <button className="profile-back" onClick={() => navigate(-1)} id="profile-back-btn">
          <ArrowLeft size={18} />
          {t('profile.back')}
        </button>

        <div className="profile-layout">
          {/* Left sidebar */}
          <motion.div
            className="profile-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Avatar */}
            <div className="profile-avatar">
              <div className="profile-avatar__circle">
                <span className="profile-avatar__initials">{getInitials(userData.name)}</span>
              </div>
              <div className="profile-avatar__glow" />
            </div>

            <h2 className="profile-sidebar__name">{userData.name || 'User'}</h2>
            <p className="profile-sidebar__email">{userData.email}</p>

            {/* Stats */}
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat__icon">
                  <Ticket size={16} />
                </div>
                <div className="profile-stat__info">
                  <span className="profile-stat__value">{stats.bookings}</span>
                  <span className="profile-stat__label">{t('profile.bookingsCount')}</span>
                </div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat__icon">
                  <Calendar size={16} />
                </div>
                <div className="profile-stat__info">
                  <span className="profile-stat__value">{stats.memberSince}</span>
                  <span className="profile-stat__label">{t('profile.memberSince')}</span>
                </div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat__icon">
                  <Shield size={16} />
                </div>
                <div className="profile-stat__info">
                  <span className="profile-stat__value">{t('profile.verified')}</span>
                  <span className="profile-stat__label">{t('profile.status')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right content */}
          <motion.div
            className="profile-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header */}
            <div className="profile-content__header">
              <div>
                <h1 className="profile-content__title">{t('profile.personalInfo')}</h1>
                <p className="profile-content__subtitle">{t('profile.manageDetails')}</p>
              </div>
              {!editing ? (
                <button
                  className="profile-edit-btn"
                  onClick={() => setEditing(true)}
                  id="profile-edit-btn"
                >
                  <Edit3 size={16} />
                  {t('profile.editProfile')}
                </button>
              ) : (
                <div className="profile-edit-actions">
                  <button className="profile-cancel-btn" onClick={handleCancel}>
                    {t('profile.cancel')}
                  </button>
                  <button
                    className="profile-save-btn"
                    onClick={handleSave}
                    disabled={loading}
                    id="profile-save-btn"
                  >
                    {loading ? (
                      <span className="profile-save-loader" />
                    ) : (
                      <>
                        <Save size={16} />
                        {t('profile.saveChanges')}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="profile-fields">
              {/* Name */}
              <div className={`profile-field ${errors.name ? 'profile-field--error' : ''}`}>
                <label htmlFor="profile-name">
                  <User size={14} />
                  {t('profile.fullName')}
                </label>
                {editing ? (
                  <input
                    type="text" id="profile-name" name="name"
                    value={userData.name} onChange={handleChange}
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="profile-field__value">{userData.name || '—'}</div>
                )}
                {errors.name && <span className="profile-field__error"><AlertCircle size={12} /> {errors.name}</span>}
              </div>

              {/* Email */}
              <div className={`profile-field ${errors.email ? 'profile-field--error' : ''}`}>
                <label htmlFor="profile-email">
                  <Mail size={14} />
                  {t('profile.email')}
                </label>
                {editing ? (
                  <input
                    type="email" id="profile-email" name="email"
                    value={userData.email} onChange={handleChange}
                    placeholder="you@example.com"
                  />
                ) : (
                  <div className="profile-field__value">{userData.email || '—'}</div>
                )}
                {errors.email && <span className="profile-field__error"><AlertCircle size={12} /> {errors.email}</span>}
              </div>

              {/* Phone */}
              <div className={`profile-field ${errors.phone ? 'profile-field--error' : ''}`}>
                <label htmlFor="profile-phone">
                  <Phone size={14} />
                  {t('profile.phone')}
                </label>
                {editing ? (
                  <input
                    type="tel" id="profile-phone" name="phone"
                    value={userData.phone} onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                ) : (
                  <div className="profile-field__value">{userData.phone || 'Not set'}</div>
                )}
                {errors.phone && <span className="profile-field__error"><AlertCircle size={12} /> {errors.phone}</span>}
              </div>
            </div>

            {/* Password section */}
            {editing && (
              <motion.div
                className="profile-password-section"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="profile-password-section__title">
                  <Lock size={16} />
                  {t('profile.changePass')}
                </h3>
                <p className="profile-password-section__hint">{t('profile.leaveBlank')}</p>

                <div className="profile-fields">
                  {/* Current Password */}
                  <div className={`profile-field ${errors.currentPassword ? 'profile-field--error' : ''}`}>
                    <label htmlFor="profile-current-pw">
                      <Lock size={14} />
                      {t('profile.currentPass')}
                    </label>
                    <div className="profile-field__pw-wrap">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="profile-current-pw" name="currentPassword"
                        value={userData.currentPassword} onChange={handleChange}
                        placeholder="••••••••"
                      />
                      <button
                        type="button" className="profile-field__eye"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.currentPassword && <span className="profile-field__error"><AlertCircle size={12} /> {errors.currentPassword}</span>}
                  </div>

                  {/* New Password */}
                  <div className={`profile-field ${errors.newPassword ? 'profile-field--error' : ''}`}>
                    <label htmlFor="profile-new-pw">
                      <Lock size={14} />
                      {t('profile.newPass')}
                    </label>
                    <div className="profile-field__pw-wrap">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="profile-new-pw" name="newPassword"
                        value={userData.newPassword} onChange={handleChange}
                        placeholder="••••••••"
                      />
                      <button
                        type="button" className="profile-field__eye"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.newPassword && <span className="profile-field__error"><AlertCircle size={12} /> {errors.newPassword}</span>}
                  </div>

                  {/* Confirm Password */}
                  <div className={`profile-field ${errors.confirmPassword ? 'profile-field--error' : ''}`}>
                    <label htmlFor="profile-confirm-pw">
                      <Lock size={14} />
                      {t('profile.confirmNewPass')}
                    </label>
                    <input
                      type="password" id="profile-confirm-pw" name="confirmPassword"
                      value={userData.confirmPassword} onChange={handleChange}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && <span className="profile-field__error"><AlertCircle size={12} /> {errors.confirmPassword}</span>}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
