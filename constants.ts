import { Patient, Appointment } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Ana Júlia Silva',
    age: 28,
    email: 'ana.ju@email.com',
    condition: 'Endometriose',
    stage: 'Grau 2 - Profunda',
    status: 'Ativo',
    lastVisit: '2026-10-15',
    nextVisit: '2026-11-20',
    avatarUrl: 'https://picsum.photos/200/200?random=1',
    goals: [
      { id: 'g1', description: 'Reduzir distensão abdominal (Inchaço)', deadline: '2026-12-01', status: 'Em andamento', progress: 65 },
      { id: 'g2', description: 'Regularizar intestino', deadline: '2026-11-15', status: 'Concluída', progress: 100 }
    ],
    anamnesis: {
      mainComplaint: 'Dores pélvicas intensas durante o período menstrual e distensão abdominal frequente.',
      history: 'Diagnosticada com endometriose profunda há 2 anos. Realizou videolaparoscopia em 2022. Relata piora nos sintomas inflamatórios ao consumir glúten. Sono irregular.',
      medications: ['Dienogeste 2mg'],
      supplements: ['Omega 3', 'N-Acetilcisteína'],
      allergies: ['Camarão', 'Penicilina'],
      lifestyle: {
        smoker: false,
        alcohol: 'Socialmente (vinho, 1x semana)',
        physicalActivity: 'Pilates 2x na semana'
      }
    },
    anthropometry: [
      { date: '2026-08-10', weight: 62.5, height: 165, waist: 72, hip: 98, bmi: 22.9 },
      { date: '2026-09-15', weight: 61.8, height: 165, waist: 70, hip: 97, bmi: 22.7 },
      { date: '2026-10-15', weight: 60.5, height: 165, waist: 68, hip: 96, bmi: 22.2 }
    ],
    mealPlan: {
      title: 'Protocolo Anti-inflamatório Fase 1',
      caloricGoal: 1800,
      macros: {
        protein: 30,
        carbs: 40,
        fats: 30
      },
      meals: [
        { 
          id: '1', time: '07:30', name: 'Café da Manhã', 
          items: [
            { id: 'f1', name: 'Shot matinal: Cúrcuma + Própolis + Limão', quantity: '1 dose', calories: 15, protein: 0, carbs: 3, fats: 0, notes: 'Tomar em jejum' },
            { id: 'f2', name: 'Ovos mexidos', quantity: '2 unidades', calories: 140, protein: 12, carbs: 1, fats: 10 },
            { id: 'f3', name: 'Espinafre refogado', quantity: '1 xícara', calories: 20, protein: 2, carbs: 3, fats: 0 },
            { id: 'f4', name: 'Mamão papaya', quantity: '1/2 unidade', calories: 60, protein: 1, carbs: 15, fats: 0 },
            { id: 'f5', name: 'Semente de linhaça', quantity: '1 col. sopa', calories: 55, protein: 2, carbs: 3, fats: 4 },
          ],
          notes: 'Priorizar ovos caipiras. Usar pouco sal.'
        },
        { 
          id: '2', time: '10:30', name: 'Lanche da Manhã', 
          items: [
             { id: 'f6', name: 'Mix de castanhas', quantity: '30g', calories: 180, protein: 5, carbs: 6, fats: 16 },
             { id: 'f7', name: 'Chá de Gengibre', quantity: '1 xícara', calories: 0, protein: 0, carbs: 0, fats: 0 },
          ],
        },
        { 
          id: '3', time: '13:00', name: 'Almoço', 
          items: [
             { id: 'f8', name: 'Salada de folhas verdes', quantity: 'à vontade', calories: 15, protein: 1, carbs: 3, fats: 0 },
             { id: 'f9', name: 'Peixe grelhado (Tilápia)', quantity: '120g', calories: 150, protein: 31, carbs: 0, fats: 3 },
             { id: 'f10', name: 'Arroz negro', quantity: '4 col. sopa', calories: 140, protein: 3, carbs: 30, fats: 1 },
             { id: 'f11', name: 'Brócolis no vapor', quantity: '1 xícara', calories: 35, protein: 3, carbs: 6, fats: 0 },
             { id: 'f12', name: 'Azeite de oliva extra virgem', quantity: '1 fio', calories: 40, protein: 0, carbs: 0, fats: 4.5 },
          ],
          notes: 'Temperar salada com limão e azeite.'
        },
        { 
          id: '4', time: '16:00', name: 'Lanche da Tarde', 
          items: [
             { id: 'f13', name: 'Iogurte natural sem lactose', quantity: '1 unidade', calories: 100, protein: 8, carbs: 12, fats: 3 },
             { id: 'f14', name: 'Morangos', quantity: '6 unidades', calories: 30, protein: 1, carbs: 7, fats: 0 },
             { id: 'f15', name: 'Aveia em flocos', quantity: '2 col. sopa', calories: 70, protein: 3, carbs: 12, fats: 1.5 },
          ],
        },
         { 
          id: '5', time: '20:00', name: 'Jantar', 
          items: [
             { id: 'f16', name: 'Sopa de abóbora c/ gengibre', quantity: '1 prato fundo', calories: 180, protein: 4, carbs: 35, fats: 3 },
             { id: 'f17', name: 'Frango desfiado', quantity: '100g', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
          ],
          notes: 'Evitar refeições pesadas após as 20h para não atrapalhar o sono e a digestão.'
        }
      ]
    },
    symptomsLog: [
      { date: '2026-10-25', painLevel: 8, bloating: 7, energy: 3, cyclePhase: 'Menstrual' },
      { date: '2026-10-26', painLevel: 6, bloating: 6, energy: 4, cyclePhase: 'Menstrual' },
      { date: '2026-10-27', painLevel: 4, bloating: 3, energy: 6, cyclePhase: 'Folicular' },
      { date: '2026-10-28', painLevel: 2, bloating: 1, energy: 8, cyclePhase: 'Folicular' },
      { date: '2026-10-29', painLevel: 1, bloating: 1, energy: 9, cyclePhase: 'Folicular' },
    ]
  },
  {
    id: '2',
    name: 'Carla Mendez',
    age: 34,
    email: 'carla.m@email.com',
    condition: 'Tentante',
    stage: 'Pré-concepção',
    status: 'Ativo',
    lastVisit: '2026-10-01',
    nextVisit: '2026-11-05',
    avatarUrl: 'https://picsum.photos/200/200?random=2',
    goals: [
       { id: 'g3', description: 'Melhorar qualidade ovocitária', deadline: '2027-01-10', status: 'Em andamento', progress: 40 },
       { id: 'g4', description: 'Reduzir consumo de café', deadline: '2026-11-01', status: 'Concluída', progress: 100 }
    ],
    symptomsLog: []
  },
  {
    id: '3',
    name: 'Fernanda Torres',
    age: 45,
    email: 'nanda@email.com',
    condition: 'Climatério',
    stage: 'Inicial',
    status: 'Pendente',
    lastVisit: '2026-09-20',
    nextVisit: '2026-11-10',
    avatarUrl: 'https://picsum.photos/200/200?random=3',
    goals: [],
    symptomsLog: []
  },
    {
    id: '4',
    name: 'Mariana Costa',
    age: 25,
    email: 'mari@email.com',
    condition: 'SOP',
    status: 'Ativo',
    lastVisit: '2026-10-20',
    nextVisit: '2026-11-25',
    avatarUrl: 'https://picsum.photos/200/200?random=4',
    goals: [
        { id: 'g5', description: 'Perda de peso (5kg)', deadline: '2026-12-25', status: 'Em andamento', progress: 20 },
    ],
    symptomsLog: []
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '101', patientId: '1', patientName: 'Ana Júlia Silva', date: '2026-10-30', time: '09:00', type: 'Retorno', status: 'Agendada' },
  { id: '102', patientId: '4', patientName: 'Mariana Costa', date: '2026-10-30', time: '11:00', type: 'Online', status: 'Agendada' },
  { id: '103', patientId: '2', patientName: 'Carla Mendez', date: '2026-10-30', time: '14:30', type: 'Primeira Consulta', status: 'Agendada' },
];