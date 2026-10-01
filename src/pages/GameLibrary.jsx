// pages/GameLibrary.jsx
import React, { useState } from 'react';
import { games } from '../data/games';
import GameCard from '../components/GameCard';
import './GameLibrary.css';

const GameLibrary = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  const ownedGames = games.slice(0, 6);
  const installedGames = games.slice(0, 3);

  const filters = [
    { id: 'all', label: 'All Games', count: ownedGames.length },
    { id: 'installed', label: 'Installed', count: installedGames.length },
    { id: 'favorites', label: 'Favorites', count: 3 },
    { id: 'recent', label: 'Recently Played', count: 4 },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Recently Played' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'hours', label: 'Hours Played' },
    { value: 'rating', label: 'Rating' },
  ];

  return (
    <div className="library">
      <div className="library-header">
        <div>
          <h1 className="page-title">My Library</h1>
          <p className="page-subtitle">{ownedGames.length} games in your collection</p>
        </div>
        <div className="library-stats">
          <div className="lib-stat">
            <span className="lib-stat-value">247</span>
            <span className="lib-stat-label">Hours Played</span>
          </div>
          <div className="lib-stat">
            <span className="lib-stat-value">156</span>
            <span className="lib-stat-label">Achievements</span>
          </div>
        </div>
      </div>

      <div className="library-toolbar">
        <div className="filter-tabs">
          {filters.map(f => (
            <button
              key={f.id}
              className={`filter-tab ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="filter-count">{f.count}</span>
            </button>
          ))}
        </div>

        <div className="toolbar-actions">
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ▦
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div className={`grid ${viewMode === 'grid' ? 'grid-3' : ''}`}>
        {ownedGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default GameLibrary;