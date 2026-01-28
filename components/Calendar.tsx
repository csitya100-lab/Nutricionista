import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  Layers, 
  LayoutList,
  CheckCircle2,
  MoreVertical,
  User,
  ExternalLink
} from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';

type ViewType = 'day' | 'week' | 'month';

export const CalendarView: React.FC = () => {
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 30)); // Mock date

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dates = Array.from({ length: 35 }, (_, i) => i + 1 > 31 ? i + 1 - 31 : i + 1);

  const getDayEvents = (dayNum: number) => {
    return MOCK_APPOINTMENTS.filter(a => a.date.endsWith(`-${dayNum}`));
  };

  const renderMonthView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
      <div className="grid grid-cols-7 mb-4">
        {days.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider pb-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
        {dates.map((date, idx) => {
          const isToday = date === 30;
          const dayEvents = getDayEvents(date);
          
          return (
            <div 
              key={idx} 
              className={`
                min-h-[120px] bg-white p-2 flex flex-col transition-colors cursor-pointer
                ${isToday ? 'bg-rose-50/50' : 'hover:bg-gray-50'}
              `}
            >
              <span className={`text-sm font-bold mb-1 ${isToday ? 'text-wine-600' : 'text-gray-400'}`}>
                {date}
              </span>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={`text-[10px] p-1 rounded truncate border ${
                      event.status === 'Confirmada' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-wine-50 text-wine-700 border-wine-100'
                    }`}
                  >
                    <span className="font-bold">{event.time}</span> {event.patientName.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="grid grid-cols-8 border-b border-gray-100">
        <div className="p-4 border-r border-gray-100 bg-gray-50/50"></div>
        {days.map((day, i) => (
          <div key={day} className="p-4 text-center border-r border-gray-100 last:border-0">
            <p className="text-xs font-bold text-gray-400 uppercase">{day}</p>
            <p className={`text-lg font-bold ${i === 1 ? 'text-wine-600' : 'text-gray-800'}`}>{29 + i}</p>
          </div>
        ))}
      </div>
      <div className="h-[500px] overflow-y-auto">
        {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-50">
            <div className="p-2 text-[10px] font-bold text-gray-400 text-right pr-4 bg-gray-50/30">
              {hour}
            </div>
            {days.map((_, i) => {
              const appointment = MOCK_APPOINTMENTS.find(a => a.time === hour && i === 1); // Simulating Monday (Seg)
              return (
                <div key={i} className="p-1 border-r border-gray-50 last:border-0 min-h-[60px]">
                  {appointment && (
                    <div className="h-full bg-wine-600 text-white p-2 rounded-lg shadow-sm text-xs">
                      <p className="font-bold">{appointment.patientName}</p>
                      <p className="opacity-80 text-[10px]">{appointment.type}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDayView = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Clock className="text-wine-600" size={20} />
          Próximas Consultas - 30 de Outubro
        </h3>
        <div className="space-y-4">
          {MOCK_APPOINTMENTS.map(apt => (
            <div key={apt.id} className="flex items-center gap-6 p-4 rounded-2xl border border-gray-100 hover:border-wine-200 transition-all group">
              <div className="w-20 text-center border-r border-gray-100 pr-4">
                <p className="text-xl font-bold text-wine-800">{apt.time}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Hoje</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-gray-800">{apt.patientName}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    apt.status === 'Confirmada' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {apt.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{apt.type}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-wine-600 hover:bg-wine-50 rounded-xl transition-all">
                  <CheckCircle2 size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-wine-800">Minha Agenda</h2>
          <p className="text-gray-500">Gerencie seus horários e confirmações.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view === 'day' ? 'bg-wine-600 text-white' : 'text-gray-400 hover:text-wine-600'}`}
          >
            <LayoutList size={16} /> Dia
          </button>
          <button 
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view === 'week' ? 'bg-wine-600 text-white' : 'text-gray-400 hover:text-wine-600'}`}
          >
            <Layers size={16} /> Semana
          </button>
          <button 
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view === 'month' ? 'bg-wine-600 text-white' : 'text-gray-400 hover:text-wine-600'}`}
          >
            <CalendarIcon size={16} /> Mês
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-700">Outubro 2023</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-rose-50 rounded-xl text-wine-600 border border-transparent hover:border-rose-100 transition-all"><ChevronLeft /></button>
          <button className="px-6 py-2 bg-rose-50 text-wine-700 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all">Hoje</button>
          <button className="p-2 hover:bg-rose-50 rounded-xl text-wine-600 border border-transparent hover:border-rose-100 transition-all"><ChevronRight /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" /> Confirmações do Dia
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-sm">
                <p className="font-bold text-green-800">3 de 5 confirmados</p>
                <div className="w-full bg-green-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-green-600 h-full w-[60%]"></div>
                </div>
              </div>
              <button className="w-full py-2.5 text-xs font-bold text-wine-600 border border-wine-100 rounded-xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                Enviar Lembretes WhatsApp
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-wine-600 to-rose-400 p-6 rounded-2xl shadow-lg text-white">
            <h4 className="font-bold mb-2">Resumo da Semana</h4>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80">Total Consultas</span>
                <span className="font-bold">28</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80">Retornos</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80">Novas Pacientes</span>
                <span className="font-bold">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};