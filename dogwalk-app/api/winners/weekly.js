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

  // Return mock weekly winners
  const weeklyWinners = [
    {
      id: 'winner1',
      title: 'Beach Morning with Luna',
      description: 'Perfect sunrise walk on the beach',
      username: 'beachlover',
      thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
      duration: 26,
      likes: 342,
      views: 5670,
      uploadDate: '2024-01-10T07:15:00Z',
      aiScore: 9.8,
      prize: '🏆 Weekly Champion'
    },
    {
      id: 'winner2',
      title: 'City Park Adventure',
      description: 'Exploring the urban jungle with Max',
      username: 'citywalker',
      thumbnail: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=200&fit=crop',
      duration: 28,
      likes: 298,
      views: 4230,
      uploadDate: '2024-01-09T16:45:00Z',
      aiScore: 9.5,
      prize: '🥈 Runner Up'
    }
  ];

  res.json(weeklyWinners);
}; 