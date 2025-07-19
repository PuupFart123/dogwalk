import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import TrendingSection from '../components/TrendingSection';
import { apiService, Video } from '../services/api';
import './HomePage.css';



const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const fetchedVideos = await apiService.getVideos();
      setVideos(fetchedVideos);
    } catch (err) {
      setError('Failed to load videos');
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId: string) => {
    try {
      const response = await apiService.toggleLike(videoId, 'demo_user');
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              likes: response.liked ? video.likes + 1 : video.likes - 1, 
              isLiked: response.liked 
            }
          : video
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  return (
    <div className="homepage">
      <div className="homepage-container">
        {/* Hero Section with 30-second limit notice */}
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-content">
            <h1 className="hero-title">
              Capture the World Through Dog Walks
            </h1>
            <p className="hero-subtitle">
              Share the atmosphere and vibe of your city, town, or countryside through 30-second dog walk videos
            </p>
            <div className="video-limit-notice">
              <Clock size={20} />
              <span>Videos must be 30 seconds or shorter</span>
            </div>
          </div>
        </motion.div>

        <div className="content-grid">
          {/* Main Video Feed */}
          <div className="video-feed">
            <div className="feed-header">
              <h2>Global Dog Walks</h2>
              <TrendingUp size={20} />
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading global dog walks...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={loadVideos} className="retry-btn">Try Again</button>
              </div>
            ) : videos.length === 0 ? (
              <div className="empty-state">
                <p>No videos yet. Be the first to upload a dog walk!</p>
              </div>
            ) : (
              <div className="videos-grid">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <VideoCard 
                      video={video} 
                      onLike={handleLike}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <TrendingSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 