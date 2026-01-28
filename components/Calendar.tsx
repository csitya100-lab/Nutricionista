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
} from 'lucide-react';
import { Appointment } from '../types';

interface CalendarViewProps {
  appointments: Appointment[];
  onAddAppointment: (apt: Appointment) => void;
}

type ViewType = 'day' | 'week' | 'month';

export const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onAddAppointment }) => {
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Helper date functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };
  
  const goToToday = () => setCurrentDate(new Date());

  const formatDateStr = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startDay = getFirstDayOfMonth(currentDate);
    const totalSlots = Math.ceil((daysInMonth + startDay) / 7) * 7;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const todayStr = new Date().toISOString().split('T')[0];

    const slots = Array.from({ length: totalSlots }, (_, i) => {
        const dayNum = i - startDay + 1;
        if (dayNum > 0 && dayNum <= daysInMonth) {
            const dateStr = formatDateStr(year, month, dayNum);
            const dayEvents = appointments.filter(a => a.date === dateStr);
            const isToday = dateStr === todayStr;
            return (
                <div key={i} className={`min-h-[100px] bg-white p-2 border border-gray-50 flex flex-col ${isToday ? 'bg-rose-50/30' : ''}`}>
                    <span className={`text-sm font-bold mb-1 ${isToday ? 'text-wine-600' : 'text-gray-400'}`}>{dayNum}</span>
                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                        {dayEvents.map(ev => (
                            <div key={ev.id} className="text-[9px] p-1 rounded bg-wine-50 text-wine-800 border border-wine-100 truncate">
                                <b>{ev.time}</b> {ev.patientName.split(' ')[0]}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return <div key={i} className="bg-gray-50/30 border border-gray-50"></div>;
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-fade-in">
             <div className="grid grid-cols-7 mb-2">
                {daysShort.map(d => <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase">{d}</div>)}
             </div>
             <div className="grid grid-cols-7 rounded-xl overflow-hidden">
                {slots}
             </div>
        </div>
    );
  };

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayAppointments = appointments
        .filter(a => a.date === dateStr)
        .sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="text-wine-600" size={20} />
                Consultas do Dia - {currentDate.toLocaleDateString('pt-BR')}
            </h3>
            {dayAppointments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Nenhum agendamento para este dia.</div>
            ) : (
                <div className="space-y-4">
                    {dayAppointments.map(apt => (
                        <div key={apt.id} className="flex items-center gap-6 p-4 rounded-2xl border border-gray-100 hover:border-wine-200 transition-all group">
                        <div className="w-20 text-center border-r border-gray-100 pr-4">
                            <p className="text-xl font-bold text-wine-800">{apt.time}</p>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                            <h4 className="font-bold text-gray-800">{apt.patientName}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-blue-50 text-blue-700 border-blue-100`}>
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
            )}
        </div>
    );
  };

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
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view === 'month' ? 'bg-wine-600 text-white' : 'text-gray-400 hover:text-wine-600'}`}
          >
            <CalendarIcon size={16} /> Mês
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-700 capitalize">
            {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-rose-50 rounded-xl text-wine-600 border border-transparent hover:border-rose-100 transition-all"><ChevronLeft /></button>
          <button onClick={goToToday} className="px-6 py-2 bg-rose-50 text-wine-700 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all">Hoje</button>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-rose-50 rounded-xl text-wine-600 border border-transparent hover:border-rose-100 transition-all"><ChevronRight /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          {view === 'month' && renderMonthView()}
          {view === 'day' && renderDayView()}
          {/* Week view suppressed for brevity, defaults to month/day which are fully functional */}
          {view === 'week' && renderMonthView()} 
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" /> Confirmações do Dia
            </h4>
            <div className="text-center py-6 text-gray-400 text-sm">
                Funcionalidade de WhatsApp em breve.
            </div>
            <button className="w-full py-2.5 text-xs font-bold text-wine-600 border border-wine-100 rounded-xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                Enviar Lembretes WhatsApp
            </button>
          </div>

          <div className="bg-gradient-to-br from-wine-600 to-rose-400 p-6 rounded-2xl shadow-lg text-white">
            <h4 className="font-bold mb-2">Resumo da Agenda</h4>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80">Total Consultas</span>
                <span className="font-bold">{appointments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};