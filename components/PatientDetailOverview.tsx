import React, { useState } from 'react';
import { 
  Droplets, Utensils, Dumbbell, CheckCircle2, Target, Plus, Flag, Trash2, RefreshCcw, StickyNote,
  Calendar, Trophy, Clock, RotateCcw
} from 'lucide-react';
import { Patient, PatientGoal, PatientTracking } from '../types';

interface PatientDetailOverviewProps {
  patient: Patient;
  trackingData: PatientTracking;
  goals: PatientGoal[];
  onUpdateGoals: (goals: PatientGoal[]) => void;
  onAddWater: () => void;
  onResetWater?: () => void;
}

export const PatientDetailOverview: React.FC<PatientDetailOverviewProps> = ({ 
  patient, 
  trackingData, 
  goals, 
  onUpdateGoals,
  onAddWater,
  onResetWater
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
    if(confirm('Tem certeza que deseja remover esta meta?')) {
        onUpdateGoals(goals.filter(g => g.id !== id));
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
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
                <div className="flex gap-1">
                    {onResetWater && trackingData.waterGlassCount > 0 && (
                        <button onClick={onResetWater} title="Zerar" className="p-1.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-all">
                            <RotateCcw size={16} />
                        </button>
                    )}
                    <button onClick={onAddWater} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">
                        <Plus size={16} />
                    </button>
                </div>
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
                <div>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        <Target className="text-wine-600" size={20} /> Metas Terapêuticas
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Acompanhamento de objetivos clínicos</p>
                </div>
                {!isAddingGoal && (
                    <button 
                        onClick={() => setIsAddingGoal(true)}
                        className="text-xs font-bold text-white bg-wine-600 px-4 py-2 rounded-xl hover:bg-wine-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Nova Meta
                    </button>
                )}
            </div>
            
            <div className="space-y-6 flex-1">
                {goals.map((goal) => {
                    const daysLeft = getDaysRemaining(goal.deadline);
                    const isCompleted = goal.progress === 100;
                    
                    return (
                        <div key={goal.id} className={`p-5 rounded-2xl border transition-all relative overflow-hidden group ${isCompleted ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-100 hover:border-wine-200 hover:shadow-md'}`}>
                            {isCompleted && (
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <Trophy size={80} className="text-green-600" />
                                </div>
                            )}
                            
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 p-2 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-wine-50 text-wine-600'}`}>
                                        {isCompleted ? <Trophy size={18} /> : <Flag size={18} />}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-base ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>{goal.description}</h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 ${daysLeft < 0 && !isCompleted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <Calendar size={10} /> 
                                                {daysLeft < 0 ? 'Atrasado' : `${daysLeft} dias restantes`}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {goal.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold text-gray-400">Progresso</span>
                                    <span className={`text-xl font-black ${isCompleted ? 'text-green-600' : 'text-wine-600'}`}>
                                        {goal.progress}%
                                    </span>
                                </div>
                                
                                <div className="relative h-4 bg-gray-100 rounded-full mb-3 shadow-inner">
                                    <div 
                                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-rose-400 to-wine-600'}`}
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                    <div className="absolute top-0 left-[25%] h-full w-0.5 bg-white/30"></div>
                                    <div className="absolute top-0 left-[50%] h-full w-0.5 bg-white/30"></div>
                                    <div className="absolute top-0 left-[75%] h-full w-0.5 bg-white/30"></div>
                                </div>

                                <input 
                                    type="range" 
                                    min="0" max="100" 
                                    step="5"
                                    value={goal.progress} 
                                    onChange={(e) => handleUpdateProgress(goal.id, Number(e.target.value))}
                                    className={`w-full h-1 bg-transparent appearance-none cursor-pointer ${isCompleted ? 'accent-green-600' : 'accent-wine-600'}`}
                                />
                                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium px-1">
                                    <span>Início</span>
                                    <span>Meio do Caminho</span>
                                    <span>Objetivo</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {isAddingGoal && (
                    <div className="p-6 bg-wine-50/50 rounded-2xl border-2 border-dashed border-wine-200 animate-slide-up">
                        <h4 className="font-bold text-wine-800 mb-4 flex items-center gap-2">
                            <Plus size={18} /> Adicionar Nova Meta
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Reduzir consumo de açúcar..."
                                    className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:border-wine-500 focus:ring-2 focus:ring-wine-200 focus:outline-none bg-white"
                                    value={newGoalDesc}
                                    onChange={(e) => setNewGoalDesc(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Prazo Limite</label>
                                <input 
                                    type="date" 
                                    className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:border-wine-500 focus:ring-2 focus:ring-wine-200 focus:outline-none bg-white"
                                    value={newGoalDate}
                                    onChange={(e) => setNewGoalDate(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={handleAddGoal}
                                    className="flex-1 py-3 bg-wine-600 text-white rounded-xl text-sm font-bold hover:bg-wine-700 shadow-md transition-all"
                                >
                                    Confirmar Meta
                                </button>
                                <button 
                                    onClick={() => setIsAddingGoal(false)}
                                    className="px-6 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {goals.length === 0 && !isAddingGoal && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mx-auto mb-3 shadow-sm">
                            <Target size={32} />
                        </div>
                        <h4 className="font-bold text-gray-600">Nenhuma meta ativa</h4>
                        <p className="text-sm text-gray-400 mb-4">Defina objetivos para acompanhar a evolução.</p>
                        <button 
                            onClick={() => setIsAddingGoal(true)}
                            className="text-sm font-bold text-wine-600 hover:underline"
                        >
                            Criar primeira meta
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Next Visit & Notes */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-wine-600 mb-3 animate-pulse">
                    <RefreshCcw size={32} />
                </div>
                <h4 className="font-bold text-gray-800">Próximo Retorno</h4>
                <p className="text-sm text-gray-500 mb-4">Sugerido para 15 de Novembro</p>
                <button className="px-6 py-3 bg-wine-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all w-full flex items-center justify-center gap-2">
                    <Calendar size={18} /> Agendar Agora
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <StickyNote size={18} className="text-yellow-500" /> Notas de Evolução
                </h3>
                <textarea 
                    className="w-full h-40 p-4 bg-yellow-50/30 rounded-xl border border-yellow-100 focus:ring-2 focus:ring-wine-500 focus:border-transparent text-sm resize-none text-gray-700 leading-relaxed"
                    placeholder="Adicione notas sobre a evolução clínica, feedback da paciente sobre as metas..."
                ></textarea>
            </div>
        </div>
        </div>
    </div>
  );
};