// pages/Store.jsx
import React, { useState, useMemo } from 'react';
import { games, genres, platforms } from '../data/games';
import GameCard from '../components/GameCard';
import './Store.css';

const Store = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredGames = useMemo(() => {
    let filtered = [...games];

    if (selectedGenre !== 'All') {
      filtered = filtered.filter(g => g.genre === selectedGenre);
    }

    if (selectedPlatform !== 'All') {
      filtered = filtered.filter(g => g.platform.includes(selectedPlatform));
    }

    if (priceRange === 'free') {
      filtered = filtered.filter(g => g.price === 0);
    } else if (priceRange === 'under20') {
      filtered = filtered.filter(g => g.price < 20);
    } else if (priceRange === '20to50') {
      filtered = filtered.filter(g => g.price >= 20 && g.price <= 50);
    } else if (priceRange === 'over50') {
      filtered = filtered.filter(g => g.price > 50);
    }

    if (searchQuery) {
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedGenre, selectedPlatform, priceRange, searchQuery, sortBy]);

  return (
    <div className="store">
      <div className="store-header">
        <h1 className="page-title">Game Store</h1>
        <p className="page-subtitle">Discover your next adventure</p>
      </div>

      <div className="store-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="store-filters">
        <div className="filter-group">
          <label>Genre</label>
          <div className="filter-options">
            {genres.map(genre => (
              <button
                key={genre}
                className={`filter-chip ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Platform</label>
          <div className="filter-options">
            {platforms.map(platform => (
              <button
                key={platform}
                className={`filter-chip ${selectedPlatform === platform ? 'active' : ''}`}
                onClick={() => setSelectedPlatform(platform)}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Price</label>
          <div className="filter-options">
            {[
              { value: 'all', label: 'All' },
              { value: 'free', label: 'Free' },
              { value: 'under20', label: 'Under $20' },
              { value: '20to50', label: '$20 - $50' },
              { value: 'over50', label: 'Over $50' },
            ].map(opt => (
              <button
                key={opt.value}
                className={`filter-chip ${priceRange === opt.value ? 'active' : ''}`}
                onClick={() => setPriceRange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="store-results-header">
        <span className="results-count">{filteredGames.length} games found</span>
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {filteredGames.length > 0 ? (
        <div className="grid grid-3">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <span className="no-results-icon">🎮</span>
          <h3>No games found</h3>
          <p>Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default Store;