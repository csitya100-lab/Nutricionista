import React, { useState, useMemo } from 'react';
import { 
  X, Save, Edit2, ShoppingCart, Download, PieChart as PieIcon, 
  TrendingUp, Clock, Plus, Trash2, StickyNote, Check 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { MealPlan, Patient } from '../types';

interface PatientDetailDietProps {
  patient: Patient;
  mealPlanData?: MealPlan;
  onSaveMealPlan: (plan: MealPlan) => void;
}

export const PatientDetailDiet: React.FC<PatientDetailDietProps> = ({ patient, mealPlanData: initialMealPlan, onSaveMealPlan }) => {
  const [isEditingDiet, setIsEditingDiet] = useState(false);
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

  const handleDownloadPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Lista de Compras - ${patient.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #ffe4e6; padding-bottom: 20px; }
            h1 { color: #903c4c; margin: 0 0 10px 0; font-size: 24px; }
            .meta { color: #666; font-size: 14px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .item { background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; break-inside: avoid; }
            .name { font-weight: 600; color: #374151; }
            .qty { background: #903c4c; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              .item { border: 1px solid #ddd; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lista de Compras</h1>
            <div class="meta">
              <p><strong>Paciente:</strong> ${patient.name}</p>
              <p><strong>Planejamento:</strong> ${mealPlanData?.title || 'Personalizado'}</p>
              <p><strong>Período de compras:</strong> ${shoppingListDays} dias</p>
            </div>
          </div>
          
          <div class="grid">
            ${shoppingList.map(item => `
              <div class="item">
                <span class="name">${item.rawName}</span>
                <span class="qty">
                  ${item.quantity} ${shoppingListDays > 1 ? `(x${shoppingListDays})` : ''}
                </span>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>Gerado pelo App Maíra Penna Nutri • Saúde da Mulher</p>
            <p>Data de emissão: ${new Date().toLocaleDateString()}</p>
          </div>

          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
                <h3 className="text-2xl font-bold text-wine-800">Plano Alimentar Ativo</h3>
                <p className="text-gray-500 text-sm">{mealPlanData?.title}</p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
                {isEditingDiet ? (
                    <>
                        <button onClick={handleCancel} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all">
                            <X size={18} /> Cancelar
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-wine-600 text-white rounded-xl text-sm font-bold hover:bg-wine-700 shadow-md hover:shadow-lg transition-all">
                            <Save size={18} /> Salvar Alterações
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditingDiet(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-wine-600 border border-wine-100 rounded-xl text-sm font-bold hover:bg-rose-50 transition-all">
                            <Edit2 size={18} /> Editar Plano
                        </button>
                        <button onClick={() => setShowShoppingList(!showShoppingList)} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${showShoppingList ? 'bg-wine-600 text-white border-wine-600 shadow-lg' : 'bg-white text-wine-700 border-wine-100 hover:bg-rose-50'}`}>
                            <ShoppingCart size={18} /> {showShoppingList ? 'Ver Cardápio' : 'Lista de Compras'}
                        </button>
                        {!showShoppingList && (
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-bold border border-gray-100 hover:bg-gray-50">
                                <Download size={18} /> PDF
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>

        {!showShoppingList && !isEditingDiet && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Diet Summary & Macros */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={macroData} innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value">
                        {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <PieIcon size={24} className="text-rose-200" />
                </div>
                </div>
                <div className="grid grid-cols-3 gap-4 flex-1">
                <div className="bg-wine-50 p-3 rounded-2xl border border-wine-100 text-center">
                    <p className="text-[10px] font-bold text-wine-600 uppercase tracking-widest">Prot</p>
                    <p className="text-lg font-black text-wine-800">{dietStats?.totalProt}g</p>
                </div>
                <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 text-center">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Carb</p>
                    <p className="text-lg font-black text-wine-800">{dietStats?.totalCarbs}g</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100 text-center">
                    <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Gord</p>
                    <p className="text-lg font-black text-wine-800">{dietStats?.totalFats}g</p>
                </div>
                <div className="col-span-3 pt-2 text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase">Meta: <span className="text-gray-700">{patient.mealPlan?.caloricGoal} kcal</span> • Atual: <span className="text-wine-600">{dietStats?.totalCals} kcal</span></p>
                </div>
                </div>
            </div>

            {/* Diet Adherence Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-wine-800 text-sm flex items-center gap-2">
                    <TrendingUp size={16} className="text-rose-400" /> Adesão Nutricional
                </h4>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">ALTA</span>
                </div>
                <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adherenceData}>
                    <defs>
                        <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#903c4c" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#903c4c" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="day" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                        formatter={(value: number) => [`${value}%`, 'Adesão']}
                    />
                    <Area type="monotone" dataKey="adherence" stroke="#903c4c" strokeWidth={3} fillOpacity={1} fill="url(#colorAdherence)" />
                    </AreaChart>
                </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">Comprometimento nos últimos 7 dias</p>
            </div>
            </div>
        )}

        {showShoppingList && !isEditingDiet ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-slide-up">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 border-b border-gray-50 pb-6 gap-6">
                    <div className="text-center md:text-left">
                        <h4 className="text-xl font-black text-gray-800">Minha Lista de Compras</h4>
                        <p className="text-sm text-gray-400 mt-1 italic">Organizada por itens do seu plano nutricional</p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter px-2">Comprar para:</span>
                        <div className="flex gap-1">
                            {[3, 7, 15].map(d => (
                                <button key={d} onClick={() => setShoppingListDays(d)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${shoppingListDays === d ? 'bg-wine-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}>
                                    {d === 7 ? '1 sem' : `${d} dias`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shoppingList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-rose-100 hover:bg-white transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-6 h-6 border-2 border-rose-200 rounded-lg flex items-center justify-center group-hover:bg-wine-600 group-hover:border-wine-600 transition-all">
                                    <Check size={14} className="text-white scale-0 group-hover:scale-100 transition-transform" />
                                </div>
                                <span className="text-gray-700 font-bold group-hover:text-wine-800">{item.rawName}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-black text-wine-600 bg-wine-50 px-2 py-0.5 rounded-full uppercase">
                                    {item.quantity}
                                </span>
                                {shoppingListDays > 1 && <span className="text-[10px] text-gray-400 mt-1">x{shoppingListDays} porções</span>}
                            </div>
                        </div>
                    ))}
                </div>
                
                <button 
                  onClick={handleDownloadPDF}
                  className="mt-12 w-full py-4 bg-gradient-to-r from-wine-600 to-rose-400 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.01] transition-all"
                >
                    <Download size={24} /> Gerar PDF para Impressão
                </button>
            </div>
        ) : (
            <div className={`grid grid-cols-1 ${isEditingDiet ? 'gap-8' : 'md:grid-cols-2 gap-6'}`}>
                {mealPlanData?.meals.map((meal, mIdx) => (
                    <div key={meal.id} className={`bg-white rounded-2xl border ${isEditingDiet ? 'border-wine-200 shadow-md ring-1 ring-wine-100' : 'border-gray-100 shadow-sm hover:shadow-md'} overflow-hidden transition-all`}>
                        <div className={`${isEditingDiet ? 'bg-wine-50' : 'bg-rose-50/30'} p-4 border-b border-gray-50 flex flex-col gap-3`}>
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="p-2 bg-white rounded-xl shadow-sm text-wine-600">
                                        <Clock size={16} />
                                    </div>
                                    {isEditingDiet ? (
                                        <input value={meal.name} onChange={(e) => handleMealChange(mIdx, 'name', e.target.value)} className="font-black text-gray-800 bg-transparent border-b border-wine-200 focus:border-wine-600 focus:outline-none w-full max-w-[200px]" placeholder="Nome da Refeição" />
                                    ) : (
                                        <span className="font-black text-gray-800">{meal.name}</span>
                                    )}
                                </div>
                                {isEditingDiet ? (
                                    <input type="time" value={meal.time} onChange={(e) => handleMealChange(mIdx, 'time', e.target.value)} className="text-xs font-bold text-wine-600 bg-white px-2 py-1 rounded border border-wine-100 focus:outline-none" />
                                ) : (
                                    <span className="text-xs font-bold text-wine-600 uppercase tracking-widest">{meal.time}</span>
                                )}
                            </div>
                            {isEditingDiet && (
                                <div className="w-full">
                                    <textarea value={meal.notes || ''} onChange={(e) => handleMealChange(mIdx, 'notes', e.target.value)} placeholder="Adicione observações gerais..." className="w-full text-xs text-gray-600 bg-white/50 p-2 rounded-lg border border-wine-100 focus:border-wine-400 focus:outline-none resize-none" rows={2} />
                                </div>
                            )}
                        </div>
                        <div className="p-5 space-y-4">
                            {meal.items.map((item, iIdx) => (
                                <div key={item.id || iIdx} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-start gap-4">
                                        {isEditingDiet ? (
                                            <>
                                                <div className="flex-1 flex flex-col gap-2">
                                                    <input value={item.name} onChange={(e) => handleItemChange(mIdx, iIdx, 'name', e.target.value)} className="w-full text-sm text-gray-700 font-medium border-b border-gray-200 focus:border-wine-500 focus:outline-none placeholder-gray-300" placeholder="Alimento" />
                                                    <input value={item.notes || ''} onChange={(e) => handleItemChange(mIdx, iIdx, 'notes', e.target.value)} className="w-full text-[11px] text-gray-400 border-b border-dotted border-gray-200 focus:border-wine-300 focus:outline-none placeholder-gray-200" placeholder="Obs..." />
                                                </div>
                                                <div className="w-24">
                                                    <input value={item.quantity} onChange={(e) => handleItemChange(mIdx, iIdx, 'quantity', e.target.value)} className="w-full text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200 focus:border-wine-500 focus:outline-none text-right" placeholder="Qtd" />
                                                </div>
                                                <button onClick={() => handleRemoveItem(mIdx, iIdx)} className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors mt-1"><Trash2 size={16} /></button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1">
                                                    <span className="text-sm text-gray-700 font-medium block">{item.name}</span>
                                                    {item.notes && <span className="text-[11px] text-gray-400 italic block mt-0.5">{item.notes}</span>}
                                                </div>
                                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{item.quantity}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isEditingDiet && (
                                <button onClick={() => handleAddItem(mIdx)} className="w-full py-2 border border-dashed border-wine-200 rounded-lg text-wine-600 text-xs font-bold hover:bg-wine-50 flex items-center justify-center gap-1 transition-colors mt-2">
                                    <Plus size={14} /> Adicionar Item
                                </button>
                            )}
                            {!isEditingDiet && meal.notes && (
                                <div className="mt-4 pt-3 border-t border-gray-50 flex items-start gap-2">
                                    <StickyNote size={14} className="text-yellow-500 mt-0.5" />
                                    <p className="text-xs text-gray-500 italic">{meal.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};