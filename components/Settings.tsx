import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Database, Trash2, Save, LogOut, Check, RotateCcw } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
  onResetAll: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onLogout, onResetAll }) => {
  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Maíra Penna',
    role: 'Nutricionista • CRN 12345'
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    appointments: true,
    messages: true,
    diaries: false
  });

  // Load from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('mp_profile');
    const savedNotifs = localStorage.getItem('mp_notifications');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('mp_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    const newNotifs = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifs);
    localStorage.setItem('mp_notifications', JSON.stringify(newNotifs));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-wine-800">Configurações</h2>
        <p className="text-gray-500">Gerencie seu perfil e preferências do sistema.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-wine-100 flex items-center justify-center text-wine-700 text-2xl font-black border-4 border-white shadow-md shrink-0">
          MP
        </div>
        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="space-y-3 max-w-md">
              <input 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full text-xl font-bold text-gray-800 border-b border-gray-200 focus:border-wine-500 focus:outline-none"
                placeholder="Nome Completo"
              />
              <input 
                value={profile.role} 
                onChange={(e) => setProfile({...profile, role: e.target.value})}
                className="w-full text-gray-500 border-b border-gray-200 focus:border-wine-500 focus:outline-none"
                placeholder="Cargo / CRN"
              />
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
              <p className="text-gray-500">{profile.role}</p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
             {isEditing ? (
               <button 
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-wine-600 text-white rounded-lg text-sm font-bold hover:bg-wine-700 transition-colors flex items-center gap-2"
               >
                  <Save size={16} /> Salvar Perfil
               </button>
             ) : (
               <>
                <button className="px-4 py-2 bg-wine-50 text-wine-700 rounded-lg text-sm font-bold hover:bg-wine-100 transition-colors">
                    Alterar Foto
                </button>
                <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                    Editar Perfil
                </button>
               </>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="text-wine-600" size={20} /> Notificações
            </h4>
            <div className="space-y-4">
                <div 
                    onClick={() => toggleNotification('appointments')}
                    className="flex items-center justify-between cursor-pointer group"
                >
                    <span className="text-sm text-gray-600">Lembretes de Consulta</span>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${notifications.appointments ? 'bg-wine-600' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications.appointments ? 'right-1' : 'left-1'}`}></div>
                    </div>
                </div>
                <div 
                    onClick={() => toggleNotification('messages')}
                    className="flex items-center justify-between cursor-pointer group"
                >
                    <span className="text-sm text-gray-600">Novas Mensagens</span>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${notifications.messages ? 'bg-wine-600' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications.messages ? 'right-1' : 'left-1'}`}></div>
                    </div>
                </div>
                <div 
                    onClick={() => toggleNotification('diaries')}
                    className="flex items-center justify-between cursor-pointer group"
                >
                    <span className="text-sm text-gray-600">Diários Enviados</span>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${notifications.diaries ? 'bg-wine-600' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications.diaries ? 'right-1' : 'left-1'}`}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="text-wine-600" size={20} /> Segurança
            </h4>
            <div className="space-y-3">
                 <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex justify-between">
                    Alterar Senha <span>→</span>
                 </button>
                 <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex justify-between">
                    Autenticação em 2 Fatores <span>→</span>
                 </button>
            </div>
        </div>

        {/* System Data */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Database className="text-wine-600" size={20} /> Dados do Sistema
            </h4>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h5 className="font-bold text-red-800">Resetar Aplicação</h5>
                    <p className="text-sm text-red-600/80">Apaga todos os pacientes e consultas criados e restaura o estado inicial.</p>
                </div>
                <button 
                    onClick={onResetAll}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold shadow-sm hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                    <RotateCcw size={18} /> Reiniciar Sistema
                </button>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
         <button 
            onClick={onLogout}
            className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
         >
            <LogOut size={20} /> Sair da Conta
         </button>
      </div>
    </div>
  );
};