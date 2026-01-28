import React, { useState } from 'react';
import { 
  Droplets, Utensils, Dumbbell, CheckCircle2, Target, Plus, Flag, Trash2, RefreshCcw, StickyNote 
} from 'lucide-react';
import { Patient, PatientGoal, PatientTracking } from '../types';

interface PatientDetailOverviewProps {
  patient: Patient;
  trackingData: PatientTracking;
  goals: PatientGoal[];
  onUpdateGoals: (goals: PatientGoal[]) => void;
  onAddWater: () => void;
}

export const PatientDetailOverview: React.FC<PatientDetailOverviewProps> = ({ 
  patient, 
  trackingData, 
  goals, 
  onUpdateGoals,
  onAddWater 
}) => {
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const handleAddGoal = () => {
    if(!newGoalDesc) return;
    const newGoal: PatientGoal = {
        id: Date.now().toString(),
        description: newGoalDesc,
        deadline: newGoalDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        status: 'Em andamento',
        progress: 0
    };
    onUpdateGoals([...goals, newGoal]);
    setNewGoalDesc('');
    setNewGoalDate('');
    setIsAddingGoal(false);
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    const updatedGoals = goals.map(g => {
        if(g.id === id) {
            return { 
                ...g, 
                progress: newProgress,
                status: newProgress === 100 ? 'Concluída' : 'Em andamento' as any
            };
        }
        return g;
    });
    onUpdateGoals(updatedGoals);
  };

  const handleDeleteGoal = (id: string) => {
    onUpdateGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="py-6 space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2 tracking-widest">Hidratação</span>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 font-black text-lg">
                    <Droplets size={20} /> {trackingData.waterGlassCount}/{trackingData.waterGoal}
                </div>
                <button onClick={onAddWater} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">
                    <Plus size={16} />
                </button>
            </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2 tracking-widest">Refeições</span>
            <div className="flex items-center gap-2 text-green-600 font-black text-lg">
                <Utensils size={20} /> {trackingData.meals.length} logs
            </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2 tracking-widest">Atividade</span>
            <div className="flex items-center gap-2 text-purple-600 font-black text-lg truncate">
                <Dumbbell size={20} /> {trackingData.activities[0]?.name || 'Descanso'}
            </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2 tracking-widest">Adesão Geral</span>
            <div className="flex items-center gap-2 text-wine-600 font-black text-lg">
                <CheckCircle2 size={20} /> 85%
            </div>
        </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <Target className="text-wine-600" size={20} /> Metas Terapêuticas
                </h3>
                {!isAddingGoal && (
                    <button 
                        onClick={() => setIsAddingGoal(true)}
                        className="text-xs font-bold text-wine-600 bg-wine-50 px-3 py-1.5 rounded-lg hover:bg-wine-100 transition-colors flex items-center gap-1"
                    >
                        <Plus size={14} /> Nova Meta
                    </button>
                )}
            </div>
            
            <div className="space-y-4 flex-1">
                {goals.map((goal) => (
                    <div key={goal.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-wine-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-bold text-gray-700 text-sm">{goal.description}</p>
                                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                    <Flag size={10} /> Prazo: {new Date(goal.deadline).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${goal.status === 'Concluída' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {goal.status}
                                </span>
                                <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-300 hover:text-red-500">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-gray-500">Progresso</span>
                                <span className="font-bold text-wine-600">{goal.progress}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={goal.progress} 
                                onChange={(e) => handleUpdateProgress(goal.id, Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-wine-600"
                            />
                        </div>
                    </div>
                ))}
                
                {isAddingGoal && (
                    <div className="p-4 bg-wine-50/50 rounded-xl border border-wine-100 animate-fade-in">
                        <input 
                            type="text" 
                            placeholder="Descrição da meta (ex: Perder 2kg)"
                            className="w-full p-2 text-sm border border-gray-200 rounded-lg mb-2 focus:border-wine-500 focus:outline-none"
                            value={newGoalDesc}
                            onChange={(e) => setNewGoalDesc(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <input 
                                type="date" 
                                className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:border-wine-500 focus:outline-none"
                                value={newGoalDate}
                                onChange={(e) => setNewGoalDate(e.target.value)}
                            />
                            <button 
                                onClick={handleAddGoal}
                                className="px-4 py-2 bg-wine-600 text-white rounded-lg text-xs font-bold hover:bg-wine-700"
                            >
                                Adicionar
                            </button>
                            <button 
                                onClick={() => setIsAddingGoal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {goals.length === 0 && !isAddingGoal && (
                    <div className="text-center py-8 text-gray-400">
                        <Target className="mx-auto mb-2 opacity-20" size={32} />
                        <p className="text-sm">Nenhuma meta definida ainda.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Next Visit & Notes */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-wine-600 mb-3">
                    <RefreshCcw size={32} />
                </div>
                <h4 className="font-bold text-gray-800">Próximo Retorno</h4>
                <p className="text-sm text-gray-500 mb-4">Sugerido para 15 de Novembro</p>
                <button className="px-6 py-2 bg-wine-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">Agendar Agora</button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <StickyNote size={18} className="text-yellow-500" /> Notas de Evolução
                </h3>
                <textarea 
                    className="w-full h-32 p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-wine-500 text-sm resize-none"
                    placeholder="Adicione notas sobre a evolução clínica..."
                ></textarea>
            </div>
        </div>
        </div>
    </div>
  );
};