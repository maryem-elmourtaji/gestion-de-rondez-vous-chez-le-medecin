// Gestion des messages vocaux avec transcription Whisper

export const getVoiceMessages = () => {
  return JSON.parse(localStorage.getItem('voiceMessages') || '[]');
};

export const getVoiceMessagesByPatient = (patientId) => {
  const messages = getVoiceMessages();
  return messages.filter(m => m.patientId === patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getVoiceMessagesByAppointment = (appointmentId) => {
  const messages = getVoiceMessages();
  return messages.filter(m => m.appointmentId === appointmentId);
};

export const getVoiceMessageById = (id) => {
  const messages = getVoiceMessages();
  return messages.find(m => m.id === parseInt(id));
};

export const saveVoiceMessage = (message) => {
  const messages = getVoiceMessages();
  const newMessage = {
    id: Date.now(),
    ...message,
    status: message.status || 'pending',
    createdAt: new Date().toISOString()
  };
  messages.push(newMessage);
  localStorage.setItem('voiceMessages', JSON.stringify(messages));
  return newMessage;
};

export const updateVoiceMessageStatus = (id, status, transcription = null) => {
  const messages = getVoiceMessages();
  const index = messages.findIndex(m => m.id === parseInt(id));
  if (index !== -1) {
    messages[index] = {
      ...messages[index],
      status,
      ...(transcription && { transcription }),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('voiceMessages', JSON.stringify(messages));
    return messages[index];
  }
  return null;
};

export const deleteVoiceMessage = (id) => {
  const messages = getVoiceMessages();
  const filtered = messages.filter(m => m.id !== parseInt(id));
  localStorage.setItem('voiceMessages', JSON.stringify(filtered));
};

// Simulation de transcription Whisper
export const simulateWhisperTranscription = async (audioBlob, language = 'ar') => {
  // Dans un environnement réel, cela enverrait l'audio à l'API OpenAI Whisper
  // Ici, nous simulons le délai et retournons une transcription de démonstration
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const demoTranscriptions = {
        ar: [
          'أشعر بألم شديد في صدري و difficulty في التنفس منذ yesterday.',
          'عندي صداع مستمر في الجزء الأمامي من رأسي منذ ثلاثة أيام.',
          'أعاني من طفح جلدي في يدي مع حكة شديدة.',
          'أشعر بالدوار والإرهاق عند الوقوف بسرعة.',
          'عندي ألم في أسفل ظهري يزداد عند الجلوس لفترات طويلة.'
        ],
        fr: [
          'Je ressens une douleur intense dans la poitrine et des difficultés à respirer depuis hier.',
          'J\'ai un mal de tête persistant à l\'avant du crâne depuis trois jours.',
          'Je souffre d\'une éruption cutanée aux mains avec une démangeaison intense.'
        ]
      };
      
      const transcriptions = demoTranscriptions[language] || demoTranscriptions.ar;
      const randomTranscription = transcriptions[Math.floor(Math.random() * transcriptions.length)];
      
      resolve({
        text: randomTranscription,
        language,
        confidence: 0.95,
        duration: audioBlob ? audioBlob.size / 16000 : 5.2
      });
    }, 2000 + Math.random() * 2000); // Simule un délai de 2-4 secondes
  });
};

// Créer un objet Blob audio simulé pour la démo
export const createDemoAudioBlob = () => {
  // Dans un environnement réel, cela viendrait de l'enregistrement du microphone
  // Ici, nous retournons un objet simulé
  return new Blob(['demo-audio-data'], { type: 'audio/webm' });
};

// Initialiser des messages vocaux de démonstration
export const initializeVoiceMessages = () => {
  const messages = getVoiceMessages();
  if (messages.length === 0) {
    const demoMessages = [
      {
        id: 1,
        patientId: 4,
        patientName: 'أحمد محمد',
        appointmentId: 1,
        audioUrl: 'demo-audio-1',
        transcription: 'أشعر بألم شديد في صدري وصعوبة في التنفس منذ yesterday. أحتاج إلى مساعدة طبية عاجلة.',
        language: 'ar',
        duration: 8.5,
        status: 'processed',
        createdAt: '2024-01-14T09:30:00Z',
        updatedAt: '2024-01-14T09:32:00Z'
      },
      {
        id: 2,
        patientId: 5,
        patientName: 'فاطمة علي',
        appointmentId: 3,
        audioUrl: 'demo-audio-2',
        transcription: 'عندي طفح جلدي في يدي مع حكة شديدة. بدأ منذ أسبوع ويزداد سوءاً.',
        language: 'ar',
        duration: 6.2,
        status: 'processed',
        createdAt: '2024-02-28T14:15:00Z',
        updatedAt: '2024-02-28T14:17:00Z'
      }
    ];
    localStorage.setItem('voiceMessages', JSON.stringify(demoMessages));
  }
};

