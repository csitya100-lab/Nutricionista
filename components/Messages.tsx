import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  MoreVertical, 
  Phone, 
  Video,
  Check,
  CheckCheck,
  User,
  ArrowLeft
} from 'lucide-react';
import { Patient } from '../types';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image';
  attachmentUrl?: string;
}

interface MessagesViewProps {
  patients: Patient[];
}

const INITIAL_CHAT_HISTORY: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'Bom dia, Maíra! Consegui seguir o café da manhã hoje.', timestamp: '08:30', status: 'read', type: 'text' },
    { id: 'm2', senderId: 'maira', text: 'Que ótimo, Ana! Como se sentiu?', timestamp: '08:45', status: 'read', type: 'text' },
    { id: 'm3', senderId: '1', text: 'Muito bem, sem aquele inchaço de costume.', timestamp: '09:00', status: 'read', type: 'text' },
  ],
  '4': [
    { id: 'm4', senderId: '4', text: 'Maíra, posso substituir o arroz negro por quinoa no almoço?', timestamp: '10:15', status: 'read', type: 'text' },
    { id: 'm5', senderId: 'maira', text: 'Pode sim, Mariana! A proporção é a mesma.', timestamp: '10:20', status: 'read', type: 'text' },
  ]
};

export const MessagesView: React.FC<MessagesViewProps> = ({ patients }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>(INITIAL_CHAT_HISTORY);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const chatMessages = selectedPatientId ? (chatHistory[selectedPatientId] || []) : [];

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPatientId) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'maira',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'text'
    };

    setChatHistory(prev => ({
      ...prev,
      [selectedPatientId]: [...(prev[selectedPatientId] || []), newMsg]
    }));
    
    setNewMessage('');
    
    // Simulating message read status update after 1 second
    setTimeout(() => {
        setChatHistory(prev => {
            const currentMsgs = prev[selectedPatientId] || [];
            const updatedMsgs = currentMsgs.map(m => 
                m.id === newMsg.id ? { ...m, status: 'read' as const } : m
            );
            return {
                ...prev,
                [selectedPatientId]: updatedMsgs
            };
        });
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-160px)] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex animate-fade-in">
      {/* Sidebar - Chat List */}
      <div className={`
        w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col bg-white
        ${selectedPatientId && 'hidden md:flex'}
      `}>
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-black text-wine-800 mb-4">Mensagens</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-wine-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredPatients.map((patient) => {
            const history = chatHistory[patient.id] || [];
            const lastMsg = history.length > 0 ? history[history.length - 1] : null;
            
            return (
              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={`
                  w-full p-4 flex items-center gap-4 transition-all border-l-4
                  ${selectedPatientId === patient.id 
                    ? 'bg-rose-50/50 border-wine-600' 
                    : 'bg-white border-transparent hover:bg-gray-50'}
                `}
              >
                <div className="relative">
                  <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-800 truncate">{patient.name}</h4>
                    <span className="text-[10px] text-gray-400 font-bold">{lastMsg?.timestamp || ''}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {lastMsg ? (lastMsg.senderId === 'maira' ? 'Você: ' : '') + lastMsg.text : 'Iniciar conversa...'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`
        flex-1 flex flex-col bg-rose-50/20
        ${!selectedPatientId && 'hidden md:flex items-center justify-center'}
      `}>
        {selectedPatient ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedPatientId(null)} 
                  className="md:hidden p-2 text-gray-400 hover:text-wine-600"
                >
                  <ArrowLeft size={20} />
                </button>
                <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{selectedPatient.name}</h3>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Online agora</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-wine-600 hover:bg-rose-50 rounded-xl transition-all"><Phone size={20} /></button>
                <button className="p-2 text-gray-400 hover:text-wine-600 hover:bg-rose-50 rounded-xl transition-all"><Video size={20} /></button>
                <button className="p-2 text-gray-400 hover:text-wine-600 hover:bg-rose-50 rounded-xl transition-all"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar flex flex-col-reverse">
                {/* flex-col-reverse keeps scroll at bottom, so we reverse the map order if needed, or scroll manually. 
                    Standard CSS approach is simpler: */}
                <div className="flex flex-col space-y-4 justify-end min-h-full">
                    <div className="flex justify-center mb-6">
                        <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-[10px] font-bold text-gray-400 uppercase rounded-full shadow-sm border border-gray-100">
                        Hoje
                        </span>
                    </div>

                    {chatMessages.length === 0 && (
                        <div className="text-center text-gray-400 text-sm py-10">
                            Nenhuma mensagem ainda. Envie um "Olá" para começar!
                        </div>
                    )}

                    {chatMessages.map((msg) => {
                        const isMe = msg.senderId === 'maira';
                        return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                            <div className={`
                            max-w-[80%] md:max-w-[60%] p-4 rounded-2xl shadow-sm text-sm
                            ${isMe 
                                ? 'bg-wine-600 text-white rounded-tr-none' 
                                : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'}
                            `}>
                            <p className="leading-relaxed">{msg.text}</p>
                            <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-rose-100' : 'text-gray-400'}`}>
                                {msg.timestamp}
                                {isMe && (msg.status === 'read' ? <CheckCheck size={12} /> : <Check size={12} />)}
                            </div>
                            </div>
                        </div>
                        );
                    })}
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
              <button type="button" className="p-2 text-gray-400 hover:text-wine-600 transition-all"><Paperclip size={22} /></button>
              <button type="button" className="p-2 text-gray-400 hover:text-wine-600 transition-all"><ImageIcon size={22} /></button>
              <input 
                type="text" 
                placeholder="Escreva uma mensagem..." 
                className="flex-1 px-4 py-2.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-wine-500 text-sm"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className={`
                  p-3 rounded-2xl shadow-lg transition-all
                  ${newMessage.trim() 
                    ? 'bg-wine-600 text-white hover:scale-105 active:scale-95' 
                    : 'bg-gray-100 text-gray-300'}
                `}
              >
                <Send size={22} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-wine-200 mb-6">
              <User size={40} />
            </div>
            <h3 className="text-xl font-bold text-wine-800">Selecione uma conversa</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-xs">
              Escolha um paciente na lista ao lado para ver o histórico de mensagens e responder dúvidas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};