// pages/Profile.jsx
import React from 'react';
import { useUser } from '../context/UserContext';
import { games } from '../data/games';
import GameCard from '../components/GameCard';
import './Profile.css';

const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="profile">
        <div className="not-authenticated">
          <h2>Please sign in to view your profile</h2>
        </div>
      </div>
    );
  }

  const xpProgress = (user.xp / user.xpToNext) * 100;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-info">
          <img src={user.avatar} alt={user.username} className="profile-avatar" />
          <div className="profile-details">
            <h1 className="profile-name">{user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-joined">Member since {user.joinDate}</p>
          </div>
          <button className="btn btn-secondary">Edit Profile</button>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="stat-value">{user.level}</span>
          <span className="stat-label">Level</span>
        </div>
        <div className="profile-stat">
          <span className="stat-value">{user.gamesOwned}</span>
          <span className="stat-label">Games Owned</span>
        </div>
        <div className="profile-stat">
          <span className="stat-value">{user.achievements}</span>
          <span className="stat-label">Achievements</span>
        </div>
        <div className="profile-stat">
          <span className="stat-value">{user.friends}</span>
          <span className="stat-label">Friends</span>
        </div>
      </div>

      <div className="profile-xp">
        <div className="xp-header">
          <span>Level Progress</span>
          <span>{user.xp.toLocaleString()} / {user.xpToNext.toLocaleString()} XP</span>
        </div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${xpProgress}%` }}></div>
        </div>
      </div>

      <div className="profile-section">
        <h2>Recent Activity</h2>
        <div className="recent-games">
          {user.recentGames.map(game => (
            <div key={game.id} className="recent-game">
              <span className="recent-game-name">{game.name}</span>
              <span className="recent-game-hours">{game.hoursPlayed}h played</span>
              <span className="recent-game-time">{game.lastPlayed}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h2>Favorite Genres</h2>
        <div className="favorite-genres">
          {user.favoriteGenres.map(genre => (
            <span key={genre} className="genre-tag">{genre}</span>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h2>Recently Played Games</h2>
        <div className="grid grid-4">
          {games.slice(0, 4).map(game => (
            <GameCard key={game.id} game={game} compact />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;