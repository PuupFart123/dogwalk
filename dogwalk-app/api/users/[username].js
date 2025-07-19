module.exports = (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;

  // Return mock user profile
  const userProfile = {
    username: username || 'demo_user',
    email: `${username || 'demo'}@example.com`,
    bio: 'Passionate dog lover and walker',
    location: 'San Francisco, CA',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    joinDate: '2024-01-01T00:00:00Z',
    followers: 156,
    following: 89,
    totalLikes: 1247,
    totalViews: 8900,
    totalShares: 234,
    totalComments: 567,
    videos: [
      {
        id: 'user1',
        title: 'Morning Walk in Golden Gate Park',
        description: 'Beautiful morning with my golden retriever',
        thumbnail: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=200&fit=crop',
        duration: 25,
        likes: 42,
        uploadDate: '2024-01-15T10:30:00Z'
      },
      {
        id: 'user2',
        title: 'Beach Adventure',
        description: 'Running on the beach with my energetic border collie',
        thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
        duration: 28,
        likes: 67,
        uploadDate: '2024-01-14T16:45:00Z'
      }
    ],
    achievements: [
      {
        id: 1,
        name: 'First Upload',
        icon: '🎬',
        description: 'Uploaded your first video',
        earnedDate: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'Viral Sensation',
        icon: '🔥',
        description: 'Video reached 1000+ likes',
        earnedDate: '2024-01-10T00:00:00Z'
      }
    ]
  };

  res.json(userProfile);
}; 