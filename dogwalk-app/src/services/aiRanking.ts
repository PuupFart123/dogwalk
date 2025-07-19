export interface VideoMetrics {
  id: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  uploadDate: string;
  title: string;
  description?: string;
  username: string;
  userReputation: number;
}

export interface RankingScore {
  videoId: string;
  score: number;
  factors: {
    engagement: number;
    virality: number;
    contentQuality: number;
    recency: number;
    userReputation: number;
  };
}

class AIRankingService {
  // Calculate AI ranking score for a video
  calculateRankingScore(video: VideoMetrics): RankingScore {
    const now = new Date();
    const uploadTime = new Date(video.uploadDate);
    const hoursSinceUpload = (now.getTime() - uploadTime.getTime()) / (1000 * 60 * 60);

    // Factor 1: Engagement Rate (likes + comments + shares) / views
    const totalEngagement = video.likes + video.comments + video.shares;
    const engagementRate = video.views > 0 ? totalEngagement / video.views : 0;
    const engagementScore = Math.min(engagementRate * 100, 100);

    // Factor 2: Virality (shares are worth more than likes)
    const viralityScore = Math.min(
      (video.likes * 1 + video.comments * 2 + video.shares * 5) / 100,
      100
    );

    // Factor 3: Content Quality (title length, description quality)
    const titleQuality = this.analyzeTitleQuality(video.title);
    const descriptionQuality = video.description 
      ? this.analyzeDescriptionQuality(video.description)
      : 0;
    const contentQualityScore = (titleQuality + descriptionQuality) / 2;

    // Factor 4: Recency Boost (newer videos get slight boost)
    const recencyScore = Math.max(0, 100 - (hoursSinceUpload * 0.5));

    // Factor 5: User Reputation (users with good track record)
    const userReputationScore = Math.min(video.userReputation * 10, 100);

    // Calculate weighted final score
    const finalScore = (
      engagementScore * 0.35 +
      viralityScore * 0.25 +
      contentQualityScore * 0.15 +
      recencyScore * 0.15 +
      userReputationScore * 0.10
    );

    return {
      videoId: video.id,
      score: Math.round(finalScore * 100) / 100,
      factors: {
        engagement: Math.round(engagementScore * 100) / 100,
        virality: Math.round(viralityScore * 100) / 100,
        contentQuality: Math.round(contentQualityScore * 100) / 100,
        recency: Math.round(recencyScore * 100) / 100,
        userReputation: Math.round(userReputationScore * 100) / 100
      }
    };
  }

  // Analyze title quality
  private analyzeTitleQuality(title: string): number {
    const length = title.length;
    const hasLocation = this.containsLocationKeywords(title);
    const hasAtmosphere = this.containsAtmosphereKeywords(title);
    const hasEmotion = this.containsEmotionKeywords(title);

    let score = 0;

    // Length scoring (optimal: 20-60 characters)
    if (length >= 20 && length <= 60) score += 30;
    else if (length >= 10 && length <= 80) score += 20;
    else if (length >= 5 && length <= 100) score += 10;

    // Content scoring
    if (hasLocation) score += 25;
    if (hasAtmosphere) score += 25;
    if (hasEmotion) score += 20;

    return Math.min(score, 100);
  }

  // Analyze description quality
  private analyzeDescriptionQuality(description: string): number {
    const length = description.length;
    const hasLocation = this.containsLocationKeywords(description);
    const hasAtmosphere = this.containsAtmosphereKeywords(description);
    const hasStory = this.containsStoryElements(description);

    let score = 0;

    // Length scoring (optimal: 50-200 characters)
    if (length >= 50 && length <= 200) score += 30;
    else if (length >= 20 && length <= 300) score += 20;
    else if (length >= 10 && length <= 500) score += 10;

    // Content scoring
    if (hasLocation) score += 25;
    if (hasAtmosphere) score += 25;
    if (hasStory) score += 20;

    return Math.min(score, 100);
  }

  // Check for location keywords
  private containsLocationKeywords(text: string): boolean {
    const locationKeywords = [
      'tokyo', 'paris', 'london', 'new york', 'morocco', 'scotland', 'highlands',
      'street', 'park', 'beach', 'mountain', 'forest', 'city', 'village',
      'downtown', 'suburb', 'neighborhood', 'district', 'area', 'region'
    ];
    return locationKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  }

  // Check for atmosphere keywords
  private containsAtmosphereKeywords(text: string): boolean {
    const atmosphereKeywords = [
      'night', 'morning', 'sunset', 'sunrise', 'fog', 'mist', 'rain',
      'snow', 'wind', 'quiet', 'busy', 'peaceful', 'vibrant', 'cozy',
      'mysterious', 'romantic', 'energetic', 'calm', 'atmospheric', 'vibe'
    ];
    return atmosphereKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  }

  // Check for emotion keywords
  private containsEmotionKeywords(text: string): boolean {
    const emotionKeywords = [
      'beautiful', 'amazing', 'wonderful', 'magical', 'incredible', 'stunning',
      'peaceful', 'relaxing', 'exciting', 'adventurous', 'romantic', 'cozy',
      'happy', 'joyful', 'serene', 'mysterious', 'enchanting', 'dreamy'
    ];
    return emotionKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  }

  // Check for story elements
  private containsStoryElements(text: string): boolean {
    const storyKeywords = [
      'walk', 'stroll', 'explore', 'discover', 'journey', 'adventure',
      'experience', 'moment', 'memory', 'story', 'tale', 'day', 'evening',
      'morning', 'afternoon', 'weekend', 'holiday', 'vacation', 'trip'
    ];
    return storyKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  }

  // Rank videos by AI score
  rankVideos(videos: VideoMetrics[]): VideoMetrics[] {
    const videosWithScores = videos.map(video => ({
      ...video,
      aiScore: this.calculateRankingScore(video)
    }));

    return videosWithScores
      .sort((a, b) => b.aiScore.score - a.aiScore.score)
      .map(({ aiScore, ...video }) => video);
  }

  // Get trending videos (high AI score + recent)
  getTrendingVideos(videos: VideoMetrics[], limit: number = 10): VideoMetrics[] {
    const now = new Date();
    const recentVideos = videos.filter(video => {
      const uploadTime = new Date(video.uploadDate);
      const hoursSinceUpload = (now.getTime() - uploadTime.getTime()) / (1000 * 60 * 60);
      return hoursSinceUpload <= 168; // Last 7 days
    });

    return this.rankVideos(recentVideos).slice(0, limit);
  }

  // Get weekly winners (highest AI scores)
  getWeeklyWinners(videos: VideoMetrics[], limit: number = 5): VideoMetrics[] {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyVideos = videos.filter(video => 
      new Date(video.uploadDate) >= weekAgo
    );

    return this.rankVideos(weeklyVideos).slice(0, limit);
  }
}

export const aiRankingService = new AIRankingService(); 