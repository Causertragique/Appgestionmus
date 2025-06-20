import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Group, Homework, Message, Announcement, HomeworkSubmission, User, PracticeReport, Assignment, AssignmentSubmission, CourseNote, Purchase, StudentDebt } from '../types';

interface DataContextType {
  groups: Group[];
  homework: Homework[];
  messages: Message[];
  announcements: Announcement[];
  users: User[];
  practiceReports: PracticeReport[];
  assignments: Assignment[];
  courseNotes: CourseNote[];
  purchases: Purchase[];
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void;
  updateGroup: (groupId: string, updates: { name: string; description: string }) => void;
  deleteGroup: (groupId: string) => void;
  addHomework: (homework: Omit<Homework, 'id' | 'createdAt' | 'submissions'>) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'readBy'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  submitHomework: (submission: Omit<HomeworkSubmission, 'id' | 'submittedAt'>) => void;
  addPracticeReport: (report: Omit<PracticeReport, 'id' | 'submittedAt'>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissions'>) => void;
  submitAssignment: (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt'>) => void;
  evaluateAssignment: (submissionId: string, grade: number, feedback: string) => void;
  addCourseNote: (note: Omit<CourseNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourseNote: (noteId: string, updates: Partial<Omit<CourseNote, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCourseNote: (noteId: string) => void;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => void;
  markPurchaseAsPaid: (purchaseId: string) => void;
  getStudentDebt: (studentId: string) => StudentDebt;
  getStudentsByGroup: (groupId: string) => User[];
  getStudentPracticeReports: (studentId: string) => PracticeReport[];
  getActiveGroups: (teacherId: string) => Group[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Utilisateurs fictifs
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Dubois',
    email: 'teacher@demo.com',
    role: 'teacher'
  },
  {
    id: '2',
    firstName: 'Emma',
    lastName: 'Martin',
    email: 'student1@demo.com',
    role: 'student',
    groupId: 'group118',
    instrument: 'Piano',
    picture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    firstName: 'Lucas',
    lastName: 'Moreau',
    email: 'student2@demo.com',
    role: 'student',
    groupId: 'group119',
    instrument: 'Guitare',
    picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    firstName: 'Sofia',
    lastName: 'Rodriguez',
    email: 'student3@demo.com',
    role: 'student',
    groupId: 'group218',
    instrument: 'Violon',
    picture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

// Données fictives avec les nouveaux groupes
const mockGroups: Group[] = [
  {
    id: 'group118',
    name: '118',
    description: 'Groupe de musique 118',
    teacherId: '1',
    studentIds: ['2'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'group119',
    name: '119',
    description: 'Groupe de musique 119',
    teacherId: '1',
    studentIds: ['3'],
    createdAt: new Date('2024-01-16')
  },
  {
    id: 'group218',
    name: '218',
    description: 'Groupe de musique 218',
    teacherId: '1',
    studentIds: ['4'],
    createdAt: new Date('2024-01-17')
  },
  {
    id: 'group219',
    name: '219',
    description: 'Groupe de musique 219',
    teacherId: '1',
    studentIds: [],
    createdAt: new Date('2024-01-18')
  },
  {
    id: 'group318',
    name: '318',
    description: 'Groupe de musique 318',
    teacherId: '1',
    studentIds: [],
    createdAt: new Date('2024-01-19')
  },
  {
    id: 'group319',
    name: '319',
    description: 'Groupe de musique 319',
    teacherId: '1',
    studentIds: [],
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'group418',
    name: '418',
    description: 'Groupe de musique 418',
    teacherId: '1',
    studentIds: [],
    createdAt: new Date('2024-01-21')
  },
  {
    id: 'group419',
    name: '419',
    description: 'Groupe de musique 419',
    teacherId: '1',
    studentIds: [],
    createdAt: new Date('2024-01-22')
  },
  {
    id: 'group518',
    name: '518',
    description: 'Groupe de musique 518',
    teacherId: '1',
    studentIds: [],
    createdAt: new Date('2024-01-23')
  },
  {
    id: 'group519',
    name: '519',
    description: 'Groupe de musique 519',
    teacherId: '1',
    studentIds: [],
    createdAt: new Date('2024-01-24')
  }
];

const mockHomework: Homework[] = [
  {
    id: 'hw1',
    title: 'Pratiquer la Gamme de Do Majeur',
    description: 'Pratiquez la gamme de Do majeur avec les deux mains. Concentrez-vous sur le bon positionnement des doigts (1-2-3-1-2-3-4-5). Jouez lentement au début, puis augmentez progressivement le tempo.',
    dueDate: new Date('2024-12-25'),
    groupId: 'group118',
    teacherId: '1',
    createdAt: new Date('2024-12-18'),
    submissions: []
  },
  {
    id: 'hw2',
    title: 'Apprendre la Progression d\'Accords de "Wonderwall"',
    description: 'Maîtrisez la progression d\'accords de "Wonderwall" d\'Oasis (Em7-G-D-C-Am-C-D). Pratiquez les transitions fluides entre les accords.',
    dueDate: new Date('2024-12-28'),
    groupId: 'group119',
    teacherId: '1',
    createdAt: new Date('2024-12-19'),
    submissions: []
  },
  {
    id: 'hw3',
    title: 'Exercices de Vibrato au Violon',
    description: 'Travaillez les exercices de vibrato sur les cordes à vide, puis appliquez-les sur la gamme de Sol majeur. Concentrez-vous sur la régularité du mouvement.',
    dueDate: new Date('2024-12-30'),
    groupId: 'group218',
    teacherId: '1',
    createdAt: new Date('2024-12-20'),
    submissions: []
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: '1',
    groupId: 'group118',
    content: 'Excellent progrès tout le monde ! N\'oubliez pas de pratiquer vos gammes quotidiennement.',
    type: 'group',
    createdAt: new Date('2024-12-19'),
    readBy: ['1']
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Récital d\'Hiver - 30 Décembre',
    content: 'Notre récital d\'hiver est prévu pour le 30 décembre à 19h dans l\'auditorium de l\'école. Tous les élèves sont encouragés à participer.',
    teacherId: '1',
    priority: 'high',
    createdAt: new Date('2024-12-18')
  }
];

// Rapports de pratique fictifs
const mockPracticeReports: PracticeReport[] = [
  {
    id: 'pr1',
    studentId: '2',
    practiceDate: new Date('2024-12-15'),
    duration: 45,
    location: 'home',
    content: 'J\'ai travaillé les gammes de Do majeur et Sol majeur. J\'ai aussi pratiqué "Für Elise" les 16 premières mesures.',
    nextGoals: 'Continuer à travailler la fluidité des gammes et apprendre la suite de "Für Elise".',
    submittedAt: new Date('2024-12-15'),
    type: 'general'
  },
  {
    id: 'pr2',
    studentId: '2',
    practiceDate: new Date('2024-12-17'),
    duration: 30,
    location: 'school',
    content: 'Pratique en salle de musique. Travail sur les arpèges et révision des gammes.',
    nextGoals: 'Améliorer la vitesse des arpèges et travailler la pédale de sustain.',
    submittedAt: new Date('2024-12-17'),
    type: 'general'
  },
  {
    id: 'pr3',
    studentId: '3',
    practiceDate: new Date('2024-12-16'),
    duration: 60,
    location: 'home',
    content: 'Travail sur les accords de base : Am, C, D, Em, F, G. Pratique des transitions.',
    nextGoals: 'Maîtriser parfaitement les transitions entre tous les accords de base.',
    submittedAt: new Date('2024-12-16'),
    type: 'general'
  }
];

// Devoirs fictifs avec les nouveaux types et assignations multiples
const mockAssignments: Assignment[] = [
  {
    id: 'assign1',
    title: 'Analyse Harmonique - Sonate K.331 de Mozart',
    description: 'Analysez le premier mouvement de la Sonate K.331 de Mozart. Identifiez les modulations, les cadences et la structure formelle. Rédigez une analyse de 2 pages.',
    dueDate: new Date('2025-01-15'),
    groupIds: ['group118'],
    assignedStudentIds: ['2'],
    teacherId: '1',
    type: 'theory',
    maxPoints: 100,
    createdAt: new Date('2024-12-20'),
    submissions: [
      {
        id: 'sub1',
        assignmentId: 'assign1',
        studentId: '2',
        content: 'Analyse détaillée de la Sonate K.331 de Mozart. Le premier mouvement est en forme sonate avec exposition, développement et réexposition. La tonalité principale est La majeur avec modulations vers Mi majeur (dominante) et Fa# mineur (relatif mineur). Les cadences sont principalement parfaites et plagales.',
        attachments: ['analyse_mozart_k331.pdf'],
        submittedAt: new Date('2025-01-10'),
        grade: 85,
        feedback: 'Excellente analyse structurelle ! Vous avez bien identifié les modulations principales. Pour améliorer, analysez plus en détail les progressions harmoniques dans le développement.'
      }
    ]
  },
  {
    id: 'assign2',
    title: 'Enregistrement - Gamme de Sol Majeur',
    description: 'Enregistrez-vous en jouant la gamme de Sol majeur sur 2 octaves, montante et descendante, à un tempo de 120 BPM. Soignez l\'articulation et la justesse.',
    dueDate: new Date('2025-01-20'),
    groupIds: ['group119', 'group218'],
    assignedStudentIds: ['3', '4'],
    teacherId: '1',
    type: 'audio_recording',
    maxPoints: 100,
    createdAt: new Date('2024-12-21'),
    submissions: [
      {
        id: 'sub2',
        assignmentId: 'assign2',
        studentId: '3',
        content: 'Enregistrement de la gamme de Sol majeur à la guitare. J\'ai travaillé particulièrement sur la régularité du tempo et la clarté de chaque note.',
        attachments: ['gamme_sol_majeur_guitare.mp3'],
        submittedAt: new Date('2025-01-18'),
        grade: 92,
        feedback: 'Très bon travail ! Le tempo est régulier et les notes sont claires. Attention à la transition entre les octaves, elle pourrait être plus fluide.'
      }
    ]
  },
  {
    id: 'assign3',
    title: 'Dictée Mélodique - Intervalles',
    description: 'Complétez les exercices de dictée mélodique portant sur les intervalles de 2nde à 8ve. Utilisez la plateforme en ligne fournie.',
    dueDate: new Date('2025-01-25'),
    groupIds: ['group118', 'group119', 'group218'],
    assignedStudentIds: ['2', '3', '4'],
    teacherId: '1',
    type: 'solfege_dictation',
    maxPoints: 100,
    createdAt: new Date('2024-12-22'),
    submissions: []
  }
];

// Notes de cours fictives avec les nouveaux champs
const mockCourseNotes: CourseNote[] = [
  {
    id: 'note1',
    title: 'Les Gammes Majeures - Théorie et Pratique',
    content: `# Les Gammes Majeures

## Structure
Une gamme majeure suit le schéma : Ton - Ton - Demi-ton - Ton - Ton - Ton - Demi-ton

## Exemples
- **Do majeur** : Do - Ré - Mi - Fa - Sol - La - Si - Do
- **Sol majeur** : Sol - La - Si - Do - Ré - Mi - Fa# - Sol

## Exercices recommandés
1. Pratiquer chaque gamme lentement
2. Travailler les arpèges correspondants
3. Jouer en rythme avec métronome`,
    teacherId: '1',
    category: 'theory',
    tags: ['gammes', 'théorie', 'majeur'],
    attachments: [
      {
        id: 'att1',
        fileName: 'gammes_majeures_exercices.pdf',
        originalName: 'Exercices Gammes Majeures.pdf',
        fileSize: 245760,
        mimeType: 'application/pdf',
        url: 'https://example.com/files/gammes_majeures_exercices.pdf',
        uploadedAt: new Date('2024-12-15')
      }
    ],
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: 'note2',
    title: 'Technique de l\'Archet au Violon',
    content: `# Technique de l'Archet

## Position de base
- Pouce détendu sur la hausse
- Index sur la baguette
- Majeur et annulaire sur la grenouille

## Exercices
1. **Détaché** : Notes séparées et articulées
2. **Legato** : Notes liées et fluides
3. **Staccato** : Notes courtes et détachées

## Points d'attention
- Maintenir la pression constante
- Garder l'archet perpendiculaire aux cordes
- Respirer avec le mouvement`,
    teacherId: '1',
    groupId: 'group218',
    category: 'technique',
    tags: ['violon', 'archet', 'technique'],
    attachments: [
      {
        id: 'att2',
        fileName: 'technique_archet_demo.mp4',
        originalName: 'Démonstration Technique Archet.mp4',
        fileSize: 15728640,
        mimeType: 'video/mp4',
        url: 'https://example.com/files/technique_archet_demo.mp4',
        uploadedAt: new Date('2024-12-16')
      }
    ],
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date('2024-12-16')
  },
  {
    id: 'note3',
    title: 'Répertoire Romantique pour Piano',
    content: `# Répertoire Romantique

## Compositeurs incontournables
- **Chopin** : Nocturnes, Valses, Polonaises
- **Schumann** : Scènes d'enfants, Carnaval
- **Liszt** : Rêves d'amour, Rhapsodies hongroises

## Caractéristiques du style
- Expression émotionnelle intense
- Utilisation de la pédale de sustain
- Rubato et flexibilité rythmique
- Dynamiques contrastées

## Œuvres pour débuter
1. Chopin - Valse en La mineur
2. Schumann - Rêverie
3. Mendelssohn - Romances sans paroles`,
    teacherId: '1',
    groupId: 'group118',
    category: 'repertoire',
    tags: ['piano', 'romantique', 'répertoire'],
    attachments: [
      {
        id: 'att3',
        fileName: 'chopin_valse_partition.pdf',
        originalName: 'Chopin - Valse en La mineur.pdf',
        fileSize: 512000,
        mimeType: 'application/pdf',
        url: 'https://example.com/files/chopin_valse_partition.pdf',
        uploadedAt: new Date('2024-12-17')
      },
      {
        id: 'att4',
        fileName: 'chopin_valse_audio.mp3',
        originalName: 'Chopin Valse - Interprétation.mp3',
        fileSize: 3145728,
        mimeType: 'audio/mpeg',
        url: 'https://example.com/files/chopin_valse_audio.mp3',
        uploadedAt: new Date('2024-12-17')
      }
    ],
    createdAt: new Date('2024-12-17'),
    updatedAt: new Date('2024-12-17')
  }
];

// Achats fictifs pour démonstration avec devise canadienne
const mockPurchases: Purchase[] = [
  {
    id: 'purchase1',
    studentId: '2',
    studentName: 'Emma Martin',
    groupId: 'group118',
    groupName: '118',
    item: 'Méthode de Piano - Niveau 2',
    amount: 35.50,
    status: 'credit',
    createdAt: new Date('2024-12-10'),
    teacherId: '1'
  },
  {
    id: 'purchase2',
    studentId: '2',
    studentName: 'Emma Martin',
    groupId: 'group118',
    groupName: '118',
    item: 'Partition - Für Elise',
    amount: 12.00,
    status: 'paid',
    createdAt: new Date('2024-12-05'),
    paidAt: new Date('2024-12-12'),
    teacherId: '1'
  },
  {
    id: 'purchase3',
    studentId: '3',
    studentName: 'Lucas Moreau',
    groupId: 'group119',
    groupName: '119',
    item: 'Cordes de Guitare (Jeu complet)',
    amount: 22.00,
    status: 'credit',
    createdAt: new Date('2024-12-15'),
    teacherId: '1'
  },
  {
    id: 'purchase4',
    studentId: '4',
    studentName: 'Sofia Rodriguez',
    groupId: 'group218',
    groupName: '218',
    item: 'Colophane pour Archet',
    amount: 18.00,
    status: 'paid',
    createdAt: new Date('2024-12-08'),
    paidAt: new Date('2024-12-08'),
    teacherId: '1'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [homework, setHomework] = useState<Homework[]>(mockHomework);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [practiceReports, setPracticeReports] = useState<PracticeReport[]>(mockPracticeReports);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [courseNotes, setCourseNotes] = useState<CourseNote[]>(mockCourseNotes);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);

  const addGroup = (groupData: Omit<Group, 'id' | 'createdAt'>) => {
    const newGroup: Group = {
      ...groupData,
      id: `group${Date.now()}`,
      createdAt: new Date()
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const updateGroup = (groupId: string, updates: { name: string; description: string }) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, ...updates }
        : group
    ));
  };

  const deleteGroup = (groupId: string) => {
    // Remove the group
    setGroups(prev => prev.filter(group => group.id !== groupId));
    
    // Remove related homework
    setHomework(prev => prev.filter(hw => hw.groupId !== groupId));
    
    // Remove related messages
    setMessages(prev => prev.filter(msg => msg.groupId !== groupId));
    
    // Remove related announcements
    setAnnouncements(prev => prev.filter(ann => ann.groupId !== groupId));
    
    // Remove related assignments
    setAssignments(prev => prev.filter(assign => !assign.groupIds.includes(groupId)));
    
    // Update course notes to remove group reference
    setCourseNotes(prev => prev.map(note => ({
      ...note,
      groupId: note.groupId === groupId ? undefined : note.groupId
    })));
    
    // Update users to remove group assignment
    setUsers(prev => prev.map(user => 
      user.groupId === groupId 
        ? { ...user, groupId: undefined }
        : user
    ));
  };

  const addHomework = (homeworkData: Omit<Homework, 'id' | 'createdAt' | 'submissions'>) => {
    const newHomework: Homework = {
      ...homeworkData,
      id: `hw${Date.now()}`,
      createdAt: new Date(),
      submissions: []
    };
    setHomework(prev => [...prev, newHomework]);
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'createdAt' | 'readBy'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg${Date.now()}`,
      createdAt: new Date(),
      readBy: [messageData.senderId]
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addAnnouncement = (announcementData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `ann${Date.now()}`,
      createdAt: new Date()
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
  };

  const submitHomework = (submissionData: Omit<HomeworkSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission: HomeworkSubmission = {
      ...submissionData,
      id: `sub${Date.now()}`,
      submittedAt: new Date()
    };

    // Add to homework submissions
    setHomework(prev => prev.map(hw => 
      hw.id === submissionData.homeworkId 
        ? { ...hw, submissions: [...hw.submissions, newSubmission] }
        : hw
    ));

    // Also add to practice reports for statistics
    const homeworkItem = homework.find(hw => hw.id === submissionData.homeworkId);
    const practiceReport: PracticeReport = {
      id: `pr${Date.now()}`,
      studentId: submissionData.studentId,
      practiceDate: submissionData.practiceDate,
      duration: submissionData.duration,
      location: submissionData.location,
      content: submissionData.content,
      nextGoals: submissionData.nextGoals,
      submittedAt: new Date(),
      type: 'homework',
      homeworkId: submissionData.homeworkId,
      homeworkTitle: homeworkItem?.title
    };

    setPracticeReports(prev => [...prev, practiceReport]);
  };

  const addPracticeReport = (reportData: Omit<PracticeReport, 'id' | 'submittedAt'>) => {
    const newReport: PracticeReport = {
      ...reportData,
      id: `pr${Date.now()}`,
      submittedAt: new Date()
    };
    setPracticeReports(prev => [...prev, newReport]);
  };

  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'submissions'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assign${Date.now()}`,
      createdAt: new Date(),
      submissions: []
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const submitAssignment = (submissionData: Omit<AssignmentSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission: AssignmentSubmission = {
      ...submissionData,
      id: `asub${Date.now()}`,
      submittedAt: new Date()
    };

    setAssignments(prev => prev.map(assign => 
      assign.id === submissionData.assignmentId 
        ? { ...assign, submissions: [...assign.submissions, newSubmission] }
        : assign
    ));
  };

  const evaluateAssignment = (submissionId: string, grade: number, feedback: string) => {
    setAssignments(prev => prev.map(assignment => ({
      ...assignment,
      submissions: assignment.submissions.map(submission => 
        submission.id === submissionId 
          ? { ...submission, grade, feedback }
          : submission
      )
    })));
  };

  const addCourseNote = (noteData: Omit<CourseNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: CourseNote = {
      ...noteData,
      id: `note${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCourseNotes(prev => [...prev, newNote]);
  };

  const updateCourseNote = (noteId: string, updates: Partial<Omit<CourseNote, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setCourseNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteCourseNote = (noteId: string) => {
    setCourseNotes(prev => prev.filter(note => note.id !== noteId));
  };

  // Fonctions pour la gestion financière
  const addPurchase = (purchaseData: Omit<Purchase, 'id' | 'createdAt'>) => {
    const newPurchase: Purchase = {
      ...purchaseData,
      id: `purchase${Date.now()}`,
      createdAt: new Date()
    };
    setPurchases(prev => [...prev, newPurchase]);
  };

  const markPurchaseAsPaid = (purchaseId: string) => {
    setPurchases(prev => prev.map(purchase => 
      purchase.id === purchaseId 
        ? { ...purchase, status: 'paid', paidAt: new Date() }
        : purchase
    ));
  };

  const getStudentDebt = (studentId: string): StudentDebt => {
    const studentPurchases = purchases.filter(p => p.studentId === studentId);
    const totalDebt = studentPurchases
      .filter(p => p.status === 'credit')
      .reduce((total, purchase) => total + purchase.amount, 0);
    
    return {
      studentId,
      totalDebt,
      purchases: studentPurchases
    };
  };

  const getStudentsByGroup = (groupId: string): User[] => {
    return users.filter(user => user.groupId === groupId && user.role === 'student');
  };

  const getStudentPracticeReports = (studentId: string): PracticeReport[] => {
    return practiceReports
      .filter(report => report.studentId === studentId)
      .sort((a, b) => new Date(b.practiceDate).getTime() - new Date(a.practiceDate).getTime());
  };

  const getActiveGroups = (teacherId: string): Group[] => {
    return groups.filter(group => 
      group.teacherId === teacherId && 
      (group.studentIds.length > 0 || group.createdAt > new Date('2024-12-01'))
    );
  };

  return (
    <DataContext.Provider value={{
      groups,
      homework,
      messages,
      announcements,
      users,
      practiceReports,
      assignments,
      courseNotes,
      purchases,
      addGroup,
      updateGroup,
      deleteGroup,
      addHomework,
      addMessage,
      addAnnouncement,
      submitHomework,
      addPracticeReport,
      addAssignment,
      submitAssignment,
      evaluateAssignment,
      addCourseNote,
      updateCourseNote,
      deleteCourseNote,
      addPurchase,
      markPurchaseAsPaid,
      getStudentDebt,
      getStudentsByGroup,
      getStudentPracticeReports,
      getActiveGroups
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData doit être utilisé dans un DataProvider');
  }
  return context;
}