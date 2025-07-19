import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Video, Trophy, Heart, Share2, Edit, Settings, LogOut } from 'lucide-react';
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
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user from localStorage for comparison
        const userData = localStorage.getItem('dogwalk_user');
        const currentUser = userData ? JSON.parse(userData) : null;
        setIsCurrentUser(currentUser?.username === username);

        // Fetch real user data from API
        const response = await fetch(`/api/users/${username}`);
        if (!response.ok) {
          throw new Error('User not found');
        }

        const userProfile = await response.json();
        
        setUser({
          ...userProfile,
          displayName: userProfile.username,
          avatar: userProfile.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          joinDate: new Date(userProfile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });

        // Fetch user's videos
        const videosResponse = await fetch(`/api/users/${username}/videos`);
        if (videosResponse.ok) {
          const videos = await videosResponse.json();
          setUserVideos(videos);
        }

        // Set achievements from API response
        setAchievements(userProfile.achievements || []);

             } catch (error) {
         console.error('Error fetching user data:', error);
         const userData = localStorage.getItem('dogwalk_user');
         const currentUser = userData ? JSON.parse(userData) : null;
         
         if (currentUser?.username === username) {
           // If it's the current user but API failed, redirect to login
           navigate('/login');
         } else {
           // For other users, show error or redirect
           navigate('/');
         }
       }
    };

    if (username) {
      fetchUserData();
    }
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('dogwalk_user');
    navigate('/login');
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setUserVideos(user.userVideos || []);
      setAchievements(user.achievementsList || []);
    }
  }, [user]);

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
              <img src={user?.avatar} alt={user?.displayName} />
            </div>
          </div>
          
          <div className="profile-info">
            <div className="profile-main">
              <div className="profile-header-row">
                <div>
                  <h1>@{user?.username}</h1>
                  <h2>{user?.displayName}</h2>
                  <p className="profile-bio">{user?.bio}</p>
                  <p className="join-date">Joined {user?.joinDate}</p>
                </div>
                {isCurrentUser && (
                  <div className="profile-actions">
                    <button className="edit-btn" onClick={handleEditProfile}>
                      <Edit size={16} />
                      Edit Profile
                    </button>
                    <button className="settings-btn">
                      <Settings size={16} />
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                      <LogOut size={16} />
                    </button>
                  </div>
                )}
              </div>
            
            </div>
            
            <div className="profile-stats">
              <div className="stat-item">
                <Video size={20} />
                <div className="stat-content">
                  <span className="stat-number">{user?.videosCount}</span>
                  <span className="stat-label">Videos</span>
                </div>
              </div>
              <div className="stat-item">
                <User size={20} />
                <div className="stat-content">
                  <span className="stat-number">{formatNumber(user?.followers || 0)}</span>
                  <span className="stat-label">Followers</span>
                </div>
              </div>
              <div className="stat-item">
                <Heart size={20} />
                <div className="stat-content">
                  <span className="stat-number">{formatNumber(user?.totalLikes || 0)}</span>
                  <span className="stat-label">Likes</span>
                </div>
              </div>
              <div className="stat-item">
                <Trophy size={20} />
                <div className="stat-content">
                  <span className="stat-number">{user?.achievements}</span>
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