import React, { useMemo } from 'react';
import { TrendingUp, Plus, Edit2, Trash2 } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AnthropometryRecord } from '../types';

interface PatientDetailAnthropometryProps {
  data: AnthropometryRecord[];
}

export const PatientDetailAnthropometry: React.FC<PatientDetailAnthropometryProps> = ({ data }) => {
  const anthropometryData = useMemo(() => {
    return (data || []).map(record => ({
      ...record,
      formattedDate: new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }));
  }, [data]);

  const handleEditRecord = (date: string) => console.log('Edit:', date);
  const handleDeleteRecord = (date: string) => console.log('Delete:', date);

  return (
    <div className="py-6 space-y-6">
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-wine-800">Histórico Antropométrico</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-wine-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-wine-700 transition-all">
        <Plus size={18} /> Novo Registro
        </button>
    </div>

    {/* Evolution Chart */}
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
        <div>
            <h4 className="font-black text-gray-800 text-lg flex items-center gap-2">
            <TrendingUp className="text-wine-600" size={24} /> Evolução Física
            </h4>
            <p className="text-sm text-gray-400">Peso e Estatura ao longo das consultas</p>
        </div>
        <div className="flex gap-4">
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-wine-600"></div>
            <span className="text-xs font-bold text-gray-500">Peso (kg)</span>
            </div>
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <span className="text-xs font-bold text-gray-500">Altura (cm)</span>
            </div>
        </div>
        </div>

        <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={anthropometryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="formattedDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
            />
            <YAxis 
                yId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                domain={['dataMin - 5', 'dataMax + 5']}
            />
            <YAxis 
                yId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                domain={[0, 200]}
                hide
            />
            <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend />
            <Line 
                yId="left"
                type="monotone" 
                dataKey="weight" 
                name="Peso (kg)"
                stroke="#903c4c" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#903c4c', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
            />
            <Line 
                yId="right"
                type="monotone" 
                dataKey="height" 
                name="Altura (cm)"
                stroke="#fb7185" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#fb7185', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    </div>

    {/* Records Table */}
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <table className="w-full text-left">
        <thead className="bg-rose-50/30 border-b border-gray-50">
            <tr>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">Data</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">Peso (kg)</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">Altura (cm)</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">IMC</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">Cintura</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest">Quadril</th>
            <th className="px-6 py-4 text-[10px] font-black text-wine-800 uppercase tracking-widest text-center">Ações</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
            {data?.map((record, idx) => (
            <tr key={idx} className="hover:bg-rose-50/20 transition-colors group">
                <td className="px-6 py-4 text-sm font-bold text-gray-700">{new Date(record.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 text-sm font-black text-wine-700">{record.weight}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.height}</td>
                <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-lg text-xs font-black ${record.bmi < 25 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {record.bmi}
                </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.waist} cm</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.hip} cm</td>
                <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                    <button 
                    onClick={() => handleEditRecord(record.date)}
                    className="p-1.5 text-gray-400 hover:text-wine-600 hover:bg-wine-50 rounded-lg transition-all"
                    title="Editar registro"
                    >
                    <Edit2 size={16} />
                    </button>
                    <button 
                    onClick={() => handleDeleteRecord(record.date)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Excluir registro"
                    >
                    <Trash2 size={16} />
                    </button>
                </div>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>
  );
};