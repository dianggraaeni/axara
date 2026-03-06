import { useState, useRef, useEffect } from 'react';
import { chatWithGuide } from '../services/gemini';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Halo! Aku Axara, pemandu budaya Nusantara kamu. Ada yang ingin kamu tanyakan tentang budaya, sejarah, atau tradisi di Indonesia?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithGuide(userMsg.text, history);
      
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-64px)] max-w-3xl mx-auto bg-white rounded-3xl border-2 border-cream-dark overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-primary p-4 flex items-center gap-3 text-white">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg">Axara Guide</h2>
          <p className="text-white/80 text-xs font-medium">AI Storyteller & Guide</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-[#D4AF37] text-white' : 'bg-primary text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[75%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-[#D4AF37] text-white rounded-tr-sm' 
                : 'bg-white border-2 border-cream-dark text-text rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white border-2 border-cream-dark p-4 rounded-2xl rounded-tl-sm flex gap-1">
              <div className="w-2 h-2 bg-cream-dark rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-cream-dark rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-cream-dark rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t-2 border-cream-dark">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanya tentang budaya..."
            className="flex-1 bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-colors text-text placeholder:text-text-light font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-primary text-white p-3 rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
