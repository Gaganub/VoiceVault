import { AIInsights } from '../types';

// AI Provider interfaces and implementations
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
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0]?.message?.content || '{}');
      
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
              content: 'Generate insights about memory patterns. Return JSON only.'
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

      const data = await response.json();
      const result = JSON.parse(data.choices[0]?.message?.content || '{"insights": []}');
      return result.insights || [];
    } catch (error) {
      console.error('Groq insights error:', error);
      return [];
    }
  }
}

// Hugging Face Provider (Free)
export class HuggingFaceProvider implements AIProvider {
  name = 'Hugging Face';
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/models/openai/whisper-large-v3`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: audioBlob
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const result = await response.json();
      return result.text || 'Transcription failed';
    } catch (error) {
      console.error('Hugging Face transcription error:', error);
      throw error;
    }
  }

  async analyzeMemory(content: string, title?: string): Promise<AIInsights> {
    try {
      // Use sentiment analysis model
      const sentimentResponse = await fetch(`${this.baseUrl}/models/cardiffnlp/twitter-roberta-base-sentiment-latest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: content })
      });

      const sentimentData = await sentimentResponse.json();
      const sentiment = sentimentData[0]?.label?.toLowerCase() || 'neutral';

      // Basic keyword extraction
      const keywords = content.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter(word => word.length > 3)
        .slice(0, 5);

      return {
        sentiment: sentiment.includes('positive') ? 'positive' : 
                  sentiment.includes('negative') ? 'negative' : 'neutral',
        keywords,
        suggestedTags: this.extractTags(content),
        emotionalTone: `${sentiment} emotional tone`,
        summary: content.substring(0, 100) + '...',
        relatedMemories: [],
        confidence: 0.75,
        themes: ['personal'],
        mood: this.determineMood(sentiment, content)
      };
    } catch (error) {
      console.error('Hugging Face analysis error:', error);
      throw error;
    }
  }

  private extractTags(content: string): string[] {
    const tagMap: Record<string, string[]> = {
      family: ['family', 'mom', 'dad', 'sister', 'brother', 'child'],
      work: ['work', 'job', 'office', 'meeting', 'project'],
      travel: ['travel', 'trip', 'vacation', 'flight', 'hotel'],
      food: ['food', 'restaurant', 'cooking', 'recipe', 'dinner'],
      friends: ['friend', 'buddy', 'social', 'party'],
      nature: ['nature', 'park', 'tree', 'outdoor', 'hiking']
    };

    const contentLower = content.toLowerCase();
    return Object.keys(tagMap).filter(tag => 
      tagMap[tag].some(keyword => contentLower.includes(keyword))
    ).slice(0, 3);
  }

  private determineMood(sentiment: string, content: string): 'happy' | 'sad' | 'neutral' | 'excited' | 'reflective' {
    if (sentiment.includes('positive')) {
      return content.toLowerCase().includes('excited') ? 'excited' : 'happy';
    } else if (sentiment.includes('negative')) {
      return 'sad';
    }
    return content.toLowerCase().includes('think') ? 'reflective' : 'neutral';
  }

  async generateInsights(memories: any[]): Promise<any[]> {
    // Basic pattern analysis without complex AI
    const insights = [];
    
    if (memories.length > 5) {
      insights.push({
        type: 'milestone',
        title: 'Memory Collection Growing',
        description: `You've captured ${memories.length} memories! Your personal vault is expanding beautifully.`,
        confidence: 1.0,
        actionable: false
      });
    }

    const moodCounts = memories.reduce((acc, m) => {
      acc[m.mood] = (acc[m.mood] || 0) + 1;
      return acc;
    }, {});

    const topMood = Object.entries(moodCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0];
    if (topMood) {
      insights.push({
        type: 'pattern',
        title: 'Emotional Pattern Detected',
        description: `Your memories show a tendency toward ${topMood[0]} moods (${topMood[1]} memories). This reflects your emotional landscape.`,
        confidence: 0.8,
        actionable: true
      });
    }

    return insights;
  }
}

// Cohere Provider (Free tier available)
export class CohereProvider implements AIProvider {
  name = 'Cohere';
  private apiKey: string;
  private baseUrl = 'https://api.cohere.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeMemory(content: string, title?: string): Promise<AIInsights> {
    try {
      // Use Cohere's classify endpoint for sentiment
      const response = await fetch(`${this.baseUrl}/classify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [content],
          examples: [
            { text: "I had an amazing day with my family", label: "positive" },
            { text: "I'm feeling sad about leaving", label: "negative" },
            { text: "Today was a regular day at work", label: "neutral" }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Cohere API error: ${response.status}`);
      }

      const data = await response.json();
      const sentiment = data.classifications[0]?.prediction || 'neutral';

      const keywords = content.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter(word => word.length > 3)
        .slice(0, 5);

      return {
        sentiment: sentiment as 'positive' | 'negative' | 'neutral',
        keywords,
        suggestedTags: this.extractTags(content),
        emotionalTone: `${sentiment} emotional tone`,
        summary: content.substring(0, 100) + '...',
        relatedMemories: [],
        confidence: data.classifications[0]?.confidence || 0.7,
        themes: ['personal'],
        mood: this.determineMood(sentiment, content)
      };
    } catch (error) {
      console.error('Cohere analysis error:', error);
      throw error;
    }
  }

  private extractTags(content: string): string[] {
    const tagMap: Record<string, string[]> = {
      family: ['family', 'mom', 'dad', 'sister', 'brother'],
      work: ['work', 'job', 'office', 'meeting'],
      travel: ['travel', 'trip', 'vacation'],
      food: ['food', 'restaurant', 'cooking'],
      friends: ['friend', 'social', 'party'],
      nature: ['nature', 'park', 'outdoor']
    };

    const contentLower = content.toLowerCase();
    return Object.keys(tagMap).filter(tag => 
      tagMap[tag].some(keyword => contentLower.includes(keyword))
    ).slice(0, 3);
  }

  private determineMood(sentiment: string, content: string): 'happy' | 'sad' | 'neutral' | 'excited' | 'reflective' {
    if (sentiment === 'positive') {
      return content.toLowerCase().includes('excited') ? 'excited' : 'happy';
    } else if (sentiment === 'negative') {
      return 'sad';
    }
    return 'neutral';
  }

  async generateInsights(memories: any[]): Promise<any[]> {
    return [
      {
        type: 'pattern',
        title: 'Memory Analysis',
        description: `You have ${memories.length} memories in your collection. Keep capturing those precious moments!`,
        confidence: 1.0,
        actionable: true
      }
    ];
  }
}

// Fallback provider for when no API is available
export class FallbackProvider implements AIProvider {
  name = 'Basic Analysis';

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    return "Audio transcription requires an AI API key. Please add one to enable this feature.";
  }

  async analyzeMemory(content: string, title?: string): Promise<AIInsights> {
    const positiveWords = ['happy', 'joy', 'amazing', 'wonderful', 'love', 'excited', 'great', 'beautiful'];
    const negativeWords = ['sad', 'difficult', 'hard', 'pain', 'loss', 'worry', 'stress'];
    
    const words = content.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
    const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'reflective' = 'neutral';
    
    if (positiveCount > negativeCount) {
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

    return {
      sentiment,
      keywords,
      suggestedTags: ['general'],
      emotionalTone: 'Basic analysis - upgrade to AI for detailed insights',
      summary: content.substring(0, 100) + '...',
      relatedMemories: [],
      confidence: 0.6,
      themes: ['personal'],
      mood
    };
  }

  async generateInsights(memories: any[]): Promise<any[]> {
    return [
      {
        type: 'suggestion',
        title: 'Enable AI Analysis',
        description: 'Add an AI API key to unlock powerful insights about your memory patterns and emotional trends.',
        confidence: 1.0,
        actionable: true
      }
    ];
  }
}