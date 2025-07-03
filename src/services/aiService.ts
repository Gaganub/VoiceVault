import { AIInsights } from '../types';

// AI Provider interface
export interface AIProvider {
  name: string;
  transcribeAudio?(audioBlob: Blob): Promise<string>;
  analyzeMemory?(content: string, title?: string): Promise<AIInsights>;
  generateInsights?(memories: any[]): Promise<any[]>;
}

// Groq AI Provider (Free with high rate limits)
export class GroqProvider implements AIProvider {
  name = 'Groq';
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Convert audio blob to base64 for Groq API
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-large-v3');
      formData.append('language', 'en');
      formData.append('response_format', 'text');

      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq transcription error:', response.status, errorText);
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        
        throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
      }

      const transcription = await response.text();
      
      if (!transcription || transcription.trim().length === 0) {
        throw new Error('Empty transcription received');
      }

      return transcription.trim();
    } catch (error) {
      console.error('Groq transcription error:', error);
      throw error;
    }
  }

  async analyzeMemory(content: string, title?: string): Promise<AIInsights> {
    try {
      const prompt = `
Analyze this personal memory and return JSON only:

Title: ${title || 'Untitled Memory'}
Content: ${content}

Return this exact JSON structure:
{
  "sentiment": "positive|negative|neutral",
  "keywords": ["key", "words"],
  "suggestedTags": ["tags"],
  "emotionalTone": "tone description",
  "summary": "brief summary",
  "themes": ["themes"],
  "mood": "happy|sad|neutral|excited|reflective",
  "confidence": 0.85
}`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at analyzing personal memories. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
        throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const responseContent = data.choices[0]?.message?.content || '{}';
      
      // Extract JSON from response that might contain additional text
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      
      const result = JSON.parse(jsonString);
      
      return {
        sentiment: result.sentiment || 'neutral',
        keywords: result.keywords || [],
        suggestedTags: result.suggestedTags || [],
        emotionalTone: result.emotionalTone || 'Neutral',
        summary: result.summary || content.substring(0, 100) + '...',
        relatedMemories: [],
        confidence: result.confidence || 0.8,
        themes: result.themes || [],
        mood: result.mood || 'neutral'
      };
    } catch (error) {
      console.error('Groq analysis error:', error);
      throw error;
    }
  }

  async generateInsights(memories: any[]): Promise<any[]> {
    try {
      const memoryData = memories.slice(0, 5).map(m => ({
        title: m.title,
        mood: m.mood,
        tags: m.tags
      }));

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'Generate insights about memory patterns. Return JSON only with this structure: {"insights": [{"type": "pattern", "title": "title", "description": "description", "confidence": 0.8, "actionable": false}]}'
            },
            {
              role: 'user',
              content: `Analyze these memories and return insights as JSON: ${JSON.stringify(memoryData)}`
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
        throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const responseContent = data.choices[0]?.message?.content || '{"insights": []}';
      
      // Extract JSON from response that might contain additional text
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{"insights": []}';
      
      const result = JSON.parse(jsonString);
      return result.insights || [];
    } catch (error) {
      console.error('Groq insights error:', error);
      throw error;
    }
  }
}

// Web Speech API Provider (Browser-based, no API key needed)
export class WebSpeechProvider implements AIProvider {
  name = 'Browser Speech Recognition';

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Check if browser supports Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          throw new Error('Speech Recognition not supported in this browser');
        }

        // Create audio element to play the recorded audio
        const audio = new Audio();
        const audioUrl = URL.createObjectURL(audioBlob);
        audio.src = audioUrl;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        let finalTranscript = '';
        let timeoutId: NodeJS.Timeout;

        recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          cleanup();
          reject(new Error(`Speech recognition failed: ${event.error}`));
        };

        recognition.onend = () => {
          cleanup();
          if (finalTranscript.trim()) {
            resolve(finalTranscript.trim());
          } else {
            reject(new Error('No speech detected in audio'));
          }
        };

        const cleanup = () => {
          if (timeoutId) clearTimeout(timeoutId);
          URL.revokeObjectURL(audioUrl);
          audio.pause();
          audio.src = '';
        };

        // Set timeout for transcription
        timeoutId = setTimeout(() => {
          recognition.stop();
          cleanup();
          reject(new Error('Transcription timeout'));
        }, 30000); // 30 second timeout

        // Start recognition
        recognition.start();

        // Play audio to trigger recognition (this is a workaround)
        // Note: This approach has limitations and may not work perfectly
        audio.play().catch(() => {
          // If audio play fails, still try recognition
          console.warn('Audio playback failed, attempting recognition anyway');
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  async analyzeMemory(content: string, title?: string): Promise<AIInsights> {
    // Use basic analysis for web speech provider
    const fallbackProvider = new FallbackProvider();
    return await fallbackProvider.analyzeMemory(content, title);
  }

  async generateInsights(memories: any[]): Promise<any[]> {
    const fallbackProvider = new FallbackProvider();
    return await fallbackProvider.generateInsights(memories);
  }
}

// Fallback provider for when no API is available
export class FallbackProvider implements AIProvider {
  name = 'Basic Analysis';

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    // Try to use Web Speech API as a fallback
    try {
      const webSpeechProvider = new WebSpeechProvider();
      return await webSpeechProvider.transcribeAudio(audioBlob);
    } catch (error) {
      console.warn('Web Speech API failed:', error);
      throw new Error("Audio transcription requires an AI API key or browser speech recognition. Please add an AI API key to enable this feature, or try using a browser that supports speech recognition.");
    }
  }

  async analyzeMemory(content: string, title?: string): Promise<AIInsights> {
    const positiveWords = ['happy', 'joy', 'amazing', 'wonderful', 'love', 'excited', 'great', 'beautiful', 'awesome', 'fantastic'];
    const negativeWords = ['sad', 'difficult', 'hard', 'pain', 'loss', 'worry', 'stress', 'angry', 'frustrated', 'disappointed'];
    const excitedWords = ['excited', 'thrilled', 'amazing', 'incredible', 'awesome', 'fantastic'];
    const reflectiveWords = ['think', 'remember', 'reflect', 'consider', 'ponder', 'contemplate'];
    
    const words = content.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
    const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;
    const excitedCount = words.filter(word => excitedWords.some(exc => word.includes(exc))).length;
    const reflectiveCount = words.filter(word => reflectiveWords.some(ref => word.includes(ref))).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'reflective' = 'neutral';
    
    if (excitedCount > 0) {
      sentiment = 'positive';
      mood = 'excited';
    } else if (reflectiveCount > 0) {
      mood = 'reflective';
      sentiment = positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'negative' : 'neutral';
    } else if (positiveCount > negativeCount) {
      sentiment = 'positive';
      mood = 'happy';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      mood = 'sad';
    }

    const keywords = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5);

    const suggestedTags = [];
    if (content.toLowerCase().includes('work') || content.toLowerCase().includes('job')) suggestedTags.push('work');
    if (content.toLowerCase().includes('family') || content.toLowerCase().includes('parent')) suggestedTags.push('family');
    if (content.toLowerCase().includes('friend')) suggestedTags.push('friends');
    if (content.toLowerCase().includes('travel') || content.toLowerCase().includes('trip')) suggestedTags.push('travel');
    if (suggestedTags.length === 0) suggestedTags.push('general');

    return {
      sentiment,
      keywords,
      suggestedTags,
      emotionalTone: 'Basic analysis - upgrade to AI for detailed insights',
      summary: content.substring(0, 100) + '...',
      relatedMemories: [],
      confidence: 0.6,
      themes: ['personal'],
      mood
    };
  }

  async generateInsights(memories: any[]): Promise<any[]> {
    const insights = [];
    
    // Basic pattern analysis
    const moodCounts = memories.reduce((acc, memory) => {
      acc[memory.mood] = (acc[memory.mood] || 0) + 1;
      return acc;
    }, {});

    const dominantMood = Object.entries(moodCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0];
    
    if (dominantMood) {
      insights.push({
        type: 'pattern',
        title: `Mood Pattern: ${dominantMood[0]}`,
        description: `Your memories show a tendency towards ${dominantMood[0]} experiences (${dominantMood[1]} out of ${memories.length} memories).`,
        confidence: 0.7,
        actionable: false
      });
    }

    insights.push({
      type: 'suggestion',
      title: 'Enable AI Analysis',
      description: 'Add an AI API key to unlock powerful insights about your memory patterns and emotional trends.',
      confidence: 1.0,
      actionable: true
    });

    return insights;
  }
}

export class AIService {
  private provider: AIProvider;
  private fallbackProvider: FallbackProvider;

  constructor() {
    this.fallbackProvider = new FallbackProvider();
    this.provider = this.initializeProvider();
  }

  private initializeProvider(): AIProvider {
    // Check for available API keys in order of preference
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;

    if (groqKey && groqKey !== 'your_groq_api_key_here' && groqKey.trim() !== '') {
      console.log('Using Groq AI provider');
      return new GroqProvider(groqKey);
    } else {
      console.log('No AI API key found, using fallback provider with browser speech recognition');
      return this.fallbackProvider;
    }
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    // Try primary provider first
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Transcription attempt ${attempt}/${maxRetries} with ${this.provider.name}`);
        
        if (this.provider.transcribeAudio) {
          const result = await Promise.race([
            this.provider.transcribeAudio(audioBlob),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Transcription timeout')), 15000)
            )
          ]);
          
          if (result && result.trim().length > 0) {
            return result;
          } else {
            throw new Error('Empty transcription result');
          }
        } else {
          throw new Error('Transcription not supported by current provider');
        }
      } catch (error) {
        console.warn(`Transcription attempt ${attempt} failed:`, error);
        lastError = error as Error;
        
        // If it's a rate limit error, don't retry immediately
        if ((error as Error).message.includes('Rate limit exceeded')) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    // If primary provider failed, try fallback methods
    try {
      console.log('Trying fallback transcription methods...');
      
      // Try Web Speech API
      const webSpeechProvider = new WebSpeechProvider();
      const result = await webSpeechProvider.transcribeAudio(audioBlob);
      if (result && result.trim().length > 0) {
        return result;
      }
    } catch (fallbackError) {
      console.warn('Fallback transcription failed:', fallbackError);
    }

    // If all methods fail, provide helpful error message
    const errorMessage = this.provider.name === 'Basic Analysis' 
      ? 'Speech recognition failed. Please check your microphone and try again, or add text manually below.'
      : `Transcription failed with ${this.provider.name}. Please check your API key and internet connection, or add text manually below.`;
    
    throw new Error(errorMessage);
  }

  async analyzeMemory(content: string, title?: string): Promise<AIInsights> {
    try {
      if (this.provider.analyzeMemory) {
        return await this.provider.analyzeMemory(content, title);
      } else {
        return await this.fallbackProvider.analyzeMemory(content, title);
      }
    } catch (error) {
      console.warn('AI analysis failed, using fallback:', error);
      
      // Check if it's a rate limit error and provide specific feedback
      if ((error as Error).message === 'RATE_LIMIT_EXCEEDED') {
        console.warn('Groq API rate limit exceeded, falling back to basic analysis');
      }
      
      // Always fall back to basic analysis instead of throwing
      return await this.fallbackProvider.analyzeMemory(content, title);
    }
  }

  async generateInsights(memories: any[]): Promise<any[]> {
    try {
      if (this.provider.generateInsights) {
        return await this.provider.generateInsights(memories);
      } else {
        return await this.fallbackProvider.generateInsights(memories);
      }
    } catch (error) {
      console.warn('AI insights generation failed, using fallback:', error);
      
      // Check if it's a rate limit error
      if ((error as Error).message === 'RATE_LIMIT_EXCEEDED') {
        console.warn('Groq API rate limit exceeded, falling back to basic insights');
      }
      
      // Fall back to basic insights
      return await this.fallbackProvider.generateInsights(memories);
    }
  }

  getProviderName(): string {
    return this.provider.name;
  }

  // Method to check if AI features are fully available
  isAIEnabled(): boolean {
    return this.provider.name !== 'Basic Analysis';
  }

  // Method to get configuration status
  getConfigurationStatus(): {
    hasAIProvider: boolean;
    providerName: string;
    features: {
      transcription: boolean;
      analysis: boolean;
      insights: boolean;
    };
  } {
    return {
      hasAIProvider: this.isAIEnabled(),
      providerName: this.provider.name,
      features: {
        transcription: !!this.provider.transcribeAudio,
        analysis: !!this.provider.analyzeMemory,
        insights: !!this.provider.generateInsights
      }
    };
  }
}

// Export singleton instance
export const aiService = new AIService();