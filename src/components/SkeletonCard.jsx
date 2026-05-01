/**
 * SkeletonCard — Loading placeholder with shimmer animation
 */
import './SkeletonCard.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card" id="skeleton-card">
      <div className="skeleton-card__poster skeleton" />
      <div className="skeleton-card__info">
        <div className="skeleton-card__title skeleton" />
        <div className="skeleton-card__meta">
          <div className="skeleton-card__genre skeleton" />
          <div className="skeleton-card__genre skeleton" />
        </div>
        <div className="skeleton-card__btn skeleton" />
      </div>
    </div>
  );
};

export default SkeletonCard;
