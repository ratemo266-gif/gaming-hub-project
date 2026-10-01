// pages/Community.jsx
import React, { useState } from 'react';
import './Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');

  const posts = [
    {
      id: 1,
      user: 'ProGamer99',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer99',
      content: 'Just beat Cyber Odyssey on hardcore mode! What an incredible experience. The ending had me in tears 😭',
      game: 'Cyber Odyssey',
      time: '2 hours ago',
      likes: 234,
      comments: 45,
    },
    {
      id: 2,
      user: 'NightOwl',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NightOwl',
      content: 'Looking for squad members for Dragon Realm raid tonight! Level 50+ preferred. DM me!',
      game: 'Dragon Realm',
      time: '5 hours ago',
      likes: 89,
      comments: 67,
    },
    {
      id: 3,
      user: 'SpeedDemon',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpeedDemon',
      content: 'New world record on Racing Evolution! 1:23.456 on the Tokyo track. Can anyone beat it? 🏎️',
      game: 'Racing Evolution',
      time: '1 day ago',
      likes: 456,
      comments: 123,
    },
  ];

  const topPlayers = [
    { rank: 1, name: 'GameMaster42', score: 15420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GameMaster42' },
    { rank: 2, name: 'ProGamer99', score: 14890, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer99' },
    { rank: 3, name: 'NightOwl', score: 14230, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NightOwl' },
    { rank: 4, name: 'SpeedDemon', score: 13560, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpeedDemon' },
    { rank: 5, name: 'CasualPlayer', score: 12890, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CasualPlayer' },
  ];

  const tabs = [
    { id: 'feed', label: 'Feed' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'friends', label: 'Friends' },
  ];

  return (
    <div className="community">
      <div className="community-header">
        <h1 className="page-title">Community</h1>
        <p className="page-subtitle">Connect with gamers worldwide</p>
      </div>

      <div className="community-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`community-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="community-content">
        {activeTab === 'feed' && (
          <div className="feed">
            <div className="create-post">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=GameMaster42" 
                alt="User"
                className="post-avatar"
              />
              <input
                type="text"
                placeholder="Share your gaming moments..."
                className="post-input"
              />
              <button className="btn btn-primary">Post</button>
            </div>

            {posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <img src={post.avatar} alt={post.user} className="post-avatar" />
                  <div className="post-user-info">
                    <span className="post-user">{post.user}</span>
                    <span className="post-time">{post.time}</span>
                  </div>
                  {post.game && (
                    <span className="post-game">🎮 {post.game}</span>
                  )}
                </div>
                <p className="post-content">{post.content}</p>
                <div className="post-actions">
                  <button className="post-action">❤️ {post.likes}</button>
                  <button className="post-action">💬 {post.comments}</button>
                  <button className="post-action">🔗 Share</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard">
            <h2>Top Players This Week</h2>
            <div className="leaderboard-list">
              {topPlayers.map(player => (
                <div key={player.rank} className={`leaderboard-item rank-${player.rank}`}>
                  <span className="leaderboard-rank">
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                  </span>
                  <img src={player.avatar} alt={player.name} className="leaderboard-avatar" />
                  <span className="leaderboard-name">{player.name}</span>
                  <span className="leaderboard-score">{player.score.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="friends">
            <h2>Your Friends (89)</h2>
            <div className="friends-grid">
              {topPlayers.map((player, i) => (
                <div key={i} className="friend-card">
                  <img src={player.avatar} alt={player.name} className="friend-avatar" />
                  <span className="friend-name">{player.name}</span>
                  <span className={`friend-status ${i % 2 === 0 ? 'online' : 'offline'}`}>
                    {i % 2 === 0 ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;