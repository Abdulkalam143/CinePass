/**
 * ConfirmationPage — Review booking + Select payment method before paying
 * Payment methods: UPI, Credit/Debit Card, Internet Banking
 */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Ticket, Clock, MapPin, ShieldCheck,
  Smartphone, CreditCard, Landmark, ChevronRight,
  CheckCircle2, Lock, Loader,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatPrice, getSeatPrice } from '../utils/seatUtils';
import { generateQRCodeSVG, generateUPIString } from '../utils/qrcode';
import { useTranslation } from '../context/LanguageContext';
import './ConfirmationPage.css';

/* ── Payment method configs ── */
const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: Smartphone,
    color: '#8b5cf6',
    // No fields — shows QR code instead
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
    color: '#3b82f6',
    fields: [
      { name: 'cardNumber', label: 'Card Number', placeholder: '1234 5678 9012 3456', type: 'text' },
      { name: 'cardName', label: 'Name on Card', placeholder: 'Name on card', type: 'text' },
      { name: 'cardExpiry', label: 'Expiry (MM/YY)', placeholder: '12/28', type: 'text' },
      { name: 'cardCvv', label: 'CVV', placeholder: '•••', type: 'password' },
    ],
  },
  {
    id: 'netbanking',
    name: 'Internet Banking',
    description: 'SBI, HDFC, ICICI, Axis & more',
    icon: Landmark,
    color: '#10b981',
    banks: ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak', 'PNB', 'BOB', 'Canara'],
  },
];

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    selectedMovie, selectedShowtime, selectedSeats,
    totalPrice, confirmBooking,
  } = useBooking();
  const { t } = useTranslation();

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentFields, setPaymentFields] = useState({});
  const [selectedBank, setSelectedBank] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if no booking data
  if (!selectedMovie || selectedSeats.length === 0) {
    return (
      <div className="confirm-page__empty container">
        <h2>{t('confirm.noBooking')}</h2>
        <p>{t('booking.selectShowtime')}</p>
        <button onClick={() => navigate('/')}>{t('confirm.browseMovies')}</button>
      </div>
    );
  }

  const convenienceFee = selectedSeats.length * 30;
  const grandTotal = totalPrice + convenienceFee;

  // Generate QR code for UPI payment
  const qrCodeSVG = useMemo(() => {
    const upiString = generateUPIString(grandTotal);
    return generateQRCodeSVG(upiString, 200);
  }, [grandTotal]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setPaymentFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!selectedMethod) {
      newErrors.method = 'Please select a payment method';
      setErrors(newErrors);
      return false;
    }

    const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

    if (method.fields) {
      method.fields.forEach((f) => {
        if (!paymentFields[f.name]?.trim()) {
          newErrors[f.name] = `${f.label} is required`;
        }
      });
    }

    if (method.id === 'card' && paymentFields.cardNumber) {
      const digits = paymentFields.cardNumber.replace(/\s/g, '');
      if (digits.length < 13 || digits.length > 19) {
        newErrors.cardNumber = 'Invalid card number';
      }
    }

    if (method.id === 'netbanking' && !selectedBank) {
      newErrors.bank = 'Please select a bank';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validatePayment()) return;

    setProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));

    const booking = confirmBooking();
    if (booking) {
      setProcessing(false);
      navigate('/payment-success');
    }
  };

  return (
    <motion.div
      className="confirm-page"
      id="confirmation-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="confirm-page__container container">
        <button className="confirm-page__back" onClick={() => navigate(-1)} id="confirm-back-btn">
          <ArrowLeft size={20} />
          {t('confirm.backToSeats')}
        </button>

        <h1 className="confirm-page__heading">
          <ShieldCheck size={24} />
          {t('confirm.confirmPay')}
        </h1>

        <div className="confirm-page__layout">
          {/* ── Left: Movie + Payment Methods ── */}
          <div className="confirm-page__main">
            {/* Movie Info */}
            <div className="confirm-page__card">
              <div className="confirm-page__movie">
                <img
                  src={selectedMovie.image}
                  alt={selectedMovie.title}
                  className="confirm-page__poster"
                />
                <div className="confirm-page__movie-info">
                  <h2 className="confirm-page__movie-title">{selectedMovie.title}</h2>
                  <div className="confirm-page__detail">
                    <Clock size={16} />
                    <span>{selectedShowtime}</span>
                  </div>
                  <div className="confirm-page__detail">
                    <MapPin size={16} />
                    <span>{selectedSeats.length} {selectedSeats.length > 1 ? t('success.seats') : t('confirm.seat')}: {selectedSeats.sort().join(', ')}</span>
                  </div>
                  <div className="confirm-page__detail">
                    <Ticket size={16} />
                    <span>{selectedMovie.duration || '2h 0m'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Payment Methods ── */}
            <div className="confirm-page__card">
              <h3 className="confirm-page__section-title">
                <Lock size={18} />
                {t('confirm.selectPayment')}
              </h3>
              {errors.method && <p className="confirm-page__error-text">{errors.method}</p>}

              <div className="payment-methods">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isActive = selectedMethod === method.id;

                  return (
                    <div key={method.id} className={`payment-method ${isActive ? 'active' : ''}`}>
                      {/* Method Header */}
                      <button
                        className="payment-method__header"
                        onClick={() => {
                          setSelectedMethod(isActive ? null : method.id);
                          setErrors({});
                        }}
                        id={`payment-${method.id}`}
                      >
                        <div
                          className="payment-method__radio"
                          style={{ borderColor: isActive ? method.color : undefined }}
                        >
                          {isActive && (
                            <motion.div
                              className="payment-method__radio-dot"
                              style={{ background: method.color }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            />
                          )}
                        </div>
                        <div className="payment-method__icon" style={{ color: method.color }}>
                          <Icon size={20} />
                        </div>
                        <div className="payment-method__info">
                          <span className="payment-method__name">{method.name}</span>
                          <span className="payment-method__desc">{method.description}</span>
                        </div>
                        <ChevronRight
                          size={16}
                          className={`payment-method__chevron ${isActive ? 'rotated' : ''}`}
                        />
                      </button>

                      {/* Expanded: Payment form fields */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            className="payment-method__body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            {/* UPI — QR Code Display */}
                            {method.id === 'upi' && (
                              <div className="payment-qr">
                                <div className="payment-qr__container">
                                  <div
                                    className="payment-qr__code"
                                    dangerouslySetInnerHTML={{ __html: qrCodeSVG }}
                                  />
                                  <div className="payment-qr__amount">
                                    <span className="payment-qr__amount-label">{t('summary.totalAmount')}</span>
                                    <span className="payment-qr__amount-value">{formatPrice(grandTotal)}</span>
                                  </div>
                                </div>
                                <p className="payment-qr__instruction">{t('confirm.scanQR')}</p>
                                <div className="payment-qr__apps">
                                  <span className="payment-qr__app-badge">GPay</span>
                                  <span className="payment-qr__app-badge">PhonePe</span>
                                  <span className="payment-qr__app-badge">Paytm</span>
                                  <span className="payment-qr__app-badge">BHIM</span>
                                </div>
                              </div>
                            )}

                            {/* Field-based (Card) */}
                            {method.fields && (
                              <div className="payment-fields">
                                {method.fields.map((field) => (
                                  <div key={field.name} className="payment-field">
                                    <label htmlFor={field.name}>{field.label}</label>
                                    <input
                                      id={field.name}
                                      name={field.name}
                                      type={field.type}
                                      placeholder={field.placeholder}
                                      value={paymentFields[field.name] || ''}
                                      onChange={handleFieldChange}
                                      className={errors[field.name] ? 'error' : ''}
                                    />
                                    {errors[field.name] && (
                                      <span className="payment-field__error">{errors[field.name]}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Bank selection (Net Banking) */}
                            {method.banks && (
                              <div className="payment-banks">
                                {errors.bank && <span className="payment-field__error">{errors.bank}</span>}
                                <div className="payment-banks__grid">
                                  {method.banks.map((bank) => (
                                    <button
                                      key={bank}
                                      className={`payment-bank ${selectedBank === bank ? 'active' : ''}`}
                                      onClick={() => { setSelectedBank(bank); setErrors({}); }}
                                    >
                                      <Landmark size={14} />
                                      {bank}
                                      {selectedBank === bank && <CheckCircle2 size={12} className="payment-bank__check" />}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right: Price Summary ── */}
          <div className="confirm-page__sidebar">
            <div className="confirm-page__card confirm-page__pricing-card">
              <h3 className="confirm-page__section-title">
                <Ticket size={18} />
                {t('confirm.priceBreakdown')}
              </h3>

              <div className="confirm-page__pricing">
                {selectedSeats.map((seat) => (
                  <div key={seat} className="confirm-page__price-line">
                    <span>{t('confirm.seat')} {seat}</span>
                    <span>{formatPrice(getSeatPrice(seat.charAt(0)))}</span>
                  </div>
                ))}
                <div className="confirm-page__price-line confirm-page__price-line--fee">
                  <span>{t('summary.convenienceFee')} ({selectedSeats.length}x ₹30)</span>
                  <span>{formatPrice(convenienceFee)}</span>
                </div>
                <div className="confirm-page__divider" />
                <div className="confirm-page__price-line confirm-page__price-line--total">
                  <span>{t('confirm.grandTotal')}</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Selected method indicator */}
              {selectedMethod && (
                <div className="confirm-page__selected-method">
                  <span>{t('confirm.payingVia')}</span>
                  <strong>
                    {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name}
                    {selectedMethod === 'netbanking' && selectedBank ? ` (${selectedBank})` : ''}
                  </strong>
                </div>
              )}

              {/* Pay Button */}
              <motion.button
                className="confirm-page__confirm-btn"
                onClick={handleConfirm}
                disabled={processing}
                whileTap={{ scale: 0.97 }}
                id="confirm-and-pay-btn"
              >
                {processing ? (
                  <>
                    <Loader size={20} className="confirm-page__spinner" />
                    {t('confirm.processing')}
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    {t('confirm.pay')} {formatPrice(grandTotal)}
                  </>
                )}
              </motion.button>

              <p className="confirm-page__secure-note">
                <Lock size={12} />
                {t('confirm.sslEncrypted')}
              </p>

              <button
                className="confirm-page__cancel-btn"
                onClick={() => navigate(-1)}
              >
                {t('confirm.goBack')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmationPage;
