// Use environment variable for API URL, fallback to relative path for production
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export interface Video {
  id: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  shares: number;
  thumbnail: string;
  duration: number;
  isLiked: boolean;
  description?: string;
  uploadDate: string;
}

export interface UploadResponse {
  success: boolean;
  videoId: string;
  message: string;
}

export interface LikeResponse {
  liked: boolean;
  message: string;
}

class ApiService {
  // Get all videos
  async getVideos(username?: string): Promise<Video[]> {
    const url = username 
      ? `${API_BASE_URL}/videos?username=${encodeURIComponent(username)}`
      : `${API_BASE_URL}/videos`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return response.json();
  }

  // Get trending videos
  async getTrendingVideos(): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos/trending`);
    if (!response.ok) {
      throw new Error('Failed to fetch trending videos');
    }
    return response.json();
  }

  // Get weekly winners
  async getWeeklyWinners(): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/winners/weekly`);
    if (!response.ok) {
      throw new Error('Failed to fetch weekly winners');
    }
    return response.json();
  }

  // Upload video
  async uploadVideo(
    file: File, 
    title: string, 
    description: string, 
    username: string
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('username', username);

    const response = await fetch(`${API_BASE_URL}/videos`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload video');
    }

    return response.json();
  }

  // Like/unlike video
  async toggleLike(videoId: string, username: string): Promise<LikeResponse> {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to like video');
    }

    return response.json();
  }

  // Get user's videos
  async getUserVideos(username: string): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(username)}/videos`);
    if (!response.ok) {
      throw new Error('Failed to fetch user videos');
    }
    return response.json();
  }
}

export const apiService = new ApiService(); 