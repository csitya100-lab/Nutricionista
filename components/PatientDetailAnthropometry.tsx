import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TrendingUp, Plus, Edit2, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AnthropometryRecord } from '../types';

interface PatientDetailAnthropometryProps {
  data: AnthropometryRecord[];
  onUpdate: (records: AnthropometryRecord[]) => void;
  onResetHistory?: () => void;
}

export const PatientDetailAnthropometry: React.FC<PatientDetailAnthropometryProps> = ({ data, onUpdate, onResetHistory }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    waist: '',
    hip: ''
  });

  // Scroll automático para o formulário quando ele abrir
  useEffect(() => {
    if (isAdding && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isAdding, editingDate]);

  const anthropometryData = useMemo(() => {
    return (data || [])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(record => {
        const [year, month, day] = record.date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        
        return {
          ...record,
          formattedDate: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        };
    });
  }, [data]);

  const calculateBMI = (weight: number, height: number) => {
    const h = height / 100;
    return Number((weight / (h * h)).toFixed(1));
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingDate(null);
    setFormData({ 
        date: new Date().toISOString().split('T')[0], 
        weight: '', 
        height: '', 
        waist: '', 
        hip: '' 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = Number(formData.weight);
    const height = Number(formData.height);
    
    if (!weight || !height) return;

    const newRecord: AnthropometryRecord = {
        date: formData.date,
        weight,
        height,
        waist: Number(formData.waist),
        hip: Number(formData.hip),
        bmi: calculateBMI(weight, height)
    };

    let updatedRecords = [...data];

    if (editingDate) {
        updatedRecords = updatedRecords.filter(r => r.date !== editingDate);
    }

    updatedRecords = updatedRecords.filter(r => r.date !== newRecord.date);
    updatedRecords.push(newRecord);
    onUpdate(updatedRecords);
    resetForm();
  };

  const handleDeleteRecord = (date: string) => {
    if (confirm('Excluir este registro permanentemente?')) {
        onUpdate(data.filter(r => r.date !== date));
        resetForm();
    }
  };

  const handleEditRecord = (record: AnthropometryRecord) => {
    setFormData({
        date: record.date,
        weight: record.weight.toString(),
        height: record.height.toString(),
        waist: record.waist ? record.waist.toString() : '',
        hip: record.hip ? record.hip.toString() : ''
    });
    setEditingDate(record.date);
    setIsAdding(true);
  };

  return (
    <div className="py-6 space-y-6">
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-wine-800">Histórico Antropométrico</h3>
        <div className="flex gap-2">
            {!isAdding && onResetHistory && data.length > 0 && (
                <button 
                    onClick={onResetHistory}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-wine-600 rounded-xl text-sm font-bold border border-rose-100 hover:bg-rose-100 transition-all"
                >
                <RotateCcw size={18} /> Limpar Tudo
                </button>
            )}
            {!isAdding && (
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-wine-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-wine-700 transition-all"
                >
                <Plus size={18} /> Novo Registro
                </button>
            )}
        </div>
    </div>

    {/* Form Section */}
    {isAdding && (
        <div ref={formRef} className="scroll-mt-24">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border border-wine-100 animate-slide-up mb-6 ring-2 ring-wine-50 relative">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h4 className="font-bold text-wine-800 flex items-center gap-2 text-lg">
                        {editingDate ? (
                            <><Edit2 size={20} className="text-wine-600"/> Editando Registro de <span className="underline decoration-wine-200">{
                                (() => {
                                    const [y, m, d] = editingDate.split('-').map(Number);
                                    return new Date(y, m - 1, d).toLocaleDateString('pt-BR');
                                })()
                            }</span></>
                        ) : (
                            <><Plus size={20} className="text-wine-600"/> Adicionar Novas Medidas</>
                        )}
                    </h4>
                    <button type="button" onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Data da Medição</label>
                        <input type="date" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-wine-500 outline-none transition-all font-medium text-gray-700" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Peso (kg)</label>
                        <input type="number" step="0.1" required placeholder="00.0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-wine-500 outline-none transition-all font-medium text-gray-700" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Altura (cm)</label>
                        <input type="number" required placeholder="000" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-wine-500 outline-none transition-all font-medium text-gray-700" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Cintura (cm)</label>
                        <input type="number" placeholder="Opcional" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-wine-500 outline-none transition-all font-medium text-gray-700" value={formData.waist} onChange={e => setFormData({...formData, waist: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Quadril (cm)</label>
                        <input type="number" placeholder="Opcional" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-wine-500 outline-none transition-all font-medium text-gray-700" value={formData.hip} onChange={e => setFormData({...formData, hip: e.target.value})} />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-50">
                    {editingDate && (
                        <button 
                            type="button" 
                            onClick={() => handleDeleteRecord(editingDate)}
                            className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors mr-auto flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Excluir
                        </button>
                    )}
                    <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" className="px-8 py-2.5 bg-wine-600 text-white rounded-xl text-sm font-bold hover:bg-wine-700 shadow-lg shadow-wine-200 transition-all flex items-center gap-2">
                        <Save size={18} /> {editingDate ? 'Atualizar Registro' : 'Salvar Registro'}
                    </button>
                </div>
            </form>
        </div>
    )}

    {/* Evolution Chart */}
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
        <div>
            <h4 className="font-black text-gray-800 text-lg flex items-center gap-2">
            <TrendingUp className="text-wine-600" size={24} /> Evolução Física
            </h4>
            <p className="text-sm text-gray-400">Peso e Estatura ao longo das consultas</p>
        </div>
        </div>

        <div className="h-72 w-full">
        {anthropometryData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={anthropometryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
            <YAxis yId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            <Legend />
            <Line yId="left" type="monotone" dataKey="weight" name="Peso (kg)" stroke="#903c4c" strokeWidth={4} dot={{ r: 6, fill: '#903c4c' }} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
        ) : (
            <div className="h-full flex items-center justify-center text-gray-400">Sem dados para exibir no gráfico</div>
        )}
        </div>
    </div>

    {/* Records Table */}
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <table className="w-full text-left">
        <thead className="bg-rose-50/30 border-b border-gray-50">
            <tr>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">Data</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">Peso (kg)</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">IMC</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">Cintura</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">Quadril</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
            {anthropometryData.length === 0 && (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">Nenhum registro encontrado.</td></tr>
            )}
            {anthropometryData.slice().reverse().map((record, idx) => (
            <tr 
                key={idx} 
                onClick={() => handleEditRecord(record)}
                className={`hover:bg-rose-50/20 transition-colors group cursor-pointer ${editingDate === record.date ? 'bg-yellow-50/50' : ''}`}
                title="Clique para editar"
            >
                <td className="px-6 py-4 text-sm font-bold text-gray-700">{record.formattedDate}</td>
                <td className="px-6 py-4 text-sm font-black text-wine-700">{record.weight}</td>
                <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-lg text-xs font-black ${record.bmi < 25 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {record.bmi}
                </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.waist || '-'} cm</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.hip || '-'} cm</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>
  );
};