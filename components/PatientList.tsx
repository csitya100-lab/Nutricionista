import React from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { Patient } from '../types';

interface PatientListProps {
  patients: Patient[]; // Agora recebe a lista via props para estar sempre atualizada
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, onSelectPatient, onAddPatient }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Endometriose': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SOP': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Tentante': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Climatério': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-wine-800">Meus Pacientes</h2>
          <p className="text-gray-500">Gerencie tratamentos e acompanhe evoluções</p>
        </div>
        <button 
          onClick={onAddPatient}
          className="px-6 py-2 bg-wine-600 text-white rounded-full font-semibold shadow-md hover:bg-wine-700 transition-colors"
        >
          + Adicionar Paciente
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, condição..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter size={20} />
          <span>Filtros</span>
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div 
            key={patient.id} 
            onClick={() => onSelectPatient(patient)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] hover:border-wine-200 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <img 
                  src={patient.avatarUrl} 
                  alt={patient.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-wine-50"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-wine-700">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.age} anos</p>
                </div>
              </div>
              <button className="text-gray-300 hover:text-wine-600">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getConditionColor(patient.condition)}`}>
                {patient.condition}
              </span>
              {patient.stage && (
                <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {patient.stage}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
              <div>
                <p className="text-gray-400 text-xs">Última visita</p>
                <p className="font-medium text-gray-700">
                    {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Próximo Retorno</p>
                <p className="font-medium text-wine-600">
                    {patient.nextVisit ? new Date(patient.nextVisit).toLocaleDateString() : 'Agendar'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};