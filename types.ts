export interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  condition: 'Endometriose' | 'SOP' | 'Tentante' | 'Climatério' | 'Gestante';
  stage?: string;
  status: 'Ativo' | 'Pendente';
  lastVisit: string;
  nextVisit: string;
  avatarUrl: string;
  symptomsLog: DailyLog[];
  anamnesis?: Anamnesis;
  anthropometry?: AnthropometryRecord[];
  mealPlan?: MealPlan;
  tracking?: PatientTracking;
  goals?: PatientGoal[];
}

export interface PatientGoal {
  id: string;
  description: string;
  deadline: string;
  status: 'Em andamento' | 'Concluída' | 'Pausada';
  progress: number; // 0 a 100
}

export interface PatientTracking {
  waterGlassCount: number;
  waterGoal: number;
  meals: {
    id: string;
    type: string;
    time: string;
    content: string;
    photoUrl?: string;
    adherence: 'Sim' | 'Parcial' | 'Não';
  }[];
  activities: {
    id: string;
    name: string;
    duration: number; // minutes
    intensity: 'Leve' | 'Moderada' | 'Intensa';
  }[];
}

export interface Anamnesis {
  mainComplaint: string;
  history: string;
  medications: string[];
  supplements: string[];
  allergies: string[];
  lifestyle: {
    smoker: boolean;
    alcohol: string;
    physicalActivity: string;
  };
}

export interface AnthropometryRecord {
  date: string;
  weight: number;
  height: number;
  waist: number;
  hip: number;
  bmi: number;
}

export interface MealPlan {
  title: string;
  caloricGoal: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes?: string;
}

export interface Meal {
  id: string;
  time: string;
  name: string;
  items: FoodItem[];
  notes?: string;
}

export interface DailyLog {
  date: string;
  painLevel: number;
  bloating: number;
  energy: number;
  cyclePhase?: 'Menstrual' | 'Folicular' | 'Ovulatória' | 'Lútea';
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Primeira Consulta' | 'Retorno' | 'Online';
  status: 'Agendada' | 'Concluída' | 'Cancelada' | 'Confirmada';
}

export interface DashboardStats {
  totalPatients: number;
  appointmentsToday: number;
  symptomReports: number;
  adherenceRate: number;
}