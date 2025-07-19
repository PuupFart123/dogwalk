import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Play, Clock } from 'lucide-react';
import './VideoCard.css';

interface Video {
  id: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  shares: number;
  thumbnail: string;
  duration: number;
  isLiked: boolean;
}

interface VideoCardProps {
  video: Video;
  onLike: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onLike }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    return `${seconds}s`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Check out this amazing dog walk by ${video.username}!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <motion.div 
      className="video-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="video-thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <div className="video-overlay">
          <div className="play-button">
            <Play size={24} />
          </div>
          <div className="duration-badge">
            <Clock size={12} />
            <span>{formatDuration(video.duration)}</span>
          </div>
        </div>
        
        {/* Trending Badge */}
        <div className="trending-badge">
          <span>🔥</span>
          <span>Trending</span>
        </div>
      </div>

      <div className="video-content">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-username">by @{video.username}</p>
        
        <div className="video-stats">
          <div className="stat-item">
            <span className="stat-number">{formatNumber(video.likes)}</span>
            <span className="stat-label">likes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{formatNumber(video.comments)}</span>
            <span className="stat-label">comments</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{formatNumber(video.shares)}</span>
            <span className="stat-label">shares</span>
          </div>
        </div>

        <div className="video-actions">
          <button 
            className={`action-btn like-btn ${video.isLiked ? 'liked' : ''}`}
            onClick={() => onLike(video.id)}
          >
            <Heart size={20} fill={video.isLiked ? 'currentColor' : 'none'} />
            <span>Like</span>
          </button>
          
          <button className="action-btn">
            <MessageCircle size={20} />
            <span>Comment</span>
          </button>
          
          <button className="action-btn" onClick={handleShare}>
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard; 