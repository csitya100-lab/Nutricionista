import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Activity, ClipboardList, Scale, Utensils,
  CheckCircle2
} from 'lucide-react';
import { Patient, MealPlan, PatientGoal, PatientTracking } from '../types';
import { PatientDetailOverview } from './PatientDetailOverview';
import { PatientDetailDiet } from './PatientDetailDiet';
import { PatientDetailTracking } from './PatientDetailTracking';
import { PatientDetailAnthropometry } from './PatientDetailAnthropometry';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

type TabType = 'overview' | 'anamnesis' | 'anthropometry' | 'diet' | 'tracking';

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Local state for goals (mimicking database update)
  const [patientGoals, setPatientGoals] = useState<PatientGoal[]>(patient.goals || []);
  
  // Local state for tracking (mimicking database update)
  const [trackingData, setTrackingData] = useState<PatientTracking>(patient.tracking || {
    waterGlassCount: 6,
    waterGoal: 10,
    meals: [
      { id: '1', type: 'Café da Manhã', time: '08:15', content: 'Ovos e Mamão', adherence: 'Sim' },
      { id: '2', type: 'Almoço', time: '12:40', content: 'Peixe com Salada', adherence: 'Sim' }
    ],
    activities: [
      { id: '1', name: 'Pilates', duration: 45, intensity: 'Moderada' }
    ]
  });

  // Local state for meal plan (mimicking database update)
  const [mealPlanData, setMealPlanData] = useState<MealPlan | undefined>(patient.mealPlan);

  // Sync state when prop changes (useful if parent updates patient)
  useEffect(() => {
    setPatientGoals(patient.goals || []);
    setMealPlanData(patient.mealPlan);
  }, [patient]);

  // Handlers
  const handleUpdateGoals = (newGoals: PatientGoal[]) => {
    setPatientGoals(newGoals);
    // In a real app: api.updatePatientGoals(patient.id, newGoals);
  };

  const handleAddWater = () => {
    setTrackingData(prev => ({
      ...prev,
      waterGlassCount: Math.min(prev.waterGlassCount + 1, prev.waterGoal)
    }));
  };

  const handleSaveMealPlan = (newPlan: MealPlan) => {
    setMealPlanData(newPlan);
    console.log("Saving diet for patient", patient.id, newPlan);
    // In a real app: api.updatePatientDiet(patient.id, newPlan);
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Activity },
    { id: 'anamnesis', label: 'Anamnese', icon: ClipboardList },
    { id: 'anthropometry', label: 'Antropometria', icon: Scale },
    { id: 'diet', label: 'Dieta & Compras', icon: Utensils },
    { id: 'tracking', label: 'Acompanhamento', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col pb-12">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-wine-700 transition-colors font-medium">
          <ArrowLeft size={20} /> Voltar para lista
        </button>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <img src={patient.avatarUrl} alt={patient.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-rose-100 shadow-sm"/>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-wine-800">{patient.name}</h1>
            <span className="px-3 py-1 bg-wine-100 text-wine-700 rounded-full text-[10px] font-bold uppercase tracking-wider">{patient.condition}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Calendar size={16} /> {patient.age} anos</span>
            <span className="flex items-center gap-1"><Activity size={16} /> {patient.stage}</span>
            <span className="flex items-center gap-1 text-green-600 font-bold">● Paciente Ativa</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-8 py-4 font-bold text-sm whitespace-nowrap transition-all relative ${activeTab === tab.id ? 'text-wine-600' : 'text-gray-400 hover:text-wine-600'}`}
          >
            <tab.icon size={18} /> {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-wine-600 rounded-t-full shadow-[0_-2px_8px_rgba(114,47,55,0.3)]" />}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'overview' && (
          <PatientDetailOverview 
            patient={patient} 
            trackingData={trackingData} 
            goals={patientGoals}
            onUpdateGoals={handleUpdateGoals}
            onAddWater={handleAddWater}
          />
        )}

        {activeTab === 'anthropometry' && (
          <PatientDetailAnthropometry data={patient.anthropometry || []} />
        )}

        {activeTab === 'diet' && (
          <PatientDetailDiet 
            patient={patient}
            mealPlanData={mealPlanData}
            onSaveMealPlan={handleSaveMealPlan}
          />
        )}

        {activeTab === 'tracking' && (
          <PatientDetailTracking 
            trackingData={trackingData}
            onAddWater={handleAddWater}
          />
        )}
        
        {activeTab === 'anamnesis' && (
            <div className="py-6 text-center text-gray-400">
                <ClipboardList className="mx-auto mb-2 opacity-20" size={48} />
                <p>Módulo de Anamnese em desenvolvimento.</p>
            </div>
        )}
      </div>
    </div>
  );
};