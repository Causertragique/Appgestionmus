import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Group, Homework, Message, Announcement, HomeworkSubmission, User, PracticeReport, Assignment, AssignmentSubmission, CourseNote, Purchase, StudentDebt } from '../types';
import { userService, groupService, homeworkService, messageService, announcementService, purchaseService } from '../services/firebaseService';

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
  loading: boolean;
  addUser: (user: Omit<User, 'id'>) => Promise<string>;
  addStudentToGroup: (studentId: string, groupId: string) => Promise<void>;
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => Promise<string>;
  updateGroup: (groupId: string, updates: { name: string; description: string }) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  addHomework: (homework: Omit<Homework, 'id' | 'createdAt' | 'submissions'>) => Promise<string>;
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'readBy'>) => Promise<string>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<string>;
  submitHomework: (submission: Omit<HomeworkSubmission, 'id' | 'submittedAt'>) => void;
  addPracticeReport: (report: Omit<PracticeReport, 'id' | 'submittedAt'>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissions'>) => void;
  submitAssignment: (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt'>) => void;
  evaluateAssignment: (submissionId: string, grade: number, feedback: string) => void;
  addCourseNote: (note: Omit<CourseNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourseNote: (noteId: string, updates: Partial<Omit<CourseNote, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCourseNote: (noteId: string) => void;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => Promise<string>;
  markPurchaseAsPaid: (purchaseId: string) => Promise<void>;
  getStudentDebt: (studentId: string) => StudentDebt;
  getStudentsByGroup: (groupId: string) => User[];
  getStudentPracticeReports: (studentId: string) => PracticeReport[];
  getActiveGroups: (teacherId: string) => Group[];
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [practiceReports, setPracticeReports] = useState<PracticeReport[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courseNotes, setCourseNotes] = useState<CourseNote[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const addUser = async (userData: Omit<User, 'id'>) => {
    // Vérifier si Firebase est configuré
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    let userId: string;

    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'test-api-key') {
      // Mode mémoire
      userId = `user${Date.now()}`;
    } else {
      // Mode Firebase
      userId = await userService.create(userData);
    }

    const newUser: User = {
      ...userData,
      id: userId
    };
    setUsers(prev => [...prev, newUser]);
    return userId;
  };

  const addGroup = async (groupData: Omit<Group, 'id' | 'createdAt'>) => {
    // Vérifier si Firebase est configuré
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    let groupId: string;

    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'test-api-key') {
      // Mode mémoire
      groupId = `group${Date.now()}`;
    } else {
      // Mode Firebase
      groupId = await groupService.create(groupData);
    }

    const newGroup: Group = {
      ...groupData,
      id: groupId,
      createdAt: new Date()
    };
    setGroups(prev => [...prev, newGroup]);
    return groupId;
  };

  const updateGroup = async (groupId: string, updates: { name: string; description: string }) => {
    await groupService.update(groupId, updates);
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, ...updates }
        : group
    ));
  };

  const deleteGroup = async (groupId: string) => {
    await groupService.delete(groupId);
    setGroups(prev => prev.filter(group => group.id !== groupId));
    setHomework(prev => prev.filter(hw => hw.groupId !== groupId));
    setMessages(prev => prev.filter(msg => msg.groupId !== groupId));
    setAnnouncements(prev => prev.filter(ann => ann.groupId !== groupId));
    setAssignments(prev => prev.filter(assign => !assign.groupIds.includes(groupId)));
    setCourseNotes(prev => prev.map(note => ({
      ...note,
      groupId: note.groupId === groupId ? undefined : note.groupId
    })));
    setUsers(prev => prev.map(user => 
      user.groupId === groupId 
        ? { ...user, groupId: undefined }
        : user
    ));
  };

  const addHomework = async (homeworkData: Omit<Homework, 'id' | 'createdAt' | 'submissions'>) => {
    const homeworkId = await homeworkService.create(homeworkData);
    const newHomework: Homework = {
      ...homeworkData,
      id: homeworkId,
      createdAt: new Date(),
      submissions: []
    };
    setHomework(prev => [...prev, newHomework]);
    return homeworkId;
  };

  const addMessage = async (messageData: Omit<Message, 'id' | 'createdAt' | 'readBy'>) => {
    const messageId = await messageService.create(messageData);
    const newMessage: Message = {
      ...messageData,
      id: messageId,
      createdAt: new Date(),
      readBy: [messageData.senderId]
    };
    setMessages(prev => [...prev, newMessage]);
    return messageId;
  };

  const addAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const announcementId = await announcementService.create(announcementData);
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: announcementId,
      createdAt: new Date()
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
    return announcementId;
  };

  const submitHomework = (submissionData: Omit<HomeworkSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission: HomeworkSubmission = {
      ...submissionData,
      id: `sub${Date.now()}`,
      submittedAt: new Date()
    };

    setHomework(prev => prev.map(hw => 
      hw.id === submissionData.homeworkId 
        ? { ...hw, submissions: [...hw.submissions, newSubmission] }
        : hw
    ));

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

  const addPurchase = async (purchaseData: Omit<Purchase, 'id' | 'createdAt'>) => {
    const purchaseId = await purchaseService.create(purchaseData);
    const newPurchase: Purchase = {
      ...purchaseData,
      id: purchaseId,
      createdAt: new Date()
    };
    setPurchases(prev => [...prev, newPurchase]);
    return purchaseId;
  };

  const markPurchaseAsPaid = async (purchaseId: string) => {
    await purchaseService.markAsPaid(purchaseId);
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

  const addStudentToGroup = async (studentId: string, groupId: string) => {
    await groupService.addStudentToGroup(groupId, studentId);
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, studentIds: [...group.studentIds, studentId] }
        : group
    ));
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      // Vérifier si Firebase est configuré
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };

      // Si Firebase n'est pas configuré, utiliser les données en mémoire
      if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'test-api-key') {
        console.warn('Firebase non configuré. Utilisation du mode mémoire.');
        setLoading(false);
        return;
      }

      const [newGroups, newHomework, newMessages, newAnnouncements, newUsers, newPurchases] = await Promise.all([
        groupService.getAll(),
        homeworkService.getAll(),
        messageService.getAll(),
        announcementService.getAll(),
        userService.getAll(),
        purchaseService.getAll()
      ]);
      setGroups(newGroups);
      setHomework(newHomework);
      setMessages(newMessages);
      setAnnouncements(newAnnouncements);
      setUsers(newUsers);
      setPurchases(newPurchases);
    } catch (error) {
      console.error('Erreur lors du chargement des données Firebase:', error);
      console.warn('Utilisation du mode mémoire en cas d\'erreur Firebase.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    refreshData();
  }, []);

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
      loading,
      addUser,
      addStudentToGroup,
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
      getActiveGroups,
      refreshData
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