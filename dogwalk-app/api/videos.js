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

  // Return mock videos for demo
  const mockVideos = [
    {
      id: '1',
      title: 'Morning Walk in Central Park',
      description: 'Beautiful morning walk with my golden retriever',
      username: 'doglover123',
      thumbnail: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=200&fit=crop',
      duration: 25,
      likes: 42,
      uploadDate: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Beach Adventure with Max',
      description: 'Running on the beach with my energetic border collie',
      username: 'beachwalker',
      thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
      duration: 28,
      likes: 67,
      uploadDate: '2024-01-14T16:45:00Z'
    }
  ];

  res.json(mockVideos);
}; 