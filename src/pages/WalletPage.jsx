/**
 * WalletPage — Digital wallet with balance, transactions, and rewards
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight, Gift, CreditCard,
  TrendingUp, Clock, CheckCircle, IndianRupee,
} from 'lucide-react';
import './WalletPage.css';

// Simulated wallet data
const mockTransactions = [
  { id: 1, type: 'credit', label: 'Wallet Top-up', amount: 500, date: '2026-04-30', status: 'completed' },
  { id: 2, type: 'debit', label: 'Michael — 2 Tickets', amount: 700, date: '2026-04-29', status: 'completed' },
  { id: 3, type: 'credit', label: 'Cashback Reward', amount: 50, date: '2026-04-28', status: 'completed' },
  { id: 4, type: 'debit', label: 'Project Hail Mary — 1 Ticket', amount: 350, date: '2026-04-27', status: 'completed' },
  { id: 5, type: 'credit', label: 'Referral Bonus', amount: 100, date: '2026-04-25', status: 'completed' },
  { id: 6, type: 'debit', label: 'Vaazha II — 3 Tickets', amount: 750, date: '2026-04-24', status: 'completed' },
];

const rewards = [
  { title: 'First Booking', points: 100, earned: true },
  { title: 'Refer a Friend', points: 200, earned: true },
  { title: '5 Movies Watched', points: 500, earned: false },
  { title: 'Premium Member', points: 1000, earned: false },
];

const WalletPage = () => {
  const [balance] = useState(1250);
  const [activeTab, setActiveTab] = useState('all');
  const [showTopUp, setShowTopUp] = useState(false);

  const filteredTxns = activeTab === 'all'
    ? mockTransactions
    : mockTransactions.filter((t) => t.type === activeTab);

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

          {/* Rewards sidebar */}
          <section className="wallet-rewards">
            <h2><Gift size={20} /> Rewards</h2>
            <div className="wallet-rewards__points">
              <TrendingUp size={18} />
              <span>300 Points Earned</span>
            </div>
            <div className="wallet-rewards__list">
              {rewards.map((r) => (
                <div key={r.title} className={`wallet-reward ${r.earned ? 'earned' : ''}`}>
                  <div className="wallet-reward__info">
                    <span className="wallet-reward__title">{r.title}</span>
                    <span className="wallet-reward__pts">{r.points} pts</span>
                  </div>
                  <span className={`wallet-reward__badge ${r.earned ? 'wallet-reward__badge--earned' : ''}`}>
                    {r.earned ? '✓ Earned' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletPage;
