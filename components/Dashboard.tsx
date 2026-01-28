import React from 'react';
import { 
  Users, Calendar, Activity, TrendingUp, ChevronRight, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Patient, Appointment } from '../types';

interface DashboardProps {
  onNavigate: (page: string) => void;
  patients: Patient[];
  appointments: Appointment[];
}

const data = [
  { name: 'Seg', patients: 4 },
  { name: 'Ter', patients: 6 },
  { name: 'Qua', patients: 8 },
  { name: 'Qui', patients: 5 },
  { name: 'Sex', patients: 7 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, patients, appointments }) => {
  // Real stats calculation
  const today = new Date().toISOString().split('T')[0];
  const appointmentsToday = appointments.filter(a => a.date === today).length;
  const pendingAppointments = appointments.filter(a => a.date >= today && a.status === 'Agendada');
  const activePatients = patients.filter(p => p.status === 'Ativo').length;
  
  // Sort next 3 appointments
  const nextAppointments = pendingAppointments
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-wine-800">Bom dia, Maíra! ☀️</h2>
          <p className="text-gray-500 mt-1">Vamos transformar vidas hoje através da nutrição?</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate('new-patient')}
            className="px-6 py-2 bg-white text-wine-600 border-2 border-wine-100 rounded-full font-semibold hover:bg-wine-50 transition-colors"
          >
            Novo Paciente
          </button>
          <button 
            onClick={() => onNavigate('calendar')}
            className="px-6 py-2 bg-gradient-to-r from-wine-600 to-rose-400 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Ver Agenda
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Pacientes Ativas', value: activePatients.toString(), icon: Users, color: 'bg-purple-100 text-purple-700' },
          { title: 'Consultas Hoje', value: appointmentsToday.toString(), icon: Calendar, color: 'bg-rose-100 text-rose-700' },
          { title: 'Total Pacientes', value: patients.length.toString(), icon: Activity, color: 'bg-orange-100 text-orange-700' },
          { title: 'Tentantes', value: patients.filter(p => p.condition === 'Tentante').length.toString(), icon: TrendingUp, color: 'bg-green-100 text-green-700' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Appointments */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Próximos Atendimentos</h3>
            <button onClick={() => onNavigate('calendar')} className="text-rose-500 text-sm font-medium hover:underline">Ver todos</button>
          </div>
          
          <div className="space-y-4">
            {nextAppointments.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nenhum agendamento futuro encontrado.</p>
            ) : nextAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors group cursor-pointer border-l-4 border-transparent hover:border-wine-500">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-wine-100 text-wine-700`}>
                      {apt.time}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800 group-hover:text-wine-700">{apt.patientName}</h4>
                        <span className="text-[10px] text-gray-400 font-normal">({new Date(apt.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})})</span>
                      </div>
                      <p className="text-sm text-gray-500">{apt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {apt.status}
                    </span>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-wine-500" />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Movimento Semanal</h3>
          <p className="text-sm text-gray-500 mb-6">Consultas realizadas nos últimos 5 dias</p>
          
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip cursor={{fill: '#fff1f2'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="patients" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#722F37" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fda4af" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm font-medium text-wine-600">
              Dados simulados para demonstração gráfica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};