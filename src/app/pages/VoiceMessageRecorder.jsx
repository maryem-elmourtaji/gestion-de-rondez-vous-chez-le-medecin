import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { getUserFromStorage } from '../utils/auth';
import { saveVoiceMessage, simulateWhisperTranscription } from '../utils/voiceMessages';
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import {
  Mic, Square, Play, Pause, Loader2, CheckCircle, AlertCircle,
  Volume2, Send, RotateCcw, Keyboard, Info
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function VoiceMessageRecorder() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Transcription states
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [transcriptionStatus, setTranscriptionStatus] = useState('idle');

  // Demo mode (fallback when microphone unavailable)
  const [demoMode, setDemoMode] = useState(false);
  const [useTextInput, setUseTextInput] = useState(false);
  const [directText, setDirectText] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!hasPermission(currentUser.role, PERMISSIONS.RECORD_VOICE_MESSAGE)) {
      navigate('/');
      return;
    }
    setUser(currentUser);

    // Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setDemoMode(true);
    }
  }, [navigate]);

  // Demo recording (simulated countdown)
  const startDemoRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    audioChunksRef.current = [];

    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 9) {
          stopDemoRecording();
          return 10;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopDemoRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);

    // Simulate audio blob creation
    const mockBlob = new Blob(['demo-audio-data'], { type: 'audio/webm' });
    setAudioBlob(mockBlob);
    const url = URL.createObjectURL(mockBlob);
    setAudioUrl(url);
  };

  // Real recording
  const startRealRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.onerror = () => {
        toast.error('حدث خطأ أثناء التسجيل. سيتم التبديل إلى وضع العرض.');
        setDemoMode(true);
        stopRecordingCleanup();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Microphone error:', error);
      toast.error('لا يمكن الوصول إلى الميكروفون. سيتم التبديل إلى وضع العرض.');
      setDemoMode(true);
    }
  };

  const startRecording = () => {
    if (demoMode) {
      startDemoRecording();
    } else {
      startRealRecording();
    }
  };

  const stopRecordingCleanup = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } catch (e) { /* ignore */ }
    }
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const stopRecording = () => {
    stopRecordingCleanup();
    if (demoMode) {
      // Simulate blob creation in demo mode
      const mockBlob = new Blob(['demo-audio-data'], { type: 'audio/webm' });
      setAudioBlob(mockBlob);
      setAudioUrl(URL.createObjectURL(mockBlob));
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {
          // Demo audio can't really play, just toggle state
          setIsPlaying(true);
          setTimeout(() => setIsPlaying(false), 2000);
        });
      }
    } else if (demoMode && audioBlob) {
      // In demo mode, just simulate playing
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setTranscription('');
    setTranscriptionStatus('idle');
    setDirectText('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const transcribeAudio = async () => {
    setIsTranscribing(true);
    setTranscriptionStatus('pending');

    try {
      const result = await simulateWhisperTranscription(audioBlob, 'ar');
      setTranscription(result.text);
      setTranscriptionStatus('processed');
      toast.success('تم تحويل الصوت إلى نص بنجاح!');
    } catch (error) {
      console.error('Transcription error:', error);
      setTranscriptionStatus('error');
      toast.error('حدث خطأ أثناء التحويل.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const sendVoiceMessage = () => {
    const textToSend = useTextInput ? directText : transcription;
    if ((!audioBlob && !useTextInput) || !textToSend.trim()) {
      toast.error('الرجاء تسجيل الرسالة أو كتابة النص أولاً');
      return;
    }

    const messageData = {
      patientId: user.id,
      patientName: user.name,
      audioUrl: audioUrl || 'text-only',
      transcription: textToSend,
      language: 'ar',
      duration: recordingTime || textToSend.length / 5,
      status: 'processed'
    };

    saveVoiceMessage(messageData);
    toast.success('تم إرسال الرسالة بنجاح!');
    resetRecording();
  };

  const handleDirectTextSubmit = () => {
    if (!directText.trim()) {
      toast.error('الرجاء كتابة وصف الحالة');
      return;
    }
    setTranscription(directText);
    setTranscriptionStatus('processed');
    toast.success('تم حفظ الوصف!');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">رسالة صوتية</h1>
          <p className="text-xl text-gray-600">
            {useTextInput
              ? 'اكتب وصف حالتك الصحية'
              : 'صف حالتك الصحية بصوتك وسيتم تحويلها تلقائياً إلى نص'}
          </p>
        </div>

        {/* Toggle between voice and text */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white rounded-lg shadow p-1 flex">
            <button
              onClick={() => { setUseTextInput(false); resetRecording(); }}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                !useTextInput ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mic className="w-4 h-4" />
              تسجيل صوتي
            </button>
            <button
              onClick={() => { setUseTextInput(true); resetRecording(); }}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                useTextInput ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              كتابة نصية
            </button>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {useTextInput ? (
              /* Text Input Mode */
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    اكتب وصف حالتك الصحية
                  </label>
                  <textarea
                    value={directText}
                    onChange={(e) => setDirectText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
                    placeholder="صف أعراضك بالتفصيل..."
                    dir="rtl"
                  />
                </div>
                <Button
                  onClick={handleDirectTextSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="w-4 h-4 ml-2" />
                  حفظ الوصف
                </Button>
              </div>
            ) : (
              /* Voice Recording Mode */
              <div className="text-center mb-8">
                {!audioBlob ? (
                  <div className="space-y-6">
                    {demoMode && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <Info className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm">
                            وضع العرض: التسجيل الصوتي غير متاح في هذا البيئة (يتطلب HTTPS أو localhost)
                          </p>
                        </div>
                      </div>
                    )}

                    <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all ${
                      isRecording
                        ? 'bg-red-100 animate-pulse'
                        : 'bg-blue-100 hover:bg-blue-200'
                    }`}>
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                          isRecording
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isRecording ? (
                          <Square className="w-10 h-10 text-white" />
                        ) : (
                          <Mic className="w-10 h-10 text-white" />
                        )}
                      </button>
                    </div>

                    {isRecording && (
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-red-600">
                          {formatTime(recordingTime)}
                        </div>
                        <p className="text-red-500 animate-pulse">جاري التسجيل...</p>
                      </div>
                    )}

                    {!isRecording && (
                      <div>
                        <p className="text-gray-600">اضغط على الزر لبدء التسجيل</p>
                        <p className="text-sm text-gray-500 mt-2">
                          يمكنك وصف أعراضك أو حالتك الصحية بشكل مفصل
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-32 h-32 rounded-full mx-auto bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-gray-900">تم التسجيل بنجاح</p>
                      <p className="text-gray-600">مدة التسجيل: {formatTime(recordingTime)}</p>
                    </div>

                    {/* Audio Player */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={playAudio}
                        className="w-12 h-12"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={resetRecording}
                        className="w-12 h-12 text-red-600 hover:text-red-700"
                      >
                        <RotateCcw className="w-6 h-6" />
                      </Button>
                    </div>

                    {audioUrl && (
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={handleAudioEnded}
                        className="hidden"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Transcription Section */}
            {(audioBlob || useTextInput) && (
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    {useTextInput ? 'النص المكتوب' : 'التحويل إلى نص'}
                  </h3>
                  {!useTextInput && (
                    <span className="text-sm text-gray-500">مدعوم بتقنية Whisper AI</span>
                  )}
                </div>

                {!useTextInput && transcriptionStatus === 'idle' && (
                  <Button
                    onClick={transcribeAudio}
                    disabled={isTranscribing}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جاري التحويل...
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        تحويل الصوت إلى نص
                      </>
                    )}
                  </Button>
                )}

                {transcriptionStatus === 'pending' && !useTextInput && (
                  <div className="bg-purple-50 p-6 rounded-lg text-center">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
                    <p className="text-purple-700">جاري معالجة التسجيل وتحويله إلى نص...</p>
                    <p className="text-sm text-purple-500 mt-1">قد تستغرق هذه العملية بضع ثوانٍ</p>
                  </div>
                )}

                {(transcriptionStatus === 'processed' || useTextInput) && (transcription || directText) && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-2">النص المكتوب:</p>
                      <p className="text-gray-800 leading-relaxed">
                        {useTextInput ? directText : transcription}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {!useTextInput && (
                        <Button
                          variant="outline"
                          onClick={transcribeAudio}
                          className="flex-1"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          إعادة التحويل
                        </Button>
                      )}
                      <Button
                        onClick={sendVoiceMessage}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        إرسال للطبيب
                      </Button>
                    </div>
                  </div>
                )}

                {transcriptionStatus === 'error' && !useTextInput && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">حدث خطأ</span>
                    </div>
                    <p className="text-red-700 text-sm mb-3">
                      لم نتمكن من تحويل التسجيل إلى نص. يرجى المحاولة مرة أخرى.
                    </p>
                    <Button
                      variant="outline"
                      onClick={transcribeAudio}
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      إعادة المحاولة
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">نصائح لوصف الحالة:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• اذكر الأعراض بالتفصيل ومتى بدأت</li>
                <li>• صف مستوى الألم إن وجد (خفيف، متوسط، شديد)</li>
                <li>• اذكر أي أدوية تتناولها حالياً</li>
                <li>• أذكر إذا كان هناك أي حساسية معروفة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

