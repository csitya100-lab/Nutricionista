import React, { useState } from 'react';
import { 
  Home, Utensils, Activity, MessageCircle, LogOut, Calendar, 
  Droplets, CheckCircle2, Trophy, Settings, Bell, Lock, HelpCircle, ChevronRight,
  Plus, Clock, ArrowRight, Send, Paperclip, CheckCheck, Check, Camera
} from 'lucide-react';
import { Patient, Appointment } from '../types';
import { PatientDetailDiet } from './PatientDetailDiet';
import { PatientDetailAnthropometry } from './PatientDetailAnthropometry';

interface PatientPortalProps {
  patient: Patient;
  appointments: Appointment[];
  onLogout: () => void;
}

interface ChatMessage {
    id: string;
    text: string;
    isMe: boolean;
    time: string;
    status: 'sent' | 'read';
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ patient, appointments, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'diet' | 'evolution' | 'chat' | 'settings'>('home');
  const [waterCount, setWaterCount] = useState(patient.tracking?.waterGlassCount || 0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Olá! Como está se sentindo com a nova dieta?', isMe: false, time: '09:00', status: 'read' },
    { id: '2', text: 'Estou me adaptando bem! O inchaço diminuiu.', isMe: true, time: '09:15', status: 'read' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const nextAppointment = appointments
    .filter(a => a.patientId === patient.id && a.status === 'Agendada' && a.date >= new Date().toISOString().split('T')[0])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const getNextMeal = () => {
    if (!patient.mealPlan?.meals) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Convert time to minutes and sort
    const sorted = [...patient.mealPlan.meals].sort((a, b) => {
        const [hA, mA] = a.time.split(':').map(Number);
        const [hB, mB] = b.time.split(':').map(Number);
        return (hA * 60 + mA) - (hB * 60 + mB);
    });

    // Find first meal after current time
    const next = sorted.find(m => {
        const [h, min] = m.time.split(':').map(Number);
        return (h * 60 + min) > currentMinutes;
    });

    return next || sorted[0]; // Loop to breakfast if late
  };

  const nextMeal = getNextMeal();

  const handleAddWater = () => {
      setWaterCount(prev => prev + 1);
      // In a real app, this would sync to the backend/localStorage via a prop handler
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newMessage.trim()) return;
      const msg: ChatMessage = {
          id: Date.now().toString(),
          text: newMessage,
          isMe: true,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          status: 'sent'
      };
      setMessages([...messages, msg]);
      setNewMessage('');
  };

  const renderContent = () => {
    switch (activeTab) {
        case 'home':
            return (
                <div className="space-y-6 animate-fade-in pb-20">
                    {/* Header Personalized */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Olá, {patient.name.split(' ')[0]} <span className="text-xl">👋</span></h1>
                            <p className="text-gray-500 text-sm">Vamos cuidar de você hoje?</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-rose-100 p-0.5 border-2 border-white shadow-sm">
                            <img src={patient.avatarUrl} className="w-full h-full rounded-full object-cover" alt="Profile" />
                        </div>
                    </div>

                    {/* Next Meal Card - HERO */}
                    {nextMeal ? (
                         <div className="bg-gradient-to-r from-wine-600 to-rose-500 rounded-3xl p-6 text-white shadow-xl shadow-rose-200 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Clock size={12} /> Próxima Refeição • {nextMeal.time}
                                    </div>
                                    <button onClick={() => setActiveTab('diet')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">{nextMeal.name}</h3>
                                <p className="text-white/80 text-sm mb-4 line-clamp-1">
                                    {nextMeal.items.map(i => i.name).join(', ')}
                                </p>
                                <button onClick={() => setActiveTab('diet')} className="w-full bg-white text-wine-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    Ver Detalhes <ArrowRight size={14} />
                                </button>
                            </div>
                            {/* Decorational */}
                            <Utensils className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32 rotate-12" />
                        </div>
                    ) : (
                         <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-3xl p-6 text-white shadow-lg">
                            <p className="font-bold">Plano Alimentar não encontrado</p>
                            <p className="text-sm opacity-70">Aguarde sua nutri liberar o plano.</p>
                         </div>
                    )}

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Hydration Widget */}
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 relative overflow-hidden group">
                             <div className="flex justify-between items-start z-10">
                                 <div>
                                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hidratação</p>
                                     <p className="text-3xl font-black text-blue-500 mt-1">{waterCount}<span className="text-base font-medium text-gray-300">/{patient.tracking?.waterGoal}</span></p>
                                 </div>
                                 <div className="bg-blue-50 text-blue-500 p-2 rounded-full"><Droplets size={18}/></div>
                             </div>
                             <button 
                                onClick={handleAddWater}
                                className="w-full bg-blue-500 text-white py-2 rounded-xl font-bold text-sm mt-auto shadow-blue-200 shadow-md active:scale-95 transition-all z-10 flex items-center justify-center gap-1"
                             >
                                <Plus size={16} /> Beber
                             </button>
                             {/* Liquid Effect */}
                             <div className="absolute bottom-0 left-0 w-full bg-blue-50 h-1/3 z-0 group-hover:h-1/2 transition-all duration-500 opacity-50 rounded-b-3xl"></div>
                        </div>

                        {/* Next Appointment or Goal */}
                        {nextAppointment ? (
                            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Consulta</p>
                                    <p className="font-bold text-gray-800 mt-2 text-sm leading-tight">
                                        {new Date(nextAppointment.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}
                                    </p>
                                    <p className="text-2xl font-black text-wine-600">{nextAppointment.time}</p>
                                </div>
                                <div className="mt-auto pt-2 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-500">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Confirmada
                                </div>
                            </div>
                        ) : (
                             <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Foco Principal</p>
                                    <p className="font-bold text-gray-800 mt-2 text-sm line-clamp-3">
                                        {patient.goals?.[0]?.description || "Manter a constância!"}
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${patient.goals?.[0]?.progress || 0}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-rose-50 hover:bg-rose-100 transition-colors p-4 rounded-2xl flex items-center gap-3 text-left">
                            <div className="bg-white p-2 rounded-full text-rose-500 shadow-sm"><Camera size={18} /></div>
                            <div>
                                <p className="font-bold text-wine-800 text-sm">Diário Visual</p>
                                <p className="text-[10px] text-wine-600/70">Fotografar refeição</p>
                            </div>
                        </button>
                        <button className="bg-purple-50 hover:bg-purple-100 transition-colors p-4 rounded-2xl flex items-center gap-3 text-left">
                            <div className="bg-white p-2 rounded-full text-purple-500 shadow-sm"><Activity size={18} /></div>
                            <div>
                                <p className="font-bold text-purple-900 text-sm">Sintomas</p>
                                <p className="text-[10px] text-purple-700/70">Como se sente?</p>
                            </div>
                        </button>
                    </div>

                </div>
            );
        case 'diet':
            return (
                <div className="space-y-4 pb-20">
                    <h2 className="text-xl font-bold text-wine-800 px-2 flex items-center gap-2">
                        <Utensils size={20} className="text-wine-600" /> Meu Plano
                    </h2>
                    <PatientDetailDiet 
                        patient={patient} 
                        mealPlanData={patient.mealPlan} 
                        onSaveMealPlan={() => {}} 
                        readOnly={true} 
                    />
                </div>
            );
        case 'evolution':
            return (
                <div className="space-y-4 pb-20">
                    <h2 className="text-xl font-bold text-wine-800 px-2 flex items-center gap-2">
                         <Activity size={20} className="text-wine-600" /> Minha Evolução
                    </h2>
                    <PatientDetailAnthropometry data={patient.anthropometry || []} onUpdate={() => {}} />
                </div>
            );
        case 'chat':
            return (
                <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-white border-b border-gray-50 flex items-center gap-3 shadow-sm z-10">
                        <div className="w-10 h-10 rounded-full bg-wine-100 flex items-center justify-center text-wine-700 font-bold border-2 border-white shadow-sm">
                            MP
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">Maíra Penna</h3>
                            <p className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-rose-50/30">
                         {/* Date Separator */}
                         <div className="flex justify-center my-2">
                            <span className="text-[10px] bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Hoje</span>
                         </div>

                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.isMe ? 'bg-wine-600 text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'}`}>
                                    <p>{msg.text}</p>
                                    <div className={`text-[10px] mt-1 flex justify-end gap-1 ${msg.isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                        {msg.time}
                                        {msg.isMe && (
                                            msg.status === 'read' ? <CheckCheck size={12} /> : <Check size={12} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                        <button type="button" className="p-2 text-gray-400 hover:text-wine-600 rounded-full hover:bg-rose-50 transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 bg-gray-50 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-wine-500 focus:bg-white transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            className="p-2.5 bg-wine-600 text-white rounded-full disabled:opacity-50 disabled:bg-gray-200 shadow-md hover:scale-105 active:scale-95 transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            );
        case 'settings':
             return (
                <div className="space-y-6 animate-fade-in pb-20">
                  <h2 className="text-xl font-bold text-wine-800 px-2 flex items-center gap-2">
                    <Settings size={20} className="text-wine-600" /> Minha Conta
                  </h2>
                  
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <img src={patient.avatarUrl} alt={patient.name} className="w-16 h-16 rounded-full object-cover border-2 border-rose-100" />
                    <div>
                        <h3 className="font-bold text-gray-800">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                        <span className="text-[10px] bg-wine-100 text-wine-700 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">
                            {patient.condition}
                        </span>
                    </div>
                </div>
    
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                     <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                        <span className="flex items-center gap-3 text-gray-700 font-medium">
                            <Bell size={20} className="text-wine-600"/> Lembretes de Água
                        </span>
                        <div className="w-10 h-6 bg-wine-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div>
                    </div>
                     <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                        <span className="flex items-center gap-3 text-gray-700 font-medium">
                            <Calendar size={20} className="text-wine-600"/> Lembretes de Consulta
                        </span>
                        <div className="w-10 h-6 bg-wine-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div>
                    </div>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left transition-colors">
                        <span className="flex items-center gap-3 text-gray-700 font-medium">
                            <Lock size={20} className="text-wine-600"/> Alterar Senha
                        </span>
                        <ChevronRight size={16} className="text-gray-400"/>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left transition-colors">
                         <span className="flex items-center gap-3 text-gray-700 font-medium">
                            <HelpCircle size={20} className="text-wine-600"/> Ajuda e Suporte
                        </span>
                        <ChevronRight size={16} className="text-gray-400"/>
                    </button>
                </div>
    
                 <button 
                    onClick={onLogout}
                    className="w-full py-4 bg-rose-50 text-wine-700 rounded-2xl font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 border border-rose-100"
                 >
                    <LogOut size={20} /> Sair do Aplicativo
                 </button>
                 
                 <p className="text-center text-xs text-gray-400">Versão 1.0.0 • Maíra Penna Nutri</p>
            </div>
             );
        default: 
            return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-rose-50/50">
        {/* Mobile Header (Hidden in specific tabs to save space/clean look, or kept minimal) */}
        {activeTab !== 'chat' && (
            <header className="bg-white/80 backdrop-blur-md p-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="text-wine-600 p-1.5 bg-rose-50 rounded-lg">
                        <Activity size={20} />
                    </div>
                    <span className="font-black text-wine-800 text-sm tracking-tight">Portal do Paciente</span>
                </div>
                {/* Top Actions */}
                <button onClick={() => setActiveTab('settings')} className="p-2 text-gray-400 hover:text-wine-600 transition-colors">
                    <Settings size={20} />
                </button>
            </header>
        )}

        {/* Content */}
        <main className={`flex-1 overflow-y-auto p-4 max-w-xl mx-auto w-full ${activeTab === 'chat' ? 'pt-4' : ''}`}>
            {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] px-4 py-2 flex justify-between items-center z-30 md:max-w-xl md:left-1/2 md:-translate-x-1/2 md:rounded-t-3xl md:bottom-4 md:shadow-xl">
            {[
                { id: 'home', icon: Home, label: 'Início' },
                { id: 'diet', icon: Utensils, label: 'Dieta' },
                { id: 'evolution', icon: Activity, label: 'Evolução' },
                { id: 'chat', icon: MessageCircle, label: 'Chat' },
                { id: 'settings', icon: Settings, label: 'Perfil' },
            ].map((item) => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${activeTab === item.id ? 'text-wine-600 bg-rose-50 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                    <span className="text-[9px]">{item.label}</span>
                </button>
            ))}
        </nav>
    </div>
  );
};