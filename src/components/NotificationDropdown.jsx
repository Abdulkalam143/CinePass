/**
 * NotificationDropdown — Premium sliding dropdown listing Alerts and Offers
 * Supporting filtering, individual dismissals, mark all as read, and clipboard coupon copying.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Tag, Info, CreditCard, Sparkles,
  ShieldAlert, Percent, Gift, Trash2,
  Copy, Check, X, BellOff
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import './NotificationDropdown.css';

const iconMap = {
  welcome: Sparkles,
  verify: ShieldAlert,
  wallet: CreditCard,
  discount: Tag,
  bogo: Gift,
  combo: Percent,
};

const NotificationDropdown = ({
  notifications,
  onMarkRead,
  onDismiss,
  onMarkAllRead,
  onClearAll,
  onClose
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all'); // all | alert | offer
  const [copiedId, setCopiedId] = useState(null);

  const filteredList = notifications.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const handleCopyCode = (e, code, id) => {
    e.stopPropagation(); // Prevent card selection triggering
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCardClick = (id, read) => {
    if (!read) {
      onMarkRead(id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      className="notification-dropdown"
      id="notification-dropdown"
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="notification-dropdown__header">
        <div className="notification-dropdown__title-wrap">
          <h3>{t('notifications.title')}</h3>
          {unreadCount > 0 && (
            <span className="notification-dropdown__badge">{unreadCount} {t('notifications.new')}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            className="notification-dropdown__action-btn"
            onClick={onMarkAllRead}
          >
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="notification-dropdown__tabs">
        <button
          className={`notification-dropdown__tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t('notifications.all')}
        </button>
        <button
          className={`notification-dropdown__tab ${activeTab === 'alert' ? 'active' : ''}`}
          onClick={() => setActiveTab('alert')}
        >
          {t('notifications.alerts')}
        </button>
        <button
          className={`notification-dropdown__tab ${activeTab === 'offer' ? 'active' : ''}`}
          onClick={() => setActiveTab('offer')}
        >
          {t('notifications.offers')}
        </button>
      </div>

      {/* Content */}
      <div className="notification-dropdown__list">
        <AnimatePresence initial={false}>
          {filteredList.length > 0 ? (
            filteredList.map((item) => {
              const IconComponent = iconMap[item.icon] || Info;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, x: 50 }}
                  transition={{ duration: 0.2 }}
                  className={`notification-item ${item.read ? 'notification-item--read' : ''} ${item.type === 'offer' ? 'notification-item--offer' : ''}`}
                  onClick={() => handleCardClick(item.id, item.read)}
                >
                  <div className="notification-item__icon-wrap">
                    <IconComponent size={16} />
                  </div>
                  
                  <div className="notification-item__body">
                    <div className="notification-item__meta">
                      <span className="notification-item__title">{t(item.titleKey)}</span>
                      <span className="notification-item__date">{item.date}</span>
                    </div>
                    <p className="notification-item__message">{t(item.msgKey)}</p>

                    {/* Offer Voucher box */}
                    {item.type === 'offer' && item.code && (
                      <div className="notification-item__voucher">
                        <span className="notification-item__code">{item.code}</span>
                        <button
                          className={`notification-item__copy-btn ${copiedId === item.id ? 'copied' : ''}`}
                          onClick={(e) => handleCopyCode(e, item.code, item.id)}
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check size={12} />
                              <span>{t('notifications.copied')}</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>{t('notifications.copyCode')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dismiss individual item */}
                  <button
                    className="notification-item__dismiss"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(item.id);
                    }}
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>

                  {!item.read && <span className="notification-item__dot" />}
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="notification-dropdown__empty"
            >
              <BellOff size={32} />
              <p>{t('notifications.noNotifications')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="notification-dropdown__footer">
          <button
            className="notification-dropdown__clear-all"
            onClick={onClearAll}
          >
            <Trash2 size={12} />
            <span>{t('notifications.clearAll')}</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationDropdown;
