
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { games } from '../data/games';


const GameDetails = () => {
  const { id } = useParams();
  const game = games.find(g => g.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('overview');

  if (!game) {
    return (
      <div className="game-details">
        <div className="not-found">
          <h2>Game not found</h2>
          <Link to="/store" className="btn btn-primary">Back to Store</Link>
        </div>
      </div>
    );
  }

  const discountedPrice = game.discount 
    ? (game.price * (1 - game.discount / 100)).toFixed(2)
    : game.price;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const mockReviews = [
    { id: 1, user: 'ProGamer99', rating: 5, date: '2 days ago', text: 'Absolutely amazing game! The graphics are stunning and the story is captivating.' },
    { id: 2, user: 'NightOwl', rating: 4, date: '1 week ago', text: 'Great gameplay, though it could use some optimization. Overall, highly recommended.' },
    { id: 3, user: 'CasualPlayer', rating: 5, date: '2 weeks ago', text: 'One of the best games I\'ve played this year. Worth every penny!' },
  ];

  return (
    <div className="game-details">
      <div className="game-hero" style={{ backgroundImage: `url(${game.image})` }}>
        <div className="game-hero-overlay"></div>
        <div className="game-hero-content">
          <div className="game-hero-info">
            <span className="game-hero-genre">{game.genre}</span>
            <h1 className="game-hero-title">{game.title}</h1>
            <div className="game-hero-meta">
              <span className="hero-rating">★ {game.rating}</span>
              <span>•</span>
              <span>{game.developer}</span>
              <span>•</span>
              <span>{game.releaseDate}</span>
            </div>
            <div className="game-hero-platforms">
              {game.platform.map((p, i) => (
                <span key={i} className="hero-platform">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="game-details-container">
        <div className="game-main">
          <div className="game-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="game-tab-content">
            {activeTab === 'overview' && (
              <div className="tab-overview">
                <p className="game-description">{game.description}</p>
                <div className="game-features">
                  <h3>Key Features</h3>
                  <ul>
                    <li>Immersive storyline with multiple endings</li>
                    <li>Stunning next-gen graphics</li>
                    <li>Online multiplayer support</li>
                    <li>Regular content updates</li>
                  </ul>
                </div>
                <div className="game-tags">
                  {game.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="tab-details">
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Developer</span>
                    <span className="detail-value">{game.developer}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Release Date</span>
                    <span className="detail-value">{game.releaseDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Genre</span>
                    <span className="detail-value">{game.genre}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Platforms</span>
                    <span className="detail-value">{game.platform.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                <div className="reviews-summary">
                  <div className="reviews-score">
                    <span className="score-value">{game.rating}</span>
                    <div className="score-stars">★★★★★</div>
                    <span className="score-count">Based on 1,234 reviews</span>
                  </div>
                </div>
                <div className="reviews-list">
                  {mockReviews.map(review => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <span className="review-user">{review.user}</span>
                        <span className="review-rating">{'★'.repeat(review.rating)}</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="game-sidebar">
          <div className="purchase-card">
            <div className="purchase-price">
              {game.price === 0 ? (
                <span className="price-free">Free to Play</span>
              ) : (
                <>
                  {game.discount > 0 && (
                    <span className="price-original">${game.price}</span>
                  )}
                  <span className="price-current">${discountedPrice}</span>
                  {game.discount > 0 && (
                    <span className="price-discount">-{game.discount}%</span>
                  )}
                </>
              )}
            </div>
            <button className="btn btn-primary btn-lg buy-btn">
              {game.price === 0 ? 'Play Now' : 'Buy Now'}
            </button>
            <button className="btn btn-secondary btn-lg wishlist-btn">
              ♡ Add to Wishlist
            </button>
          </div>

          <div className="game-meta-card">
            <h3>Game Info</h3>
            <div className="meta-item">
              <span>Developer</span>
              <span>{game.developer}</span>
            </div>
            <div className="meta-item">
              <span>Release Date</span>
              <span>{game.releaseDate}</span>
            </div>
            <div className="meta-item">
              <span>Genre</span>
              <span>{game.genre}</span>
            </div>
            <div className="meta-item">
              <span>Platforms</span>
              <span>{game.platform.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;