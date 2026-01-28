import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetail } from './components/PatientDetail';
import { NewPatientForm } from './components/NewPatientForm';
import { CalendarView } from './components/Calendar';
import { MessagesView } from './components/Messages';
import { Patient } from './types';
import { MOCK_PATIENTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view !== 'patient-detail') {
      setSelectedPatient(null);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('patient-detail');
  };

  const handleSaveNewPatient = (newPatientData: Partial<Patient>) => {
    const newPatient: Patient = {
      ...newPatientData as Patient,
      id: Date.now().toString(), // Simple ID generation
      lastVisit: '',
      nextVisit: '',
      symptomsLog: [],
      anthropometry: [],
    };
    
    setPatients(prev => [newPatient, ...prev]);
    handleSelectPatient(newPatient); // Navega direto para a tela de detalhes do novo paciente
  };

  const renderContent = () => {
    if (currentView === 'patient-detail' && selectedPatient) {
      return (
        <PatientDetail 
          patient={selectedPatient} 
          onBack={() => handleNavigate('patients')} 
        />
      );
    }

    if (currentView === 'new-patient') {
      return (
        <NewPatientForm 
          onSave={handleSaveNewPatient}
          onCancel={() => handleNavigate('patients')}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} totalPatients={patients.length} />;
      case 'patients':
        return (
          <PatientList 
            patients={patients}
            onSelectPatient={handleSelectPatient} 
            onAddPatient={() => handleNavigate('new-patient')}
          />
        );
      case 'calendar':
        return <CalendarView />;
      case 'messages':
        return <MessagesView patients={patients} />;
      default:
        return <Dashboard onNavigate={handleNavigate} totalPatients={patients.length} />;
    }
  };

  return (
    <Layout activeTab={selectedPatient ? 'patients' : (currentView === 'new-patient' ? 'patients' : currentView)} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
};

export default App;