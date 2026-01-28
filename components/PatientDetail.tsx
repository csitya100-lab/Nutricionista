import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Activity, ClipboardList, Scale, Utensils,
  CheckCircle2, Trash2
} from 'lucide-react';
import { Patient, MealPlan, PatientGoal, PatientTracking, AnthropometryRecord } from '../types';
import { PatientDetailOverview } from './PatientDetailOverview';
import { PatientDetailDiet } from './PatientDetailDiet';
import { PatientDetailTracking } from './PatientDetailTracking';
import { PatientDetailAnthropometry } from './PatientDetailAnthropometry';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onUpdatePatient: (patient: Patient) => void;
  onDeletePatient: () => void;
}

type TabType = 'overview' | 'anamnesis' | 'anthropometry' | 'diet' | 'tracking';

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, onUpdatePatient, onDeletePatient }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Local state for immediate UI feedback before syncing up
  const [patientGoals, setPatientGoals] = useState<PatientGoal[]>(patient.goals || []);
  const [trackingData, setTrackingData] = useState<PatientTracking>(patient.tracking || {
    waterGlassCount: 0,
    waterGoal: 10,
    meals: [],
    activities: []
  });
  const [mealPlanData, setMealPlanData] = useState<MealPlan | undefined>(patient.mealPlan);

  useEffect(() => {
    setPatientGoals(patient.goals || []);
    setTrackingData(patient.tracking || { waterGlassCount: 0, waterGoal: 10, meals: [], activities: [] });
    setMealPlanData(patient.mealPlan);
  }, [patient]);

  // --- Handlers que atualizam o paciente globalmente ---

  const handleUpdateGoals = (newGoals: PatientGoal[]) => {
    setPatientGoals(newGoals);
    onUpdatePatient({ ...patient, goals: newGoals });
  };

  const handleAddWater = () => {
    const newData = {
      ...trackingData,
      waterGlassCount: Math.min(trackingData.waterGlassCount + 1, trackingData.waterGoal)
    };
    setTrackingData(newData);
    onUpdatePatient({ ...patient, tracking: newData });
  };

  const handleResetWater = () => {
    const newData = {
      ...trackingData,
      waterGlassCount: 0
    };
    setTrackingData(newData);
    onUpdatePatient({ ...patient, tracking: newData });
  };

  const handleSaveMealPlan = (newPlan: MealPlan) => {
    setMealPlanData(newPlan);
    onUpdatePatient({ ...patient, mealPlan: newPlan });
  };

  const handleUpdateAnthropometry = (newRecords: AnthropometryRecord[]) => {
    onUpdatePatient({ ...patient, anthropometry: newRecords });
  };

  const handleResetAnthropometry = () => {
    if (confirm('Tem certeza que deseja apagar TODO o histórico de medidas desta paciente? Esta ação não pode ser desfeita.')) {
        onUpdatePatient({ ...patient, anthropometry: [] });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Activity },
    { id: 'anamnesis', label: 'Anamnese', icon: ClipboardList },
    { id: 'anthropometry', label: 'Antropometria', icon: Scale },
    { id: 'diet', label: 'Dieta & Compras', icon: Utensils },
    { id: 'tracking', label: 'Acompanhamento', icon: CheckCircle2 },
  ];

  const renderAnamnesis = () => {
    if (!patient.anamnesis) return <div className="p-8 text-center text-gray-500">Nenhuma anamnese registrada.</div>;
    const { anamnesis } = patient;
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-wine-800 mb-2 border-b border-gray-100 pb-2">Queixa Principal</h3>
                    <p className="text-gray-700">{anamnesis.mainComplaint || 'Não informado'}</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-wine-800 mb-2 border-b border-gray-100 pb-2">Histórico Clínico</h3>
                    <p className="text-gray-700">{anamnesis.history || 'Não informado'}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-rose-50 p-4 rounded-xl">
                    <h4 className="font-bold text-wine-700 mb-3 text-sm flex items-center justify-between">
                        Medicamentos em Uso
                        <span className="bg-white px-2 py-0.5 rounded-full text-[10px] text-wine-600 shadow-sm">{anamnesis.medications.length}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                         {anamnesis.medications.length ? anamnesis.medications.map((m, i) => (
                             <span key={i} className="px-3 py-1 bg-white text-wine-700 rounded-lg text-xs font-bold border border-rose-100 shadow-sm">{m}</span>
                         )) : <span className="text-xs text-gray-400 italic">Nenhum</span>}
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-bold text-green-700 mb-3 text-sm flex items-center justify-between">
                        Suplementação
                        <span className="bg-white px-2 py-0.5 rounded-full text-[10px] text-green-600 shadow-sm">{anamnesis.supplements.length}</span>
                    </h4>
                     <div className="flex flex-wrap gap-2">
                         {anamnesis.supplements.length ? anamnesis.supplements.map((s, i) => (
                            <span key={i} className="px-3 py-1 bg-white text-green-700 rounded-lg text-xs font-bold border border-green-100 shadow-sm">{s}</span>
                         )) : <span className="text-xs text-gray-400 italic">Nenhum</span>}
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                    <h4 className="font-bold text-red-700 mb-3 text-sm">Alergias</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                         {anamnesis.allergies.length ? anamnesis.allergies.map((a, i) => <li key={i}>{a}</li>) : <li>Nenhum</li>}
                    </ul>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-wine-800 mb-4 border-b border-gray-100 pb-2">Estilo de Vida</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-4 border border-gray-200 rounded-xl">
                        <span className="block text-xs font-bold text-gray-400 uppercase">Tabagismo</span>
                        <span className="text-gray-800 font-medium">{anamnesis.lifestyle.smoker ? 'Sim' : 'Não'}</span>
                     </div>
                     <div className="p-4 border border-gray-200 rounded-xl">
                        <span className="block text-xs font-bold text-gray-400 uppercase">Álcool</span>
                        <span className="text-gray-800 font-medium">{anamnesis.lifestyle.alcohol || 'Não consome'}</span>
                     </div>
                     <div className="p-4 border border-gray-200 rounded-xl">
                        <span className="block text-xs font-bold text-gray-400 uppercase">Atividade Física</span>
                        <span className="text-gray-800 font-medium">{anamnesis.lifestyle.physicalActivity || 'Sedentário'}</span>
                     </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col pb-12">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-wine-700 transition-colors font-medium">
          <ArrowLeft size={20} /> Voltar para lista
        </button>
        <button onClick={onDeletePatient} className="flex items-center gap-2 text-red-400 hover:text-red-600 text-sm font-bold px-3 py-1 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} /> Excluir Paciente
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
            <span className="flex items-center gap-1"><Activity size={16} /> {patient.stage || 'Acompanhamento'}</span>
            <span className="flex items-center gap-1 text-green-600 font-bold">● {patient.status}</span>
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
            onResetWater={handleResetWater}
          />
        )}

        {activeTab === 'anthropometry' && (
          <PatientDetailAnthropometry 
            data={patient.anthropometry || []} 
            onUpdate={(records) => handleUpdateAnthropometry(records)}
            onResetHistory={handleResetAnthropometry}
          />
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
        
        {activeTab === 'anamnesis' && renderAnamnesis()}
      </div>
    </div>
  );
};