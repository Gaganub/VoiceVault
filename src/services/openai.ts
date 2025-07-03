import OpenAI from 'openai';
import { AIInsights } from '../types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export class OpenAIService {
  static async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Convert blob to File object for OpenAI
      const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
      
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
        response_format: 'text'
      });

      return transcription;
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please check your OpenAI API key.');
    }
  }

  static async analyzeMemory(content: string, title?: string): Promise<AIInsights> {
    try {
      const prompt = `
Analyze the following personal memory and provide detailed insights:

Title: ${title || 'Untitled Memory'}
Content: ${content}

Please analyze this memory and return a JSON response with the following structure:
{
  "sentiment": "positive|negative|neutral",
  "keywords": ["array", "of", "key", "words"],
  "suggestedTags": ["relevant", "tags", "for", "categorization"],
  "emotionalTone": "descriptive emotional tone",
  "summary": "brief summary of the memory",
  "themes": ["main", "themes", "identified"],
  "mood": "happy|sad|neutral|excited|reflective",
  "confidence": 0.95,
  "personalInsights": "meaningful insights about this memory",
  "connections": ["potential", "connections", "to", "other", "memories"]
}

Focus on:
1. Emotional analysis and sentiment
2. Key themes and topics
3. Personal significance
4. Suggested categorization tags
5. Overall mood classification
6. Brief but meaningful summary

Respond only with valid JSON.
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI assistant specialized in analyzing personal memories and providing emotional insights. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const insights = JSON.parse(response);
      
      // Ensure all required fields are present with defaults
      return {
        sentiment: insights.sentiment || 'neutral',
        keywords: insights.keywords || [],
        suggestedTags: insights.suggestedTags || [],
        emotionalTone: insights.emotionalTone || 'Neutral',
        summary: insights.summary || content.substring(0, 100) + '...',
        relatedMemories: insights.connections || [],
        confidence: insights.confidence || 0.8,
        themes: insights.themes || [],
        mood: insights.mood || 'neutral'
      };

    } catch (error) {
      console.error('Memory analysis error:', error);
      
      // Fallback to basic analysis if OpenAI fails
      return this.fallbackAnalysis(content);
    }
  }

  static async generateInsights(memories: any[]): Promise<any[]> {
    try {
      const memoryData = memories.slice(0, 10).map(m => ({
        title: m.title,
        content: m.content.substring(0, 200),
        mood: m.mood,
        tags: m.tags,
        timestamp: m.timestamp
      }));

      const prompt = `
Analyze these personal memories and generate meaningful insights:

${JSON.stringify(memoryData, null, 2)}

Generate 4-6 insights in the following JSON format:
{
  "insights": [
    {
      "type": "pattern|suggestion|milestone|reflection",
      "title": "Insight title",
      "description": "Detailed description",
      "confidence": 0.85,
      "actionable": true|false
    }
  ]
}

Focus on:
1. Patterns in emotions, themes, or timing
2. Personal growth observations
3. Actionable suggestions for memory keeping
4. Meaningful milestones or achievements
5. Emotional trends and well-being insights

Respond only with valid JSON.
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI assistant specialized in analyzing personal memory patterns and providing meaningful life insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const result = JSON.parse(response);
      return result.insights || [];

    } catch (error) {
      console.error('Insights generation error:', error);
      return this.fallbackInsights();
    }
  }

  // Fallback analysis when OpenAI is unavailable
  private static fallbackAnalysis(content: string): AIInsights {
    const positiveWords = ['happy', 'joy', 'amazing', 'wonderful', 'love', 'excited', 'great', 'beautiful', 'perfect', 'magical'];
    const negativeWords = ['sad', 'difficult', 'hard', 'pain', 'loss', 'worry', 'stress', 'problem', 'disappointed'];
    
    const words = content.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
    const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'reflective' = 'neutral';
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      mood = positiveCount > 2 ? 'excited' : 'happy';
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
      emotionalTone: 'Neutral tone',
      summary: content.substring(0, 100) + '...',
      relatedMemories: [],
      confidence: 0.6,
      themes: ['personal'],
      mood
    };
  }

  private static fallbackInsights(): any[] {
    return [
      {
        type: 'pattern',
        title: 'Memory Collection Started',
        description: 'You\'ve begun your journey of capturing precious moments. Keep recording to see more insights!',
        confidence: 1.0,
        actionable: true
      }
    ];
  }
}

export default OpenAIService;