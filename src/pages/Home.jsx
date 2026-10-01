// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { games } from '../data/games';
import GameCard from '../components/GameCard';
import './Home.css';

const Home = () => {
  const featuredGames = games.filter(game => game.featured);
  const trendingGames = games.slice(0, 4);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">🎮 Welcome to GameHub</span>
            <h1 className="hero-title">
              Level Up Your
              <span className="gradient-text"> Gaming Experience</span>
            </h1>
            <p className="hero-description">
              Discover, play, and connect with millions of gamers worldwide. 
              Your ultimate gaming destination awaits.
            </p>
            <div className="hero-buttons">
              <Link to="/store" className="btn btn-primary btn-lg">
                Browse Store
              </Link>
              <Link to="/library" className="btn btn-secondary btn-lg">
                My Library
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">10K+</span>
                <span className="stat-label">Games</span>
              </div>
              <div className="stat">
                <span className="stat-value">5M+</span>
                <span className="stat-label">Players</span>
              </div>
              <div className="stat">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-glow"></div>
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop" 
              alt="Gaming"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Games</h2>
            <p className="section-subtitle">Handpicked games just for you</p>
          </div>
          <Link to="/store" className="view-all">View All →</Link>
        </div>
        <div className="grid grid-3">
          {featuredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Trending Now</h2>
            <p className="section-subtitle">What everyone is playing</p>
          </div>
          <Link to="/store" className="view-all">View All →</Link>
        </div>
        <div className="grid grid-4">
          {trendingGames.map(game => (
            <GameCard key={game.id} game={game} compact />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Join the Community</h2>
          <p>Connect with millions of gamers, share your experiences, and make new friends.</p>
          <Link to="/community" className="btn btn-primary btn-lg">
            Explore Community
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;