import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetail } from './components/PatientDetail';
import { NewPatientForm } from './components/NewPatientForm';
import { CalendarView } from './components/Calendar';
import { MessagesView } from './components/Messages';
import { Login } from './components/Login';
import { Settings } from './components/Settings';
import { PatientPortal } from './components/PatientPortal';
import { Patient, Appointment } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS } from './constants';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'patient'>('admin');
  const [currentUser, setCurrentUser] = useState<Patient | undefined>(undefined);

  // App State
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('mp_patients');
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('mp_appointments');
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });

  // Persistência
  useEffect(() => {
    localStorage.setItem('mp_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('mp_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Auth Handlers
  const handleLogin = (role: 'admin' | 'patient', patientData?: Patient) => {
    setUserRole(role);
    if (role === 'patient' && patientData) {
      setCurrentUser(patientData);
    }
    setIsAuthenticated(true);
    setCurrentView(role === 'admin' ? 'dashboard' : 'home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('admin');
    setCurrentUser(undefined);
    setCurrentView('dashboard');
  };

  const handleResetAllData = () => {
    if (confirm('ATENÇÃO: Isso apagará todos os dados salvos e restaurará os dados de demonstração. Deseja continuar?')) {
      localStorage.removeItem('mp_patients');
      localStorage.removeItem('mp_appointments');
      localStorage.removeItem('mp_profile');
      localStorage.removeItem('mp_notifications');
      setPatients(MOCK_PATIENTS);
      setAppointments(MOCK_APPOINTMENTS);
      setCurrentView('dashboard');
      setSelectedPatient(null);
      alert('Sistema reinicializado com sucesso.');
    }
  };

  // Nutritionist Navigation Handlers
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view !== 'patient-detail') {
      setSelectedPatient(null);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    const freshPatient = patients.find(p => p.id === patient.id) || patient;
    setSelectedPatient(freshPatient);
    setCurrentView('patient-detail');
  };

  const handleSaveNewPatient = (newPatientData: Partial<Patient>) => {
    const newPatient: Patient = {
      ...newPatientData as Patient,
      id: Date.now().toString(),
      lastVisit: new Date().toISOString(),
      nextVisit: '',
      symptomsLog: [],
      anthropometry: [],
    };
    
    setPatients(prev => [newPatient, ...prev]);
    handleSelectPatient(newPatient);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setSelectedPatient(updatedPatient);
  };

  const handleDeletePatient = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
        setPatients(prev => prev.filter(p => p.id !== id));
        handleNavigate('patients');
    }
  };

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  // Render Logic
  if (!isAuthenticated) {
    return <Login patients={patients} onLogin={handleLogin} />;
  }

  if (userRole === 'patient' && currentUser) {
    const updatedCurrentUser = patients.find(p => p.id === currentUser.id) || currentUser;
    return (
      <PatientPortal 
        patient={updatedCurrentUser} 
        appointments={appointments}
        onLogout={handleLogout} 
      />
    );
  }

  const renderAdminContent = () => {
    if (currentView === 'patient-detail' && selectedPatient) {
      return (
        <PatientDetail 
          patient={selectedPatient} 
          onBack={() => handleNavigate('patients')}
          onUpdatePatient={handleUpdatePatient}
          onDeletePatient={() => handleDeletePatient(selectedPatient.id)}
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
        return (
            <Dashboard 
                onNavigate={handleNavigate} 
                patients={patients}
                appointments={appointments}
            />
        );
      case 'patients':
        return (
          <PatientList 
            patients={patients}
            onSelectPatient={handleSelectPatient} 
            onAddPatient={() => handleNavigate('new-patient')}
          />
        );
      case 'calendar':
        return <CalendarView appointments={appointments} onAddAppointment={handleAddAppointment} />;
      case 'messages':
        return <MessagesView patients={patients} />;
      case 'settings':
        return <Settings onLogout={handleLogout} onResetAll={handleResetAllData} />;
      default:
        return (
            <Dashboard 
                onNavigate={handleNavigate} 
                patients={patients}
                appointments={appointments}
            />
        );
    }
  };

  return (
    <Layout 
      activeTab={selectedPatient ? 'patients' : (currentView === 'new-patient' ? 'patients' : currentView)} 
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderAdminContent()}
    </Layout>
  );
};

export default App;