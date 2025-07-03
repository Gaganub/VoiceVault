import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause, Save, X, Sparkles, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { AIProcessor } from '../AI/AIProcessor';
import { AIInsights } from '../../types';
import { aiService } from '../../services/aiService';

interface VoiceRecorderProps {
  onSave: (audioBlob: Blob, title: string, content: string, aiInsights?: AIInsights) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSave, onCancel }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setError('');
      setRecordingDuration(0);
      setContent('');
      setTitle('');
      setAudioUrl('');
      setAudioBlob(null);
      setShowAIAnalysis(false);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && mountedRef.current) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (!mountedRef.current) return;
        
        const blob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Start transcription process
        await handleTranscription(blob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      durationIntervalRef.current = setInterval(() => {
        if (mountedRef.current) {
          setRecordingDuration(prev => prev + 1);
        }
      }, 1000);

    } catch (error: any) {
      console.error('Error starting recording:', error);
      let errorMessage = 'Failed to start recording. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      }
      
      setError(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const transcription = await aiService.transcribeAudio(blob);
      
      if (transcription && transcription.trim()) {
        setContent(transcription);
        setTitle(`Voice Memory - ${new Date().toLocaleTimeString()}`);
        setShowAIAnalysis(true);
      } else {
        setContent('Transcription failed. Please add your content manually.');
        setTitle(`Voice Memory - ${new Date().toLocaleTimeString()}`);
      }
    } catch (error: any) {
      console.error('Transcription failed:', error);
      setContent('Transcription failed. Please add your content manually below.');
      setTitle(`Voice Memory - ${new Date().toLocaleTimeString()}`);
      setError(error.message || 'Transcription failed. You can still add content manually.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleAIInsights = (insights: AIInsights) => {
    if (!mountedRef.current) return;
    setAiInsights(insights);
  };

  const handleSave = async () => {
    if (!audioBlob || !title.trim()) {
      setError('Please provide both audio recording and a title.');
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      await onSave(audioBlob, title, content, aiInsights || undefined);
    } catch (error) {
      console.error('Error saving memory:', error);
      setError('Failed to save memory. Please try again.');
    } finally {
      if (mountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div 
          className="mb-6 p-4 rounded-xl flex items-start space-x-3"
          style={{ backgroundColor: '#ef444430', border: '1px solid #ef4444' }}
        >
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium">Recording Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recording Interface */}
        <div>
          <div 
            className="p-8 rounded-3xl backdrop-blur-sm border border-opacity-30 mb-6"
            style={{ 
              backgroundColor: `${theme.colors.surface}60`,
              borderColor: theme.colors.accent 
            }}
          >
            <div className="text-center mb-8">
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: theme.colors.text }}
              >
                Capture Your Memory
              </h2>
              <p 
                className="text-lg"
                style={{ color: theme.colors.textSecondary }}
              >
                Share your thoughts, experiences, and precious moments
              </p>
            </div>

            {/* Voice Recording Controls */}
            <div className="text-center mb-6">
              <div className="relative">
                <div 
                  className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
                    isRecording ? 'animate-pulse scale-110' : ''
                  }`}
                  style={{ 
                    backgroundColor: `${theme.colors.primary}${isRecording ? '40' : '20'}`,
                    boxShadow: isRecording ? `0 0 30px ${theme.colors.primary}40` : 'none'
                  }}
                >
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isTranscribing}
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    {isRecording ? (
                      <Square 
                        className="w-8 h-8" 
                        style={{ color: theme.colors.background }}
                      />
                    ) : (
                      <Mic 
                        className="w-8 h-8" 
                        style={{ color: theme.colors.background }}
                      />
                    )}
                  </button>
                </div>
              </div>
              
              <p 
                className="text-sm font-medium"
                style={{ color: theme.colors.text }}
              >
                {isRecording ? 'Recording...' : isTranscribing ? 'Processing...' : 'Tap to record'}
              </p>
              
              {isRecording && (
                <div 
                  className="text-sm font-mono mt-2"
                  style={{ color: theme.colors.text }}
                >
                  {formatDuration(recordingDuration)}
                </div>
              )}

              {isTranscribing && (
                <div className="mt-4">
                  <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ color: theme.colors.primary }} />
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    Converting speech to text...
                  </p>
                </div>
              )}
            </div>

            {/* Audio Playback */}
            {audioUrl && (
              <div 
                className="p-4 rounded-xl mb-4"
                style={{ backgroundColor: `${theme.colors.surface}40` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={togglePlayback}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ backgroundColor: `${theme.colors.primary}20` }}
                    >
                      {isPlaying ? (
                        <Pause 
                          className="w-5 h-5" 
                          style={{ color: theme.colors.primary }}
                        />
                      ) : (
                        <Play 
                          className="w-5 h-5 ml-0.5" 
                          style={{ color: theme.colors.primary }}
                        />
                      )}
                    </button>
                    <span 
                      className="text-sm"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Voice Recording ({formatDuration(recordingDuration)})
                    </span>
                  </div>
                </div>
                <audio ref={audioRef} src={audioUrl} className="hidden" />
              </div>
            )}
          </div>

          {/* Memory Details */}
          <div 
            className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30"
            style={{ 
              backgroundColor: `${theme.colors.surface}60`,
              borderColor: theme.colors.accent 
            }}
          >
            <div className="space-y-4 mb-6">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Memory Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your memory a meaningful title..."
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    backgroundColor: `${theme.colors.surface}40`,
                    borderColor: theme.colors.accent,
                    color: theme.colors.text,
                    '--tw-ring-color': theme.colors.primary 
                  } as React.CSSProperties}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Your AI transcription will appear here, or add manual notes..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ 
                    backgroundColor: `${theme.colors.surface}40`,
                    borderColor: theme.colors.accent,
                    color: theme.colors.text,
                    '--tw-ring-color': theme.colors.primary 
                  } as React.CSSProperties}
                />
              </div>

              {aiInsights && (
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${theme.colors.primary}10` }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles 
                      className="w-4 h-4" 
                      style={{ color: theme.colors.primary }}
                    />
                    <span 
                      className="text-sm font-medium"
                      style={{ color: theme.colors.primary }}
                    >
                      AI Enhanced
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div style={{ color: theme.colors.textSecondary }}>
                      Mood: <span className="capitalize font-medium">{aiInsights.mood}</span>
                    </div>
                    <div style={{ color: theme.colors.textSecondary }}>
                      Sentiment: <span className="capitalize font-medium">{aiInsights.sentiment}</span>
                    </div>
                    {aiInsights.suggestedTags.length > 0 && (
                      <div style={{ color: theme.colors.textSecondary }}>
                        Tags: {aiInsights.suggestedTags.slice(0, 3).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={onCancel}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                style={{ 
                  borderColor: theme.colors.textSecondary,
                  color: theme.colors.textSecondary 
                }}
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>

              <button
                onClick={handleSave}
                disabled={!audioBlob || !title.trim() || isSaving}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                style={{ 
                  backgroundColor: (audioBlob && title.trim() && !isSaving) ? theme.colors.primary : `${theme.colors.surface}60`,
                  color: (audioBlob && title.trim() && !isSaving) ? theme.colors.background : theme.colors.textSecondary 
                }}
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Memory</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div>
          {showAIAnalysis && content ? (
            <AIProcessor 
              memory={{ 
                id: 'temp', 
                title, 
                content, 
                timestamp: new Date(), 
                tags: [], 
                mood: 'neutral', 
                isPrivate: false 
              }}
              onProcessingComplete={handleAIInsights}
            />
          ) : (
            <div 
              className="p-8 rounded-2xl backdrop-blur-sm border border-opacity-30 text-center"
              style={{ 
                backgroundColor: `${theme.colors.surface}40`,
                borderColor: theme.colors.accent 
              }}
            >
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${theme.colors.primary}20` }}
              >
                <Sparkles 
                  className="w-8 h-8" 
                  style={{ color: theme.colors.primary }}
                />
              </div>
              <h3 
                className="text-lg font-bold mb-2"
                style={{ color: theme.colors.text }}
              >
                AI Analysis Ready
              </h3>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Record your memory to see AI-powered insights, mood analysis, and smart suggestions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};