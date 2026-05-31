/**
 * WalletPage — Digital wallet with balance, transactions, rewards tiers, and gift cards
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight, Gift, CreditCard,
  TrendingUp, Clock, CheckCircle, IndianRupee, Star, Zap,
  Crown, Award, Send, ShoppingBag, Sparkles, Tag, Copy,
  Check, Lock, ChevronRight, Users, Heart, Ticket, Mail,
} from 'lucide-react';
import './WalletPage.css';

/* ── Mock Data ───────────────────────────────────────── */

const mockTransactions = [
  { id: 1, type: 'credit', label: 'Wallet Top-up', amount: 500, date: '2026-04-30', status: 'completed' },
  { id: 2, type: 'debit', label: 'Michael — 2 Tickets', amount: 700, date: '2026-04-29', status: 'completed' },
  { id: 3, type: 'credit', label: 'Cashback Reward', amount: 50, date: '2026-04-28', status: 'completed' },
  { id: 4, type: 'debit', label: 'Project Hail Mary — 1 Ticket', amount: 350, date: '2026-04-27', status: 'completed' },
  { id: 5, type: 'credit', label: 'Referral Bonus', amount: 100, date: '2026-04-25', status: 'completed' },
  { id: 6, type: 'debit', label: 'Vaazha II — 3 Tickets', amount: 750, date: '2026-04-24', status: 'completed' },
];

const rewardTiers = [
  { name: 'Bronze', icon: Star, minPoints: 0, color: '#cd7f32', perks: ['2% cashback', 'Birthday bonus'] },
  { name: 'Silver', icon: Award, minPoints: 500, color: '#a8a8a8', perks: ['5% cashback', 'Priority booking', 'Free snack combo'] },
  { name: 'Gold', icon: Crown, minPoints: 1500, color: '#f5c518', perks: ['10% cashback', 'Free upgrades', 'Exclusive previews', 'Lounge access'] },
  { name: 'Platinum', icon: Zap, minPoints: 5000, color: '#e0e0ff', perks: ['15% cashback', 'VIP seats', 'Concierge service', 'Premiere invites', 'Free popcorn'] },
];

const milestones = [
  { title: 'First Booking', points: 100, earned: true, icon: Ticket },
  { title: 'Refer a Friend', points: 200, earned: true, icon: Users },
  { title: '5 Movies Watched', points: 500, earned: false, icon: Star, progress: 3, goal: 5 },
  { title: 'Weekend Warrior', points: 300, earned: false, icon: Zap, progress: 2, goal: 4 },
  { title: 'Review 3 Movies', points: 250, earned: false, icon: Heart, progress: 1, goal: 3 },
  { title: 'Premium Member', points: 1000, earned: false, icon: Crown, progress: 0, goal: 1 },
];

const redeemableOffers = [
  { id: 1, title: 'Free Popcorn Combo', points: 200, description: 'Large popcorn + drink at any CinePass theater', icon: '🍿' },
  { id: 2, title: '₹100 Off Next Booking', points: 350, description: 'Flat discount on your next movie ticket', icon: '🎬' },
  { id: 3, title: 'Premium Seat Upgrade', points: 500, description: 'Upgrade to recliner seats for free', icon: '💺' },
  { id: 4, title: 'Buy 1 Get 1 Free', points: 750, description: 'Get a free ticket with your next booking', icon: '🎟️' },
  { id: 5, title: 'VIP Lounge Access', points: 1000, description: 'Access the VIP lounge before your show', icon: '✨' },
];

const giftCardDesigns = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
  { id: 'movie', label: 'Movie Night', emoji: '🎬', gradient: 'linear-gradient(135deg, #6c5ce7, #a55eea)' },
  { id: 'love', label: 'With Love', emoji: '💝', gradient: 'linear-gradient(135deg, #fd79a8, #e84393)' },
  { id: 'celebrate', label: 'Celebration', emoji: '🎉', gradient: 'linear-gradient(135deg, #f5c518, #e67e22)' },
  { id: 'thank', label: 'Thank You', emoji: '🙏', gradient: 'linear-gradient(135deg, #00b894, #00cec9)' },
  { id: 'surprise', label: 'Surprise', emoji: '🎁', gradient: 'linear-gradient(135deg, #0984e3, #74b9ff)' },
];

const giftCardAmounts = [250, 500, 1000, 2000, 5000];

const sentGiftCards = [
  { id: 'GC-2026A', to: 'Rahul S.', amount: 500, design: 'birthday', date: '2026-04-28', redeemed: true },
  { id: 'GC-2026B', to: 'Priya M.', amount: 1000, design: 'movie', date: '2026-04-20', redeemed: false },
];

/* ── Component ───────────────────────────────────────── */

const WalletPage = () => {
  const [balance] = useState(1250);
  const [activeTab, setActiveTab] = useState('all');
  const [showTopUp, setShowTopUp] = useState(false);
  const [pageTab, setPageTab] = useState('wallet'); // wallet | rewards | giftcards
  const [copiedCode, setCopiedCode] = useState(null);

  // Rewards state
  const currentPoints = 300;
  const currentTierIdx = rewardTiers.findIndex((t, i) =>
    currentPoints >= t.minPoints && (i === rewardTiers.length - 1 || currentPoints < rewardTiers[i + 1].minPoints)
  );
  const currentTier = rewardTiers[currentTierIdx];
  const nextTier = rewardTiers[currentTierIdx + 1];
  const progressToNext = nextTier
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  // Gift card state
  const [selectedDesign, setSelectedDesign] = useState('birthday');
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [redeemCode, setRedeemCode] = useState('');

  const filteredTxns = activeTab === 'all'
    ? mockTransactions
    : mockTransactions.filter((t) => t.type === activeTab);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const pageTabs = [
    { key: 'wallet', label: 'Wallet', icon: Wallet },
    { key: 'rewards', label: 'Rewards', icon: Sparkles },
    { key: 'giftcards', label: 'Gift Cards', icon: Gift },
  ];

  return (
    <motion.div
      className="wallet-page"
      id="wallet-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="wallet-page__content container">
        <h1 className="wallet-page__title">
          <Wallet size={28} /> My Wallet
        </h1>

        {/* Page tabs */}
        <div className="wallet-page-tabs" id="wallet-page-tabs">
          {pageTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                className={`wallet-page-tab ${pageTab === tab.key ? 'active' : ''}`}
                onClick={() => setPageTab(tab.key)}
                id={`wallet-tab-${tab.key}`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══════════════════ WALLET TAB ═══════════════════ */}
          {pageTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Balance Card */}
              <motion.div
                className="wallet-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="wallet-balance__left">
                  <span className="wallet-balance__label">Available Balance</span>
                  <span className="wallet-balance__amount">
                    <IndianRupee size={28} />
                    {balance.toLocaleString('en-IN')}
                  </span>
                  <span className="wallet-balance__sub">+ ₹150 cashback pending</span>
                </div>
                <div className="wallet-balance__actions">
                  <button
                    className="wallet-balance__btn wallet-balance__btn--add"
                    onClick={() => setShowTopUp(!showTopUp)}
                  >
                    <Plus size={16} /> Add Money
                  </button>
                  <button className="wallet-balance__btn wallet-balance__btn--pay">
                    <CreditCard size={16} /> Pay
                  </button>
                </div>
              </motion.div>

              {/* Top-up modal */}
              {showTopUp && (
                <motion.div
                  className="wallet-topup"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <h3>Quick Top-up</h3>
                  <div className="wallet-topup__amounts">
                    {[100, 200, 500, 1000, 2000].map((amt) => (
                      <button key={amt} className="wallet-topup__chip">₹{amt}</button>
                    ))}
                  </div>
                  <button className="wallet-topup__confirm">
                    <Plus size={14} /> Add to Wallet
                  </button>
                </motion.div>
              )}

              <div className="wallet-page__grid">
                {/* Transactions */}
                <section className="wallet-txns">
                  <div className="wallet-txns__header">
                    <h2><Clock size={20} /> Transaction History</h2>
                    <div className="wallet-txns__tabs">
                      {['all', 'credit', 'debit'].map((tab) => (
                        <button
                          key={tab}
                          className={`wallet-txns__tab ${activeTab === tab ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab === 'all' ? 'All' : tab === 'credit' ? 'Added' : 'Spent'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="wallet-txns__list">
                    {filteredTxns.map((txn, i) => (
                      <motion.div
                        key={txn.id}
                        className="wallet-txn"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className={`wallet-txn__icon wallet-txn__icon--${txn.type}`}>
                          {txn.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div className="wallet-txn__info">
                          <span className="wallet-txn__label">{txn.label}</span>
                          <span className="wallet-txn__date">{txn.date}</span>
                        </div>
                        <div className="wallet-txn__right">
                          <span className={`wallet-txn__amount wallet-txn__amount--${txn.type}`}>
                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                          </span>
                          <CheckCircle size={12} className="wallet-txn__status" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Quick rewards sidebar */}
                <section className="wallet-rewards-mini">
                  <h2><Gift size={20} /> Rewards</h2>
                  <div className="wallet-rewards-mini__points">
                    <TrendingUp size={18} />
                    <span>{currentPoints} Points Earned</span>
                  </div>
                  <div className="wallet-rewards-mini__tier">
                    <currentTier.icon size={16} style={{ color: currentTier.color }} />
                    <span>{currentTier.name} Member</span>
                  </div>
                  <button
                    className="wallet-rewards-mini__cta"
                    onClick={() => setPageTab('rewards')}
                  >
                    View All Rewards <ChevronRight size={14} />
                  </button>
                </section>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ REWARDS TAB ═══════════════════ */}
          {pageTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="rewards-section"
            >
              {/* Tier card */}
              <div className="rewards-tier-card">
                <div className="rewards-tier-card__header">
                  <div className="rewards-tier-card__current">
                    <div className="rewards-tier-card__icon" style={{ background: `linear-gradient(135deg, ${currentTier.color}, ${currentTier.color}88)` }}>
                      <currentTier.icon size={28} />
                    </div>
                    <div>
                      <span className="rewards-tier-card__label">Current Tier</span>
                      <h2 className="rewards-tier-card__name" style={{ color: currentTier.color }}>{currentTier.name}</h2>
                    </div>
                  </div>
                  <div className="rewards-tier-card__points-display">
                    <span className="rewards-tier-card__points-value">{currentPoints}</span>
                    <span className="rewards-tier-card__points-label">Points</span>
                  </div>
                </div>

                {nextTier && (
                  <div className="rewards-tier-card__progress">
                    <div className="rewards-tier-card__progress-info">
                      <span>{currentPoints} / {nextTier.minPoints} pts</span>
                      <span>{nextTier.minPoints - currentPoints} pts to {nextTier.name}</span>
                    </div>
                    <div className="rewards-tier-card__progress-bar">
                      <motion.div
                        className="rewards-tier-card__progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNext}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{ background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tier ladder */}
              <div className="rewards-tiers">
                <h3 className="rewards-section__subtitle"><Crown size={18} /> Membership Tiers</h3>
                <div className="rewards-tiers__grid">
                  {rewardTiers.map((tier, i) => {
                    const TierIcon = tier.icon;
                    const isActive = i === currentTierIdx;
                    const isLocked = i > currentTierIdx;
                    return (
                      <motion.div
                        key={tier.name}
                        className={`rewards-tier ${isActive ? 'rewards-tier--active' : ''} ${isLocked ? 'rewards-tier--locked' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="rewards-tier__header" style={{ borderColor: isLocked ? 'var(--border)' : tier.color }}>
                          <div className="rewards-tier__icon-wrap" style={{ background: isLocked ? 'var(--bg-elevated)' : `${tier.color}20`, color: isLocked ? 'var(--text-muted)' : tier.color }}>
                            {isLocked ? <Lock size={20} /> : <TierIcon size={20} />}
                          </div>
                          <h4 style={{ color: isLocked ? 'var(--text-muted)' : tier.color }}>{tier.name}</h4>
                          <span className="rewards-tier__min">{tier.minPoints}+ pts</span>
                        </div>
                        <ul className="rewards-tier__perks">
                          {tier.perks.map((perk) => (
                            <li key={perk}>
                              <CheckCircle size={12} style={{ color: isLocked ? 'var(--text-muted)' : 'var(--seat-available)' }} />
                              {perk}
                            </li>
                          ))}
                        </ul>
                        {isActive && <span className="rewards-tier__badge">Current</span>}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Milestones */}
              <div className="rewards-milestones">
                <h3 className="rewards-section__subtitle"><Award size={18} /> Milestones</h3>
                <div className="rewards-milestones__grid">
                  {milestones.map((m, i) => {
                    const MIcon = m.icon;
                    return (
                      <motion.div
                        key={m.title}
                        className={`rewards-milestone ${m.earned ? 'rewards-milestone--earned' : ''}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className={`rewards-milestone__icon ${m.earned ? 'rewards-milestone__icon--earned' : ''}`}>
                          <MIcon size={20} />
                        </div>
                        <div className="rewards-milestone__info">
                          <span className="rewards-milestone__title">{m.title}</span>
                          <span className="rewards-milestone__pts">+{m.points} pts</span>
                          {!m.earned && m.progress !== undefined && (
                            <div className="rewards-milestone__prog">
                              <div className="rewards-milestone__prog-bar">
                                <div
                                  className="rewards-milestone__prog-fill"
                                  style={{ width: `${(m.progress / m.goal) * 100}%` }}
                                />
                              </div>
                              <span className="rewards-milestone__prog-text">{m.progress}/{m.goal}</span>
                            </div>
                          )}
                        </div>
                        {m.earned && (
                          <span className="rewards-milestone__check">
                            <CheckCircle size={18} />
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Redeemable Offers */}
              <div className="rewards-redeem">
                <h3 className="rewards-section__subtitle"><ShoppingBag size={18} /> Redeem Points</h3>
                <div className="rewards-redeem__grid">
                  {redeemableOffers.map((offer, i) => {
                    const canRedeem = currentPoints >= offer.points;
                    return (
                      <motion.div
                        key={offer.id}
                        className={`rewards-offer ${!canRedeem ? 'rewards-offer--locked' : ''}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <span className="rewards-offer__emoji">{offer.icon}</span>
                        <h4 className="rewards-offer__title">{offer.title}</h4>
                        <p className="rewards-offer__desc">{offer.description}</p>
                        <div className="rewards-offer__footer">
                          <span className="rewards-offer__cost">
                            <Star size={12} /> {offer.points} pts
                          </span>
                          <button
                            className={`rewards-offer__btn ${canRedeem ? '' : 'rewards-offer__btn--disabled'}`}
                            disabled={!canRedeem}
                          >
                            {canRedeem ? 'Redeem' : 'Need more pts'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ GIFT CARDS TAB ═══════════════════ */}
          {pageTab === 'giftcards' && (
            <motion.div
              key="giftcards"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="giftcards-section"
            >
              <div className="giftcards-layout">
                {/* Send a gift card */}
                <div className="giftcard-send">
                  <h3 className="giftcard-send__title"><Send size={18} /> Send a Gift Card</h3>
                  <p className="giftcard-send__subtitle">Choose a design, amount, and send joy to someone special</p>

                  {/* Designs */}
                  <div className="giftcard-designs">
                    <label className="giftcard-designs__label">Choose Design</label>
                    <div className="giftcard-designs__grid">
                      {giftCardDesigns.map((d) => (
                        <button
                          key={d.id}
                          className={`giftcard-design ${selectedDesign === d.id ? 'giftcard-design--selected' : ''}`}
                          onClick={() => setSelectedDesign(d.id)}
                          style={{ background: d.gradient }}
                        >
                          <span className="giftcard-design__emoji">{d.emoji}</span>
                          <span className="giftcard-design__label">{d.label}</span>
                          {selectedDesign === d.id && (
                            <span className="giftcard-design__check"><Check size={14} /></span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="giftcard-preview">
                    <div
                      className="giftcard-preview__card"
                      style={{ background: giftCardDesigns.find((d) => d.id === selectedDesign)?.gradient }}
                    >
                      <div className="giftcard-preview__top">
                        <span className="giftcard-preview__brand">CinePass</span>
                        <Gift size={20} />
                      </div>
                      <span className="giftcard-preview__emoji">
                        {giftCardDesigns.find((d) => d.id === selectedDesign)?.emoji}
                      </span>
                      <div className="giftcard-preview__bottom">
                        <span className="giftcard-preview__label">Gift Card</span>
                        <span className="giftcard-preview__amount">₹{selectedAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="giftcard-amounts">
                    <label className="giftcard-amounts__label">Select Amount</label>
                    <div className="giftcard-amounts__grid">
                      {giftCardAmounts.map((amt) => (
                        <button
                          key={amt}
                          className={`giftcard-amount ${selectedAmount === amt ? 'giftcard-amount--selected' : ''}`}
                          onClick={() => setSelectedAmount(amt)}
                        >
                          ₹{amt.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="giftcard-form">
                    <div className="giftcard-form__field">
                      <label><Mail size={14} /> Recipient's Email</label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="friend@email.com"
                      />
                    </div>
                    <div className="giftcard-form__field">
                      <label><Heart size={14} /> Personal Message (optional)</label>
                      <textarea
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Enjoy a movie night on me! 🎬"
                        rows={3}
                      />
                    </div>
                  </div>

                  <button className="giftcard-send__btn" id="giftcard-send-btn">
                    <Send size={16} />
                    Send Gift Card — ₹{selectedAmount.toLocaleString('en-IN')}
                  </button>
                </div>

                {/* Right sidebar */}
                <div className="giftcard-sidebar">
                  {/* Redeem */}
                  <div className="giftcard-redeem">
                    <h3><Tag size={18} /> Redeem a Gift Card</h3>
                    <p className="giftcard-redeem__hint">Enter a gift card code to add funds to your wallet</p>
                    <div className="giftcard-redeem__input-wrap">
                      <input
                        type="text"
                        value={redeemCode}
                        onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                        placeholder="XXXX-XXXX-XXXX"
                        maxLength={14}
                        className="giftcard-redeem__input"
                      />
                      <button className="giftcard-redeem__btn" disabled={redeemCode.length < 10}>
                        Redeem
                      </button>
                    </div>
                  </div>

                  {/* Sent gift cards */}
                  <div className="giftcard-history">
                    <h3><Clock size={18} /> Sent Gift Cards</h3>
                    {sentGiftCards.length === 0 ? (
                      <p className="giftcard-history__empty">No gift cards sent yet</p>
                    ) : (
                      <div className="giftcard-history__list">
                        {sentGiftCards.map((gc) => (
                          <div key={gc.id} className="giftcard-history__item">
                            <div
                              className="giftcard-history__item-icon"
                              style={{ background: giftCardDesigns.find((d) => d.id === gc.design)?.gradient }}
                            >
                              {giftCardDesigns.find((d) => d.id === gc.design)?.emoji}
                            </div>
                            <div className="giftcard-history__item-info">
                              <span className="giftcard-history__item-to">To: {gc.to}</span>
                              <span className="giftcard-history__item-date">{gc.date}</span>
                            </div>
                            <div className="giftcard-history__item-right">
                              <span className="giftcard-history__item-amount">₹{gc.amount}</span>
                              <span className={`giftcard-history__item-status ${gc.redeemed ? 'redeemed' : 'pending'}`}>
                                {gc.redeemed ? 'Redeemed' : 'Pending'}
                              </span>
                            </div>
                            <button
                              className="giftcard-history__item-copy"
                              onClick={() => copyCode(gc.id)}
                              title="Copy code"
                            >
                              {copiedCode === gc.id ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


export default WalletPage;
