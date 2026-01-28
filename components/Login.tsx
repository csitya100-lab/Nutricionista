import React, { useState } from 'react';
import { Flower, User, Lock, ArrowRight, Activity } from 'lucide-react';
import { Patient } from '../types';

interface LoginProps {
  patients: Patient[];
  onLogin: (role: 'admin' | 'patient', patientData?: Patient) => void;
}

export const Login: React.FC<LoginProps> = ({ patients, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'patient'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'admin') {
      // Senha mockada para demonstração
      if (password === 'admin') {
        onLogin('admin');
      } else {
        setError('Senha incorreta. Tente "admin".');
      }
    } else {
      const patient = patients.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (patient) {
        onLogin('patient', patient);
      } else {
        setError('E-mail não encontrado na base de pacientes.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-800 via-wine-600 to-rose-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="bg-rose-50 p-8 text-center border-b border-rose-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-wine-600 mx-auto mb-4 shadow-sm">
            <Flower size={32} />
          </div>
          <h1 className="text-2xl font-black text-wine-800">Maíra Penna Nutri</h1>
          <p className="text-wine-600/80 text-sm mt-1 font-medium">Saúde da Mulher & Endometriose</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'admin' ? 'text-wine-600 border-b-2 border-wine-600 bg-rose-50/30' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => { setActiveTab('admin'); setError(''); }}
          >
            Sou Nutricionista
          </button>
          <button
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'patient' ? 'text-wine-600 border-b-2 border-wine-600 bg-rose-50/30' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => { setActiveTab('patient'); setError(''); }}
          >
            Sou Paciente
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {activeTab === 'admin' ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
               <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100 mb-6">
                <Activity className="text-blue-500 mt-0.5 shrink-0" size={18} />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Acesse seu plano alimentar, acompanhe sua evolução e fale com sua nutri. <br/>
                  <span className="font-bold">Dica de teste: ana.ju@email.com</span>
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">E-mail Cadastrado</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-wine-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-wine-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            Entrar <ArrowRight size={20} />
          </button>
        </form>
        
        <div className="bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-400">© 2026 Maíra Penna Nutrição. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};