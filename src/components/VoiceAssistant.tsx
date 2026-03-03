import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Languages, MessageSquare, X, Send, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAssistantResponse, speakText } from '../services/gemini';
import { LANGUAGES } from '../types';

interface VoiceAssistantProps {
  context: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener('click', initAudio);
    return () => window.removeEventListener('click', initAudio);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang.code;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleSend(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages: Message[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInputText('');

    try {
      console.log("Requesting AI response for:", text);
      const aiResponse = await getAssistantResponse(text, context);
      if (aiResponse) {
        console.log("AI Response received:", aiResponse);
        setMessages([...newMessages, { role: 'assistant', text: aiResponse }]);
        if (!isMuted) {
          console.log("Requesting TTS for response...");
          const audioData = await speakText(aiResponse, selectedLang.name);
          if (audioData) {
            console.log("TTS data received, playing...");
            playAudio(audioData);
          } else {
            console.warn("No TTS data received from Gemini");
          }
        }
      }
    } catch (error) {
      console.error("Assistant error:", error);
    }
  };

  const playAudio = async (base64: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Decode base64 to ArrayBuffer
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert PCM to Float32
      const pcmData = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(pcmData.length);
      for (let i = 0; i < pcmData.length; i++) {
        float32Data[i] = pcmData[i] / 32768.0;
      }

      // Create AudioBuffer (24kHz is standard for Gemini TTS)
      const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      // Play
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      setIsSpeaking(true);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (error) {
      console.error("Playback error:", error);
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-200 w-80 sm:w-[400px] h-[600px] mb-6 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-brand text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-white rotate-45 blur-3xl rounded-full"></div>
              </div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/20 p-1 rounded-xl backdrop-blur-md">
                  <img 
                    src="https://storage.googleapis.com/static.aistudio.google.com/content/file-0-1740314981831-277156942.png" 
                    alt="Digital Azadi" 
                    className="w-10 h-10 object-contain invert brightness-0"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg leading-tight">BIDA AI Mentor</h3>
                  <p className="text-[8px] font-medium opacity-60 uppercase tracking-widest leading-none">Bhaav Institute x Digital Azadi</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 relative z-10">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="hover:bg-white/20 p-2 rounded-xl transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="hover:bg-white/20 p-2 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Languages size={14} />
                <select
                  value={selectedLang.code}
                  onChange={(e) => setSelectedLang(LANGUAGES.find(l => l.code === e.target.value) || LANGUAGES[0])}
                  className="bg-transparent border-none focus:ring-0 cursor-pointer p-0 text-[11px] font-bold text-slate-600"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
              
              {isSpeaking && (
                <div className="flex gap-1 items-center">
                  <span className="text-[10px] font-bold text-brand uppercase tracking-tighter mr-2">Speaking</span>
                  <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-brand rounded-full" />
                  <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-brand rounded-full" />
                  <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-brand rounded-full" />
                </div>
              )}
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/50">
              {messages.length === 0 && (
                <div className="text-center mt-12 px-8">
                  <div className="bg-brand/5 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Mic size={32} className="text-brand" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Voice Command Center</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Tap the microphone and speak. I am your voice-activated AI mentor, ready to help you in your language.
                  </p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-brand/10 text-brand border border-brand/20 rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Voice Only Input Area */}
            <div className="p-12 bg-white border-t border-slate-100 flex flex-col items-center gap-6">
              <div className="relative">
                {isListening && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-brand rounded-full -z-10"
                  />
                )}
                <button
                  onClick={toggleListening}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white shadow-2xl shadow-red-200 scale-110' 
                      : 'bg-brand text-white shadow-xl shadow-brand/20 hover:scale-105'
                  }`}
                >
                  {isListening ? <MicOff size={40} /> : <Mic size={40} />}
                </button>
              </div>
              
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {isListening ? "Listening..." : "Tap to Speak"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group ${
          isOpen ? 'bg-slate-900' : 'bg-brand'
        } text-white p-5 rounded-[2rem] shadow-[0_20px_40px_-12px_rgba(79,70,229,0.4)] flex items-center gap-3 transition-all duration-500`}
      >
        <div className="relative">
          <MessageSquare size={28} className={`${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'} transition-all duration-500`} />
          <X size={28} className={`absolute inset-0 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'} transition-all duration-500`} />
        </div>
        {!isOpen && (
          <span className="font-bold text-lg pr-2 tracking-tight">
            Ask BIDA Assistant
          </span>
        )}
        
        {/* Pulse Effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-[2rem] bg-brand animate-ping opacity-20 pointer-events-none"></span>
        )}
      </motion.button>
    </div>
  );
};
