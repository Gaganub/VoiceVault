# VoiceVault - AI-Powered Personal Memory Assistant

A beautiful, production-ready application for capturing, organizing, and reliving your precious memories with AI-powered voice technology.

## 🚀 Features

- **Voice Recording & AI Transcription** - Record your thoughts and get instant AI transcription
- **Multiple AI Providers** - Support for Groq, Hugging Face, Cohere, and OpenAI
- **AI Memory Analysis** - Sentiment analysis, mood detection, and smart tagging
- **Beautiful Themes** - 5 stunning color themes to personalize your experience
- **Memory Timeline** - Organize and search through your memories
- **AI Insights** - Discover patterns and get personalized suggestions
- **Blockchain Security** - Optional Algorand integration for secure storage
- **Responsive Design** - Works perfectly on all devices

## 🤖 AI Providers Supported

### Free Options (Recommended)

1. **Groq** (Best free option)
   - ✅ 6,000 requests/minute free tier
   - ✅ Fast inference with Llama models
   - ✅ Memory analysis and insights
   - 🔗 [Get free API key](https://console.groq.com/)

2. **Hugging Face**
   - ✅ Free tier available
   - ✅ Audio transcription with Whisper
   - ✅ Sentiment analysis
   - 🔗 [Get free API key](https://huggingface.co/settings/tokens)

3. **Cohere**
   - ✅ 1,000 requests/month free
   - ✅ Text classification and analysis
   - 🔗 [Get free API key](https://dashboard.cohere.ai/)

### Paid Options

4. **OpenAI**
   - 💰 Paid service
   - ✅ GPT-4 analysis and Whisper transcription
   - ✅ Most advanced features
   - 🔗 [Get API key](https://platform.openai.com/api-keys)

## 🛠️ Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd voicevault
npm install
```

### 2. Configure AI Provider
Copy the example environment file:
```bash
cp .env.example .env
```

Add your preferred AI API key to `.env`:
```env
# For Groq (recommended free option)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Or Hugging Face
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Or Cohere
VITE_COHERE_API_KEY=your_cohere_api_key_here

# Or OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

## 🎯 Getting Free AI API Keys

### Groq (Recommended)
1. Visit [console.groq.com](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into your `.env` file

### Hugging Face
1. Visit [huggingface.co](https://huggingface.co/)
2. Create a free account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy and paste into your `.env` file

### Cohere
1. Visit [dashboard.cohere.ai](https://dashboard.cohere.ai/)
2. Sign up for a free account
3. Go to API Keys section
4. Copy your default API key
5. Paste into your `.env` file

## 🔧 How It Works

The app automatically detects which AI provider you've configured and uses the first available one in this order:
1. Groq (if `VITE_GROQ_API_KEY` is set)
2. Hugging Face (if `VITE_HUGGINGFACE_API_KEY` is set)
3. Cohere (if `VITE_COHERE_API_KEY` is set)
4. OpenAI (if `VITE_OPENAI_API_KEY` is set)
5. Fallback to basic analysis (if no API keys are set)

## 📱 Usage

1. **Record a Memory**: Click the microphone button and speak your thoughts
2. **AI Transcription**: Your voice is automatically converted to text
3. **AI Analysis**: Get insights about sentiment, mood, and suggested tags
4. **Save & Organize**: Your memories are saved with smart categorization
5. **Discover Patterns**: View AI-generated insights about your memory patterns

## 🎨 Themes

Choose from 5 beautiful themes:
- Velvet Teal (default)
- Mauven Satin
- Ivory Mint
- Crimson Smoke
- Noir Lavender

## 🔒 Privacy & Security

- All data is stored locally in your browser
- Optional blockchain integration with Algorand
- AI processing happens through secure API calls
- No personal data is stored on our servers

## 🚀 Deployment

```bash
npm run build
```

Deploy the `dist` folder to your preferred hosting service (Netlify, Vercel, etc.).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.