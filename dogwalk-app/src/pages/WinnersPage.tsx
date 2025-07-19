import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, DollarSign, Gift, Calendar, Share2 } from 'lucide-react';
import './WinnersPage.css';

interface Winner {
  id: string;
  rank: number;
  title: string;
  username: string;
  likes: number;
  comments: number;
  shares: number;
  prize: string;
  thumbnail: string;
  week: string;
}

const WinnersPage: React.FC = () => {
  const currentWinners: Winner[] = [
    {
      id: '1',
      rank: 1,
      title: 'Night walk under the stars in Tokyo',
      username: 'tokyo_nights',
      likes: 1247,
      comments: 89,
      shares: 234,
      prize: '$500 + Premium Dog Toys',
      thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop',
      week: 'Current Week'
    },
    {
      id: '2',
      rank: 2,
      title: 'Morning fog in the Scottish Highlands',
      username: 'highland_walks',
      likes: 892,
      comments: 156,
      shares: 445,
      prize: '$300 + Dog Toys',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      week: 'Current Week'
    },
    {
      id: '3',
      rank: 3,
      title: 'Sunset stroll through Moroccan streets',
      username: 'marrakech_daily',
      likes: 756,
      comments: 67,
      shares: 123,
      prize: '$200 + Dog Toys',
      thumbnail: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
      week: 'Current Week'
    }
  ];

  const pastWinners: Winner[] = [
    {
      id: '4',
      rank: 1,
      title: 'Rainy evening in Paris',
      username: 'paris_rain',
      likes: 1156,
      comments: 145,
      shares: 289,
      prize: '$500 + Premium Dog Toys',
      thumbnail: 'https://images.unsplash.com/photo-1502602898534-47d6c5c0c0c5?w=400&h=300&fit=crop',
      week: 'Last Week'
    },
    {
      id: '5',
      rank: 1,
      title: 'Desert sunset in Arizona',
      username: 'desert_walks',
      likes: 1345,
      comments: 234,
      shares: 456,
      prize: '$500 + Premium Dog Toys',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      week: '2 Weeks Ago'
    }
  ];

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const handleShare = (winner: Winner) => {
    const text = `Congratulations to @${winner.username} for winning ${winner.prize} with their amazing dog walk video! 🐕✨`;
    if (navigator.share) {
      navigator.share({
        title: 'DogWalk.com Winner',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Winner announcement copied to clipboard!');
    }
  };

  return (
    <div className="winners-page">
      <div className="winners-container">
        {/* Hero Section */}
        <motion.div 
          className="winners-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-content">
            <Trophy size={64} className="hero-icon" />
            <h1>Weekly Winners</h1>
            <p>Celebrating the most atmospheric dog walk videos from around the world</p>
          </div>
        </motion.div>

        {/* Prize Information */}
        <motion.div 
          className="prize-info-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="prize-card">
            <div className="prize-header">
              <DollarSign size={32} />
              <h2>This Week's Prizes</h2>
            </div>
            <div className="prize-list">
              <div className="prize-item">
                <span className="prize-rank">🥇 1st Place</span>
                <span className="prize-amount">$500 + Premium Dog Toys</span>
              </div>
              <div className="prize-item">
                <span className="prize-rank">🥈 2nd Place</span>
                <span className="prize-amount">$300 + Dog Toys</span>
              </div>
              <div className="prize-item">
                <span className="prize-rank">🥉 3rd Place</span>
                <span className="prize-amount">$200 + Dog Toys</span>
              </div>
            </div>
            <div className="contest-info">
              <Calendar size={16} />
              <span>Contest ends every Sunday at 11:59 PM EST</span>
            </div>
          </div>
        </motion.div>

        {/* Current Week Winners */}
        <motion.div 
          className="winners-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Current Week Winners</h2>
          <div className="winners-grid">
            {currentWinners.map((winner, index) => (
              <motion.div 
                key={winner.id}
                className="winner-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div className="winner-rank-badge">
                  {getRankEmoji(winner.rank)}
                </div>
                <div className="winner-thumbnail">
                  <img src={winner.thumbnail} alt={winner.title} />
                </div>
                <div className="winner-content">
                  <h3>{winner.title}</h3>
                  <p className="winner-username">by @{winner.username}</p>
                  
                                     <div className="winner-stats">
                     <div className="stat">
                       <span>❤️ {winner.likes} likes</span>
                     </div>
                     <div className="stat">
                       <span>💬 {winner.comments} comments</span>
                     </div>
                     <div className="stat">
                       <span>📤 {winner.shares} shares</span>
                     </div>
                   </div>
                  
                  <div className="winner-prize">
                    <Gift size={16} />
                    <span>{winner.prize}</span>
                  </div>
                  
                  <button 
                    className="share-btn"
                    onClick={() => handleShare(winner)}
                  >
                    <Share2 size={16} />
                    Share Winner
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Past Winners */}
        <motion.div 
          className="winners-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>Past Winners</h2>
          <div className="past-winners-list">
            {pastWinners.map((winner, index) => (
              <motion.div 
                key={winner.id}
                className="past-winner-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <div className="past-winner-rank">
                  {getRankEmoji(winner.rank)}
                </div>
                <div className="past-winner-thumbnail">
                  <img src={winner.thumbnail} alt={winner.title} />
                </div>
                <div className="past-winner-info">
                  <h4>{winner.title}</h4>
                  <p>by @{winner.username}</p>
                                     <div className="past-winner-meta">
                     <span className="week-label">{winner.week}</span>
                     <span className="engagement-score">❤️ {winner.likes} likes</span>
                   </div>
                </div>
                <div className="past-winner-prize">
                  <span>{winner.prize}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WinnersPage; 