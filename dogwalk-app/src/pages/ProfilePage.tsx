import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Video, Trophy, Heart, Share2 } from 'lucide-react';
import './ProfilePage.css';

interface UserVideo {
  id: string;
  title: string;
  thumbnail: string;
  likes: number;
  comments: number;
  shares: number;
  uploadDate: string;
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  
  // Mock user data
  const user = {
    username: username || 'demo_user',
    displayName: 'Yuki Tanaka',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Tokyo-based photographer capturing the city\'s atmosphere through nightly dog walks. Sharing the magic of urban nights! 🌃✨',
    followers: 1247,
    following: 892,
    totalLikes: 5678,
    videosCount: 23,
    achievements: 5,
    joinDate: 'March 2023'
  };

  const userVideos: UserVideo[] = [
    {
      id: '1',
      title: 'Night walk under the stars in Tokyo',
      thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop',
      likes: 1247,
      comments: 89,
      shares: 234,
      uploadDate: '2 days ago'
    },
    {
      id: '2',
      title: 'Morning fog in the Scottish Highlands',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      likes: 892,
      comments: 156,
      shares: 445,
      uploadDate: '1 week ago'
    },
    {
      id: '3',
      title: 'Sunset stroll through Moroccan streets',
      thumbnail: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
      likes: 756,
      comments: 67,
      shares: 123,
      uploadDate: '2 weeks ago'
    }
  ];

  const achievements = [
    { id: 1, name: 'First Upload', icon: '🎬', description: 'Uploaded your first video' },
    { id: 2, name: 'Viral Sensation', icon: '🔥', description: 'Video reached 1000+ likes' },
    { id: 3, name: 'AI Champion', icon: '🤖', description: 'Achieved AI score of 9.0+' },
    { id: 4, name: 'Weekly Winner', icon: '🏆', description: 'Won a weekly contest' },
    { id: 5, name: 'Community Builder', icon: '👥', description: 'Gained 1000+ followers' }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <motion.div 
          className="profile-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-cover">
            <div className="profile-avatar">
              <img src={user.avatar} alt={user.displayName} />
            </div>
          </div>
          
          <div className="profile-info">
            <div className="profile-main">
              <h1>@{user.username}</h1>
              <h2>{user.displayName}</h2>
              <p className="profile-bio">{user.bio}</p>
              <p className="join-date">Joined {user.joinDate}</p>
            </div>
            
            <div className="profile-stats">
              <div className="stat-item">
                <Video size={20} />
                <div className="stat-content">
                  <span className="stat-number">{user.videosCount}</span>
                  <span className="stat-label">Videos</span>
                </div>
              </div>
              <div className="stat-item">
                <User size={20} />
                <div className="stat-content">
                  <span className="stat-number">{formatNumber(user.followers)}</span>
                  <span className="stat-label">Followers</span>
                </div>
              </div>
              <div className="stat-item">
                <Heart size={20} />
                <div className="stat-content">
                  <span className="stat-number">{formatNumber(user.totalLikes)}</span>
                  <span className="stat-label">Likes</span>
                </div>
              </div>
              <div className="stat-item">
                <Trophy size={20} />
                <div className="stat-content">
                  <span className="stat-number">{user.achievements}</span>
                  <span className="stat-label">Achievements</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div 
          className="achievements-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3>Achievements</h3>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={achievement.id}
                className="achievement-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Videos Section */}
        <motion.div 
          className="videos-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="section-header">
            <h3>Videos</h3>
            <button className="upload-new-btn">
              <Video size={16} />
              Upload New
            </button>
          </div>
          
          <div className="videos-grid">
            {userVideos.map((video, index) => (
              <motion.div 
                key={video.id}
                className="video-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                                     <div className="video-overlay">
                     <div className="trending-badge">
                       <span>🔥</span>
                       <span>Popular</span>
                     </div>
                   </div>
                </div>
                
                <div className="video-info">
                  <h4>{video.title}</h4>
                  <div className="video-stats">
                    <span>❤️ {formatNumber(video.likes)}</span>
                    <span>💬 {formatNumber(video.comments)}</span>
                    <span>📤 {formatNumber(video.shares)}</span>
                  </div>
                  <p className="upload-date">{video.uploadDate}</p>
                </div>
                
                <button className="share-video-btn">
                  <Share2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage; 