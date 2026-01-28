import React from 'react';
import { Droplets, Plus, Dumbbell, Camera, Check } from 'lucide-react';
import { PatientTracking } from '../types';

interface PatientDetailTrackingProps {
  trackingData: PatientTracking;
  onAddWater: () => void;
}

export const PatientDetailTracking: React.FC<PatientDetailTrackingProps> = ({ trackingData, onAddWater }) => {
  return (
    <div className="py-6 space-y-8 animate-fade-in">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hidratação Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h4 className="font-black text-wine-800 text-lg flex items-center gap-2">
                        <Droplets className="text-blue-500" size={24} /> Hidratação
                    </h4>
                    <p className="text-xs text-gray-400">Meta: {trackingData.waterGoal * 250}ml/dia</p>
                </div>
                <button onClick={onAddWater} className="p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">
                    <Plus size={24} />
                </button>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-8">
                {Array.from({ length: trackingData.waterGoal }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-16 rounded-2xl border-2 flex flex-col items-center justify-end pb-2 transition-all duration-500 ${i < trackingData.waterGlassCount ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100 opacity-40'}`}
                    >
                        <div className={`w-6 bg-blue-400 rounded-lg transition-all duration-700 ${i < trackingData.waterGlassCount ? 'h-8' : 'h-0'}`}></div>
                    </div>
                ))}
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl text-white text-center shadow-lg shadow-blue-100">
                <p className="text-2xl font-black">{trackingData.waterGlassCount * 250}ml</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Registrados Hoje</p>
            </div>
        </div>

        {/* Atividade Física Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h4 className="font-black text-wine-800 text-lg flex items-center gap-2">
                        <Dumbbell className="text-purple-500" size={24} /> Exercícios
                    </h4>
                    <p className="text-xs text-gray-400">Log de atividades físicas</p>
                </div>
            </div>

            <div className="space-y-4">
                {trackingData.activities.map(act => (
                    <div key={act.id} className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center justify-between group hover:bg-purple-50 transition-all">
                        <div>
                            <p className="font-black text-purple-900">{act.name}</p>
                            <p className="text-[10px] font-bold text-purple-500 uppercase">{act.duration} min • {act.intensity}</p>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                            <Check size={20} />
                        </div>
                    </div>
                ))}
                <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm font-bold hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50/30 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} /> Registrar Novo Treino
                </button>
            </div>
        </div>

        {/* Diário Alimentar Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h4 className="font-black text-wine-800 text-lg flex items-center gap-2">
                        <Camera className="text-rose-500" size={24} /> Diário Foto
                    </h4>
                    <p className="text-xs text-gray-400">Adesão às refeições</p>
                </div>
            </div>

            <div className="space-y-4">
                {trackingData.meals.map(meal => (
                    <div key={meal.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-50 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                        <div className="w-14 h-14 bg-rose-100/50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-200 shadow-inner">
                            <Camera size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-gray-800">{meal.type}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{meal.time} • {meal.content}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${meal.adherence === 'Sim' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {meal.adherence}
                        </div>
                    </div>
                ))}
                <button className="w-full py-4 bg-gradient-to-r from-rose-50 to-white text-rose-600 rounded-2xl font-black text-sm border border-rose-100 hover:shadow-md transition-all">
                    Ver Histórico de Fotos
                </button>
            </div>
        </div>

    </div>
    </div>
  );
};