// components/GameCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game, compact = false }) => {
  const discountedPrice = game.discount 
    ? (game.price * (1 - game.discount / 100)).toFixed(2)
    : game.price;

  return (
    <Link to={`/game/${game.id}`} className={`game-card ${compact ? 'compact' : ''}`}>
      <div className="game-image-container">
        <img src={game.image} alt={game.title} className="game-image" />
        {game.discount > 0 && (
          <span className="discount-badge">-{game.discount}%</span>
        )}
        <div className="game-overlay">
          <span className="play-icon">▶</span>
        </div>
      </div>
      <div className="game-info">
        <div className="game-header">
          <h3 className="game-title">{game.title}</h3>
          <div className="game-rating">
            <span className="star">★</span>
            <span>{game.rating}</span>
          </div>
        </div>
        <div className="game-meta">
          <span className="game-genre">{game.genre}</span>
          <div className="game-platforms">
            {game.platform.slice(0, 2).map((p, i) => (
              <span key={i} className="platform-tag">{p}</span>
            ))}
          </div>
        </div>
        <div className="game-price">
          {game.price === 0 ? (
            <span className="free-tag">Free to Play</span>
          ) : (
            <>
              {game.discount > 0 && (
                <span className="original-price">${game.price}</span>
              )}
              <span className="current-price">${discountedPrice}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;