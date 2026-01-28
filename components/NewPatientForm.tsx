import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  HeartPulse, 
  Save, 
  Cigarette,
  Wine,
  Dumbbell,
  Moon,
  Utensils,
  Droplets,
  Target,
  ScrollText,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Pill,
  Flag,
  Plus,
  X
} from 'lucide-react';
import { Patient, MealPlan } from '../types';

interface NewPatientFormProps {
  onSave: (patientData: Partial<Patient>) => void;
  onCancel: () => void;
}

export const NewPatientForm: React.FC<NewPatientFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    // Dados Pessoais
    name: '',
    email: '',
    age: '',
    
    // Contexto Clínico
    condition: 'Endometriose',
    stage: '',
    mainComplaint: '',
    history: '',
    // medications & supplements removidos do formData string simples, gerenciados via estados de array abaixo

    // Estilo de Vida
    smoker: 'false',
    alcohol: '',
    physicalActivity: '',
    sleepQuality: '',

    // Alimentação
    allergies: '',
    dislikes: '',
    favorites: '',
    waterIntake: '',
    
    // Metas
    primaryGoal: '',
    goalDeadline: '',

    // Planejamento
    nutritionalStrategy: '', // Titulo do plano
    caloricGoal: '',
  });

  // Estados para listas dinâmicas
  const [medicationsList, setMedicationsList] = useState<string[]>([]);
  const [currentMed, setCurrentMed] = useState('');
  
  const [supplementsList, setSupplementsList] = useState<string[]>([]);
  const [currentSupp, setCurrentSupp] = useState('');

  // Handlers para Medicamentos
  const handleAddMed = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentMed.trim()) {
      setMedicationsList([...medicationsList, currentMed.trim()]);
      setCurrentMed('');
    }
  };

  const handleRemoveMed = (index: number) => {
    setMedicationsList(medicationsList.filter((_, i) => i !== index));
  };

  // Handlers para Suplementos
  const handleAddSupp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentSupp.trim()) {
      setSupplementsList([...supplementsList, currentSupp.trim()]);
      setCurrentSupp('');
    }
  };

  const handleRemoveSupp = (index: number) => {
    setSupplementsList(supplementsList.filter((_, i) => i !== index));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Construção do objeto de plano alimentar inicial (se houver meta)
    let initialMealPlan: MealPlan | undefined = undefined;
    if (formData.caloricGoal) {
      initialMealPlan = {
        title: formData.nutritionalStrategy || 'Planejamento Inicial',
        caloricGoal: Number(formData.caloricGoal),
        macros: { protein: 30, carbs: 40, fats: 30 }, // Default balanceado
        meals: [] // Começa vazio para edição posterior
      };
    }
    
    // Goals construction
    const initialGoals = formData.primaryGoal ? [{
        id: Date.now().toString(),
        description: formData.primaryGoal,
        deadline: formData.goalDeadline || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        status: 'Em andamento' as const,
        progress: 0
    }] : [];

    const newPatient: Partial<Patient> = {
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
      condition: formData.condition as any,
      stage: formData.stage,
      status: 'Ativo',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=ffe4e6&color=903c4c`,
      anamnesis: {
        mainComplaint: formData.mainComplaint,
        history: formData.history,
        medications: medicationsList,
        supplements: supplementsList,
        allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
        lifestyle: {
          smoker: formData.smoker === 'true',
          alcohol: formData.alcohol,
          physicalActivity: formData.physicalActivity
        }
      },
      symptomsLog: [],
      anthropometry: [],
      mealPlan: initialMealPlan,
      goals: initialGoals
    };

    onSave(newPatient);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between sticky top-0 bg-rose-50/95 backdrop-blur-sm z-10 py-4 border-b border-rose-100/50">
        <div className="flex items-center gap-4">
            <button 
            onClick={onCancel}
            className="p-2 hover:bg-white rounded-full text-gray-500 hover:text-wine-700 transition-colors"
            >
            <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-wine-800">Nova Admissão de Paciente</h1>
                <p className="text-xs text-gray-500">Preencha o prontuário inicial para gerar a ficha.</p>
            </div>
        </div>
        <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-wine-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
            <Save size={20} />
            Salvar Ficha
        </button>
      </div>

      <form className="space-y-8">
        
        {/* SEÇÃO 1: IDENTIFICAÇÃO */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <User className="text-wine-600" size={24} />
            Identificação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome Completo</label>
              <input 
                type="text" name="name" required placeholder="Ex: Maria da Silva"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all"
                value={formData.name} onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Idade</label>
              <input 
                type="number" name="age" required placeholder="Ex: 28"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all"
                value={formData.age} onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" name="email" required placeholder="Ex: maria@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all"
                  value={formData.email} onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: CLÍNICA */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <HeartPulse className="text-wine-600" size={24} />
            Contexto Clínico
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Condição Principal</label>
              <select 
                name="condition"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all bg-white"
                value={formData.condition} onChange={handleChange}
              >
                <option value="Endometriose">Endometriose</option>
                <option value="SOP">SOP</option>
                <option value="Tentante">Tentante</option>
                <option value="Climatério">Climatério</option>
                <option value="Gestante">Gestante</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Estágio / Detalhe</label>
              <input 
                type="text" name="stage" placeholder="Ex: Grau 2, 1º Trimestre..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all"
                value={formData.stage} onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Queixa Principal</label>
                <textarea 
                name="mainComplaint" rows={2} placeholder="Motivo da consulta..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 resize-none"
                value={formData.mainComplaint} onChange={handleChange}
                ></textarea>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Histórico da Doença / Observações</label>
                <textarea 
                name="history" rows={3} placeholder="Histórico de diagnósticos, cirurgias prévias..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 resize-none"
                value={formData.history} onChange={handleChange}
                ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Medicamentos - Tag Input */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Pill size={16} className="text-gray-400" /> Medicamentos
                    </label>
                    <div className="flex gap-2">
                        <input 
                            value={currentMed}
                            onChange={(e) => setCurrentMed(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddMed(e as any)}
                            placeholder="Adicionar medicamento..."
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 text-sm"
                        />
                        <button 
                            onClick={handleAddMed}
                            className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-wine-100 hover:text-wine-600 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[30px] p-2 bg-gray-50 rounded-xl border border-gray-100">
                        {medicationsList.length === 0 && <span className="text-xs text-gray-400 italic">Nenhum medicamento adicionado.</span>}
                        {medicationsList.map((med, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-wine-100 text-wine-700 rounded-lg text-xs font-bold">
                                {med}
                                <button onClick={() => handleRemoveMed(idx)} className="hover:bg-wine-200 rounded p-0.5"><X size={12}/></button>
                            </span>
                        ))}
                    </div>
                </div>

                 {/* Suplementação - Tag Input */}
                 <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Pill size={16} className="text-green-500" /> Suplementação
                    </label>
                    <div className="flex gap-2">
                        <input 
                            value={currentSupp}
                            onChange={(e) => setCurrentSupp(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSupp(e as any)}
                            placeholder="Adicionar suplemento..."
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                        <button 
                            onClick={handleAddSupp}
                            className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-green-100 hover:text-green-600 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-[30px] p-2 bg-gray-50 rounded-xl border border-gray-100">
                        {supplementsList.length === 0 && <span className="text-xs text-gray-400 italic">Nenhum suplemento adicionado.</span>}
                        {supplementsList.map((supp, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                                {supp}
                                <button onClick={() => handleRemoveSupp(idx)} className="hover:bg-green-200 rounded p-0.5"><X size={12}/></button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>

         {/* SEÇÃO 3: METAS E OBJETIVOS */}
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Flag className="text-wine-600" size={24} />
            Metas e Objetivos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Objetivo Principal</label>
              <input 
                type="text" name="primaryGoal" placeholder="Ex: Reduzir percentual de gordura, Aliviar dores..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all"
                value={formData.primaryGoal} onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prazo Estimado</label>
              <input 
                type="date" name="goalDeadline"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all"
                value={formData.goalDeadline} onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 4: ESTILO DE VIDA */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Dumbbell className="text-wine-600" size={24} />
            Estilo de Vida
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Cigarette size={16} className="text-gray-400"/> Tabagismo
                </label>
                <select 
                  name="smoker"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 bg-white"
                  value={formData.smoker} onChange={handleChange}
                >
                  <option value="false">Não Fuma</option>
                  <option value="true">Fumante</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Wine size={16} className="text-gray-400"/> Álcool
                </label>
                <input 
                  type="text" name="alcohol" placeholder="Ex: Socialmente 1x sem"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500"
                  value={formData.alcohol} onChange={handleChange}
                />
             </div>
             <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Moon size={16} className="text-gray-400"/> Atividade Física
                </label>
                <input 
                  type="text" name="physicalActivity" placeholder="Ex: Musculação 3x, Pilates 2x..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500"
                  value={formData.physicalActivity} onChange={handleChange}
                />
             </div>
          </div>
        </div>

        {/* SEÇÃO 5: PREFERÊNCIAS ALIMENTARES */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Utensils className="text-wine-600" size={24} />
            Preferências Alimentares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-medium text-red-600 flex items-center gap-2">
                    <AlertTriangle size={16} /> Alergias & Intolerâncias
                </label>
                <input 
                  type="text" name="allergies" placeholder="Ex: Camarão, Lactose, Glúten..."
                  className="w-full px-4 py-2.5 border border-red-100 bg-red-50 text-red-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 placeholder-red-300"
                  value={formData.allergies} onChange={handleChange}
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-blue-600 flex items-center gap-2">
                    <Droplets size={16} /> Ingestão Hídrica (aprox.)
                </label>
                <input 
                  type="text" name="waterIntake" placeholder="Ex: 2 litros por dia"
                  className="w-full px-4 py-2.5 border border-blue-100 bg-blue-50 text-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-blue-300"
                  value={formData.waterIntake} onChange={handleChange}
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ThumbsDown size={16} className="text-gray-400"/> Aversões (O que não come)
                </label>
                <textarea 
                  name="dislikes" rows={2} placeholder="Alimentos que a paciente não gosta..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 resize-none"
                  value={formData.dislikes} onChange={handleChange}
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ThumbsUp size={16} className="text-gray-400"/> Preferências (O que ama)
                </label>
                <textarea 
                  name="favorites" rows={2} placeholder="Alimentos preferidos..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500 resize-none"
                  value={formData.favorites} onChange={handleChange}
                />
             </div>
          </div>
        </div>

        {/* SEÇÃO 6: PLANEJAMENTO INICIAL */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Target className="text-wine-600" size={24} />
            Planejamento Nutricional Inicial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estratégia / Título do Protocolo</label>
                <input 
                  type="text" name="nutritionalStrategy" placeholder="Ex: Protocolo Anti-inflamatório Fase 1"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500"
                  value={formData.nutritionalStrategy} onChange={handleChange}
                />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Meta Calórica (Kcal)</label>
                <input 
                  type="number" name="caloricGoal" placeholder="Ex: 1800"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-500"
                  value={formData.caloricGoal} onChange={handleChange}
                />
             </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
             <ScrollText size={16} />
             Ao definir uma meta calórica, o sistema criará automaticamente um rascunho de plano alimentar na ficha do paciente.
          </p>
        </div>

      </form>
    </div>
  );
};