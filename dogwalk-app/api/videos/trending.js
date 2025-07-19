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

  // Return mock trending videos
  const trendingVideos = [
    {
      id: 'trending1',
      title: 'Sunset Walk in Golden Gate Park',
      description: 'Magical evening walk with my husky',
      username: 'sunsetwalker',
      thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
      duration: 27,
      likes: 156,
      views: 2340,
      uploadDate: '2024-01-15T18:30:00Z',
      aiScore: 9.2
    },
    {
      id: 'trending2',
      title: 'Mountain Trail Adventure',
      description: 'Hiking with my border collie in the Rockies',
      username: 'mountainlover',
      thumbnail: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=200&fit=crop',
      duration: 29,
      likes: 203,
      views: 1890,
      uploadDate: '2024-01-14T14:20:00Z',
      aiScore: 8.9
    }
  ];

  res.json(trendingVideos);
}; 