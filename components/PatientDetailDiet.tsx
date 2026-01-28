import React, { useState, useMemo } from 'react';
import { 
  X, Save, Edit2, ShoppingCart, List, LayoutList, Clock, Plus, Trash2, StickyNote, Flame,
  Utensils, Target
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip 
} from 'recharts';
import { MealPlan, Patient, Meal } from '../types';

interface PatientDetailDietProps {
  patient: Patient;
  mealPlanData?: MealPlan;
  onSaveMealPlan: (plan: MealPlan) => void;
  readOnly?: boolean;
}

export const PatientDetailDiet: React.FC<PatientDetailDietProps> = ({ 
  patient, 
  mealPlanData: initialMealPlan, 
  onSaveMealPlan,
  readOnly = false 
}) => {
  const [isEditingDiet, setIsEditingDiet] = useState(false);
  const [isSimplifiedView, setIsSimplifiedView] = useState(false);
  const [mealPlanData, setMealPlanData] = useState<MealPlan | undefined>(initialMealPlan);
  const [shoppingListDays, setShoppingListDays] = useState(7);
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Handlers
  const handleMealChange = (mealIndex: number, field: 'name' | 'time' | 'notes', value: string) => {
    if (!mealPlanData) return;
    const newMeals = [...mealPlanData.meals];
    newMeals[mealIndex] = { ...newMeals[mealIndex], [field]: value };
    setMealPlanData({ ...mealPlanData, meals: newMeals });
  };

  const handleItemChange = (mealIndex: number, itemIndex: number, field: 'name' | 'quantity' | 'notes', value: string) => {
    if (!mealPlanData) return;
    const newMeals = [...mealPlanData.meals];
    const newItems = [...newMeals[mealIndex].items];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    newMeals[mealIndex] = { ...newMeals[mealIndex], items: newItems };
    setMealPlanData({ ...mealPlanData, meals: newMeals });
  };

  const handleAddItem = (mealIndex: number) => {
    if (!mealPlanData) return;
    const newMeals = [...mealPlanData.meals];
    newMeals[mealIndex].items.push({
      id: Date.now().toString(),
      name: '', quantity: '', calories: 0, protein: 0, carbs: 0, fats: 0, notes: ''
    });
    setMealPlanData({ ...mealPlanData, meals: newMeals });
  };

  const handleRemoveItem = (mealIndex: number, itemIndex: number) => {
    if (!mealPlanData) return;
    const newMeals = [...mealPlanData.meals];
    newMeals[mealIndex].items.splice(itemIndex, 1);
    setMealPlanData({ ...mealPlanData, meals: newMeals });
  };

  const handleSave = () => {
    if (mealPlanData) onSaveMealPlan(mealPlanData);
    setIsEditingDiet(false);
  };

  const handleCancel = () => {
    setMealPlanData(initialMealPlan);
    setIsEditingDiet(false);
  };

  // Calculations
  const dietStats = useMemo(() => {
    if (!mealPlanData) return null;
    let totalCals = 0, totalProt = 0, totalCarbs = 0, totalFats = 0;
    mealPlanData.meals.forEach(meal => {
        meal.items.forEach(item => {
            totalCals += item.calories;
            totalProt += item.protein;
            totalCarbs += item.carbs;
            totalFats += item.fats;
        });
    });
    return { totalCals, totalProt, totalCarbs, totalFats };
  }, [mealPlanData]);

  const calculateMealCalories = (meal: Meal) => {
    return meal.items.reduce((acc, item) => acc + (item.calories || 0), 0);
  };

  const shoppingList = useMemo(() => {
    if (!mealPlanData) return [];
    const items: Record<string, { quantity: string, rawName: string }> = {};
    mealPlanData.meals.forEach(meal => {
      meal.items.forEach(item => {
        if (!items[item.name]) {
          items[item.name] = { quantity: item.quantity, rawName: item.name };
        }
      });
    });
    return Object.values(items);
  }, [mealPlanData]);

  const macroData = dietStats ? [
    { name: 'Proteína', value: dietStats.totalProt, color: '#903c4c' },
    { name: 'Carboidratos', value: dietStats.totalCarbs, color: '#fb7185' },
    { name: 'Gorduras', value: dietStats.totalFats, color: '#fcd34d' },
  ] : [];

  const adherenceData = [
    { day: '24/10', adherence: 85 }, { day: '25/10', adherence: 90 }, { day: '26/10', adherence: 70 },
    { day: '27/10', adherence: 95 }, { day: '28/10', adherence: 80 }, { day: '29/10', adherence: 100 },
    { day: '30/10', adherence: 85 },
  ];

  return (
    <div className="py-6 space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
                <h3 className="text-xl font-black text-wine-800 flex items-center gap-2">
                    <Utensils size={24} className="text-wine-600"/>
                    Plano Alimentar
                </h3>
                <p className="text-gray-500 text-sm mt-1 font-medium">{mealPlanData?.title || 'Personalizado'}</p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                {isEditingDiet ? (
                    <>
                        <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-all">
                            <X size={16} /> Cancelar
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-wine-600 text-white rounded-lg text-xs font-bold hover:bg-wine-700 shadow-md transition-all">
                            <Save size={16} /> Salvar
                        </button>
                    </>
                ) : (
                    <>
                        {!readOnly && (
                            <button onClick={() => setIsEditingDiet(true)} className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-wine-700 border border-wine-100 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all">
                                <Edit2 size={16} /> Editar
                            </button>
                        )}
                        <button 
                            onClick={() => setIsSimplifiedView(!isSimplifiedView)} 
                            className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${isSimplifiedView ? 'bg-wine-50 text-wine-700 border-wine-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                            title={isSimplifiedView ? "Ver Detalhes" : "Ver Resumo"}
                        >
                            {isSimplifiedView ? <List size={16} /> : <LayoutList size={16} />}
                            {isSimplifiedView ? 'Ver Detalhes' : 'Resumo'}
                        </button>
                        <button onClick={() => setShowShoppingList(!showShoppingList)} className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${showShoppingList ? 'bg-wine-600 text-white border-wine-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                            <ShoppingCart size={16} /> {showShoppingList ? 'Ver Dieta' : 'Lista de Compras'}
                        </button>
                    </>
                )}
            </div>
        </div>

        {!showShoppingList && !isEditingDiet && !isSimplifiedView && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-28 h-28 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={macroData} innerRadius={25} outerRadius={45} paddingAngle={5} dataKey="value">
                        {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3 flex-1 w-full">
                    {[
                        { label: 'Proteína', val: dietStats?.totalProt, color: 'wine' },
                        { label: 'Carbo', val: dietStats?.totalCarbs, color: 'rose' },
                        { label: 'Gordura', val: dietStats?.totalFats, color: 'yellow' }
                    ].map((m, i) => (
                        <div key={i} className={`bg-${m.color}-50 p-3 rounded-xl border border-${m.color}-100 text-center`}>
                            <p className={`text-[10px] font-bold text-${m.color}-600 uppercase tracking-widest`}>{m.label}</p>
                            <p className={`text-lg font-black text-${m.color}-800`}>{m.val}g</p>
                        </div>
                    ))}
                    <div className="col-span-3 pt-2 text-center border-t border-gray-50 mt-2">
                        <p className="text-xs text-gray-400 font-bold uppercase flex items-center justify-center gap-2">
                            <Target size={14} /> Meta: <span className="text-gray-700">{patient.mealPlan?.caloricGoal} kcal</span> 
                            <span className="text-gray-300">|</span> 
                            <Flame size={14} className="text-orange-500" /> Atual: <span className="text-wine-600">{dietStats?.totalCals} kcal</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hidden lg:block">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-wine-800 text-xs flex items-center gap-2 uppercase tracking-wider">
                        Adesão Semanal
                    </h4>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">ALTA</span>
                </div>
                <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adherenceData}>
                    <defs>
                        <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#903c4c" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#903c4c" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="adherence" stroke="#903c4c" strokeWidth={2} fillOpacity={1} fill="url(#colorAdherence)" />
                    </AreaChart>
                </ResponsiveContainer>
                </div>
            </div>
            </div>
        )}

        {showShoppingList && !isEditingDiet ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-black text-gray-800">Lista de Compras</h4>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                         {[3, 7, 15].map(d => (
                            <button key={d} onClick={() => setShoppingListDays(d)} className={`px-3 py-1 rounded-md text-xs font-bold ${shoppingListDays === d ? 'bg-white shadow-sm text-wine-600' : 'text-gray-500'}`}>{d} dias</button>
                         ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shoppingList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                             <span className="text-sm font-medium text-gray-700">{item.rawName}</span>
                             <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200">{item.quantity} {shoppingListDays > 1 && `(x${shoppingListDays})`}</span>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className={`grid gap-4 ${isSimplifiedView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {mealPlanData?.meals.map((meal, mIdx) => (
                    <div key={meal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                        {/* Meal Header */}
                        <div className={`p-4 flex items-center justify-between ${isEditingDiet ? 'bg-gray-50' : (isSimplifiedView ? 'bg-white border-b border-gray-50' : 'bg-gradient-to-r from-wine-600 to-wine-700 text-white')}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isEditingDiet || isSimplifiedView ? 'bg-rose-50 text-wine-600 shadow-sm' : 'bg-white/20 text-white'}`}>
                                    <Clock size={18} />
                                </div>
                                <div>
                                    {isEditingDiet ? (
                                        <div className="flex gap-2">
                                            <input value={meal.name} onChange={(e) => handleMealChange(mIdx, 'name', e.target.value)} className="font-bold text-gray-800 bg-white border border-gray-200 rounded px-2 py-1 text-sm w-40" placeholder="Nome" />
                                            <input type="time" value={meal.time} onChange={(e) => handleMealChange(mIdx, 'time', e.target.value)} className="font-medium text-gray-600 bg-white border border-gray-200 rounded px-2 py-1 text-sm" />
                                        </div>
                                    ) : (
                                        <>
                                            <h4 className={`font-bold ${isSimplifiedView ? 'text-gray-800 text-sm' : 'text-lg'} leading-none`}>{meal.name}</h4>
                                            <span className={`text-xs ${isSimplifiedView ? 'text-gray-400' : 'opacity-80'} font-medium`}>{meal.time}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {!isEditingDiet && !isSimplifiedView && (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                                        <Flame size={12} className="text-orange-300" />
                                        <span className="text-xs font-bold">{calculateMealCalories(meal)} kcal</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Meal Content - Hidden in simplified view */}
                        {!isSimplifiedView && (
                            <div className="p-0">
                                <div className="divide-y divide-gray-50">
                                    {meal.items.map((item, iIdx) => (
                                        <div key={item.id || iIdx} className={`p-4 flex items-start gap-4 ${isEditingDiet ? 'bg-white' : 'hover:bg-rose-50/30 even:bg-gray-50/50'}`}>
                                            {isEditingDiet ? (
                                                <div className="w-full grid grid-cols-12 gap-3 items-start">
                                                    <div className="col-span-6 space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Alimento</label>
                                                        <input value={item.name} onChange={(e) => handleItemChange(mIdx, iIdx, 'name', e.target.value)} className="w-full text-sm font-medium border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-wine-500 outline-none" placeholder="Ex: Aveia" />
                                                        <input value={item.notes || ''} onChange={(e) => handleItemChange(mIdx, iIdx, 'notes', e.target.value)} className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg p-1.5 focus:ring-2 focus:ring-wine-500 outline-none" placeholder="Obs: Flocos finos" />
                                                    </div>
                                                    <div className="col-span-3 space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Qtd</label>
                                                        <input value={item.quantity} onChange={(e) => handleItemChange(mIdx, iIdx, 'quantity', e.target.value)} className="w-full text-sm font-medium border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-wine-500 outline-none" placeholder="Ex: 30g" />
                                                    </div>
                                                    <div className="col-span-2 space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Kcal</label>
                                                        <input type="number" value={item.calories || 0} onChange={(e) => handleItemChange(mIdx, iIdx, 'calories' as any, e.target.value)} className="w-full text-sm font-medium border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-wine-500 outline-none" />
                                                    </div>
                                                    <div className="col-span-1 pt-6 flex justify-center">
                                                        <button onClick={() => handleRemoveItem(mIdx, iIdx)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-wine-200 shrink-0"></div>
                                                    <div className="flex-1">
                                                        <p className="text-gray-800 font-medium text-sm leading-tight">{item.name}</p>
                                                        {item.notes && <p className="text-xs text-gray-400 italic mt-0.5">{item.notes}</p>}
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="inline-block bg-wine-50 text-wine-700 px-3 py-1 rounded-full text-xs font-bold border border-wine-100">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {isEditingDiet && (
                                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                                        <button onClick={() => handleAddItem(mIdx)} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-xs font-bold hover:border-wine-400 hover:text-wine-600 hover:bg-white transition-all flex items-center justify-center gap-2">
                                            <Plus size={16} /> Adicionar Alimento
                                        </button>
                                    </div>
                                )}

                                {!isEditingDiet && meal.notes && (
                                    <div className="px-6 py-4 bg-yellow-50/50 border-t border-yellow-100 flex items-start gap-3">
                                        <StickyNote size={16} className="text-yellow-600 mt-0.5" />
                                        <p className="text-xs text-yellow-800 italic leading-relaxed">{meal.notes}</p>
                                    </div>
                                )}
                                
                                {isEditingDiet && (
                                    <div className="px-4 pb-4 bg-gray-50">
                                        <textarea value={meal.notes || ''} onChange={(e) => handleMealChange(mIdx, 'notes', e.target.value)} className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wine-500 outline-none" rows={2} placeholder="Observações gerais da refeição..." />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};