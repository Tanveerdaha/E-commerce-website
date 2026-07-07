import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductRating({ productId, averageRating, ratingCount, userRating, onRate }) {
  const { auth } = useStore();
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const displayRating = userRating || Math.round(averageRating);

  const handleRate = async (value) => {
    if (!auth) return;
    setSubmitting(true);
    setMessage('');
    try {
      await onRate(value);
      setMessage('Thanks for your rating!');
    } catch (err) {
      setMessage(err.message || 'Could not submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-rating-block">
      <div className="product-rating-summary">
        <span className="product-detail-rating">★ {averageRating?.toFixed(1) || '0.0'}</span>
        <span className="product-rating-count">
          {ratingCount ? `(${ratingCount} review${ratingCount === 1 ? '' : 's'})` : '(No reviews yet)'}
        </span>
      </div>

      {auth ? (
        <div className="product-rating-input">
          <p className="product-rating-label">
            {userRating ? 'Your rating:' : 'Rate this product:'}
          </p>
          <div className="product-rating-stars" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="product-rating-star"
                disabled={submitting}
                onMouseEnter={() => setHover(star)}
                onClick={() => handleRate(star)}
                aria-label={`Rate ${star} stars`}
              >
                <FiStar
                  fill={(hover || displayRating) >= star ? '#f59e0b' : 'none'}
                  color={(hover || displayRating) >= star ? '#f59e0b' : '#cbd5e1'}
                />
              </button>
            ))}
          </div>
          {message && <p className="product-rating-message">{message}</p>}
        </div>
      ) : (
        <p className="product-rating-login">
          <Link to={`/login?redirect=/products/${productId}`}>Log in</Link> to rate this product
        </p>
      )}
    </div>
  );
}
