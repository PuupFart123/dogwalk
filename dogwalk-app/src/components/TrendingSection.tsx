import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Hash, Trophy } from 'lucide-react';
import { apiService, Video } from '../services/api';
import './TrendingSection.css';

const TrendingSection: React.FC = () => {
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [weeklyWinners, setWeeklyWinners] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const trendingHashtags = [
    '#dogwalk', '#nightwalks', '#cityvibes', '#countryside', '#globalwalks'
  ];

  useEffect(() => {
    loadTrendingData();
  }, []);

  const loadTrendingData = async () => {
    try {
      setLoading(true);
      const [trending, winners] = await Promise.all([
        apiService.getTrendingVideos(),
        apiService.getWeeklyWinners()
      ]);
      setTrendingVideos(trending.slice(0, 3));
      setWeeklyWinners(winners.slice(0, 1)); // Show top winner
    } catch (error) {
      console.error('Error loading trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trending-section">
      {/* Weekly Winners Preview */}
      <motion.div 
        className="trending-card winners-preview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-header">
          <Trophy size={20} />
          <h3>Weekly Winners</h3>
        </div>
        <div className="winners-content">
          {loading ? (
            <div className="loading-winner">
              <div className="spinner"></div>
              <span>Loading winner...</span>
            </div>
          ) : weeklyWinners.length > 0 ? (
            <div className="winner-item">
              <div className="winner-rank">🥇</div>
              <div className="winner-info">
                <span className="winner-title">{weeklyWinners[0].title}</span>
                <span className="winner-username">@{weeklyWinners[0].username}</span>
              </div>
              <div className="winner-likes">
                <span>❤️ {weeklyWinners[0].likes}</span>
              </div>
            </div>
          ) : (
            <div className="no-winner">
              <span>No winners yet this week</span>
            </div>
          )}
          <div className="prize-info">
            <span className="prize-amount">$50 + Dog Toys</span>
            <span className="prize-label">This Week's Prize</span>
          </div>
        </div>
      </motion.div>

      {/* Trending Videos */}
      <motion.div 
        className="trending-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card-header">
          <TrendingUp size={20} />
          <h3>Trending Now</h3>
        </div>
        <div className="trending-list">
          {loading ? (
            <div className="loading-trending">
              <div className="spinner"></div>
              <span>Loading trending...</span>
            </div>
          ) : trendingVideos.length > 0 ? (
            trendingVideos.map((video, index) => (
              <div key={video.id} className="trending-item">
                <div className="trending-rank">#{index + 1}</div>
                <div className="trending-info">
                  <span className="trending-title">{video.title}</span>
                  <span className="trending-username">@{video.username}</span>
                </div>
                <div className="trending-likes">
                  <span>❤️ {video.likes}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-trending">
              <span>No trending videos yet</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Trending Hashtags */}
      <motion.div 
        className="trending-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card-header">
          <Hash size={20} />
          <h3>Trending Tags</h3>
        </div>
        <div className="hashtags-list">
          {trendingHashtags.map((tag, index) => (
            <span key={index} className="hashtag">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TrendingSection; 