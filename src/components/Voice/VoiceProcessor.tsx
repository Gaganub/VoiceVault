import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';

interface VoiceProcessorProps {
  onTranscriptionComplete: (text: string, audioBlob: Blob) => void;
  className?: string;
}

export const VoiceProcessor: React.FC<VoiceProcessorProps> = ({
  onTranscriptionComplete,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('prompt');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check microphone permission status
  const checkPermission = useCallback(async () => {
    try {
      setPermissionStatus('checking');
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionStatus(permission.state as 'granted' | 'denied' | 'prompt');
      return permission.state === 'granted';
    } catch (error) {
      console.warn('Permission API not supported, will request permission directly');
      setPermissionStatus('prompt');
      return false;
    }
  }, []);

  // Request microphone permission and get media stream
  const requestMicrophoneAccess = useCallback(async (): Promise<MediaStream | null> => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      setPermissionStatus('granted');
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            setPermissionStatus('denied');
            setError('Microphone permission denied. Please allow microphone access in your browser settings and refresh the page.');
            break;
          case 'NotFoundError':
            setError('No microphone found. Please connect a microphone and try again.');
            break;
          case 'NotReadableError':
            setError('Microphone is already in use by another application.');
            break;
          case 'OverconstrainedError':
            setError('Microphone constraints could not be satisfied.');
            break;
          default:
            setError(`Microphone access error: ${error.message}`);
        }
      } else {
        setError('Failed to access microphone. Please check your browser settings.');
      }
      
      return null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Check if we already have permission
      const hasPermission = await checkPermission();
      
      // Request microphone access
      const stream = await requestMicrophoneAccess();
      if (!stream) {
        return; // Error already set in requestMicrophoneAccess
      }

      // Clear previous recording data
      audioChunksRef.current = [];
      setAudioBlob(null);
      setTranscription('');

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        setAudioBlob(blob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Simulate transcription (replace with actual transcription service)
        const mockTranscription = "This is a mock transcription of your voice recording.";
        setTranscription(mockTranscription);
        onTranscriptionComplete(mockTranscription, blob);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording failed. Please try again.');
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please check your microphone permissions.');
      setIsRecording(false);
    }
  }, [checkPermission, requestMicrophoneAccess, onTranscriptionComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const playAudio = useCallback(() => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setError('Failed to play audio');
        URL.revokeObjectURL(audioUrl);
      };

      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setError('Failed to play audio');
        setIsPlaying(false);
      });
    }
  }, [audioBlob, isPlaying]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // Initialize permission check on component mount
  React.useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return (
    <div className={`voice-processor ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm max-w-md text-center">
            <p className="font-medium">Microphone Error</p>
            <p>{error}</p>
            {permissionStatus === 'denied' && (
              <div className="mt-2 text-xs">
                <p>To fix this:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Click the lock/info icon in your browser's address bar</li>
                  <li>Allow microphone access for this site</li>
                  <li>Refresh the page and try again</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Permission Status */}
        {permissionStatus === 'checking' && (
          <div className="text-sm text-gray-600">
            Checking microphone permissions...
          </div>
        )}

        {permissionStatus === 'prompt' && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm max-w-md text-center">
            <p>Click the record button to request microphone access</p>
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={permissionStatus === 'denied' || permissionStatus === 'checking'}
            className={`
              flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200
              ${isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : permissionStatus === 'denied'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
              }
              ${permissionStatus === 'checking' ? 'opacity-50 cursor-wait' : ''}
              disabled:cursor-not-allowed disabled:opacity-50
            `}
            title={
              permissionStatus === 'denied' 
                ? 'Microphone access denied' 
                : isRecording 
                ? 'Stop recording' 
                : 'Start recording'
            }
          >
            {isRecording ? (
              <Square className="w-6 h-6" />
            ) : permissionStatus === 'denied' ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          {/* Audio Playback Controls */}
          {audioBlob && (
            <button
              onClick={isPlaying ? pauseAudio : playAudio}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-105"
              title={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording...</span>
          </div>
        )}

        {/* Transcription Display */}
        {transcription && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Transcription:</h4>
            <p className="text-sm text-gray-600">{transcription}</p>
          </div>
        )}

        {/* Permission Status Indicator */}
        <div className="text-xs text-gray-500">
          Microphone: {
            permissionStatus === 'granted' ? '✅ Allowed' :
            permissionStatus === 'denied' ? '❌ Denied' :
            permissionStatus === 'checking' ? '⏳ Checking...' :
            '❓ Not requested'
          }
        </div>
      </div>
    </div>
  );
};

export default VoiceProcessor;