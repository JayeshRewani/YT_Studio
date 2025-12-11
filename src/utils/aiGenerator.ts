const API_BASE_URL = 'http://localhost:5000/api';

export interface GenerationData {
  topic: string;
  videoType: string;
  tone: string;
  maxLength: number;
  keywords: string;
}

export interface GenerationResults {
  titles: Array<{
    title: string;
    score: number;
    emotional: number;
    clarity: number;
    clickbait: number;
  }>;
  description: string;
  tags: Array<{
    tag: string;
    competition: 'high' | 'medium' | 'low';
    trending: boolean;
  }>;
  keywords: Array<{
    keyword: string;
    volume: string;
    difficulty: 'easy' | 'medium' | 'hard';
    trending: boolean;
  }>;
}

export const generateContent = async (data: GenerationData): Promise<GenerationResults> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/generate/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Generation failed');
    }

    return result;
  } catch (error) {
    console.error('Generation error:', error);
    throw error;
  }
};

export const getGenerationHistory = async (): Promise<GenerationResults[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/generate/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch history');
    }

    return result.generations;
  } catch (error) {
    console.error('History fetch error:', error);
    throw error;
  }
};

// Legacy functions for backward compatibility
export const saveGeneration = async (): Promise<void> => {
  // This is now handled by the backend automatically
  return Promise.resolve();
};

export const updateUserCredits = async (): Promise<void> => {
  // This is now handled by the backend automatically
  return Promise.resolve();
};

export const generateTitles = (): string[] => {
  // This is now handled by the backend
  return [];
};

export const generateDescription = (): string => {
  // This is now handled by the backend
  return '';
};

export const generateTags = (): string[] => {
  // This is now handled by the backend
  return [];
};

export const generateKeywords = (): string[] => {
  // This is now handled by the backend
  return [];
};