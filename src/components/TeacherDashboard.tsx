import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Music, 
  MessageSquare, 
  Megaphone, 
  Plus, 
  LogOut,
  Filter,
  Calendar,
  Clock,
  ChevronDown,
  User,
  Settings,
  UserPlus,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Share2,
  Bell,
  X,
  Key,
  Target,
  Trophy,
  AlertCircle,
  RotateCcw,
  Volume2,
  Monitor,
  ShoppingCart,
  Wrench,
  MessageCircle,
  BarChart,
  TrendingUp,
  LineChart,
  Package,
  Brain,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useSettings } from '../contexts/SettingsContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, getDaysInMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import GroupManager from './GroupManager';
import HomeworkManager from './HomeworkManager';
import ChatCenter from './ChatCenter';
import AnnouncementManager from './AnnouncementManager';
import TeacherProfile from './TeacherProfile';
import StudentManager from './StudentManager';
import AssignmentManager from './AssignmentManager';
import CourseNotesManager from './CourseNotesManager';
import BudgetDashboard from './BudgetDashboard';
import AppSettings from './AppSettings';
import Logo from './Logo';
import SalesManager from './SalesManager';
import NotificationCenter from './NotificationCenter';
import GamificationManager from './GamificationManager';
import IA from './IA';
import IAToolsManager from './IAToolsManager';
import Metronome from './Metronome';
import Tuner from './Tuner';
import MacBookChat from './MacBookChat';
import BudgetExpenseManager from './BudgetExpenseManager';
import BudgetOverview from './BudgetOverview';

type TabType = 'homework' | 'messages' | 'announcements' | 'profile' | 'groups' | 'students' | 'assignments' | 'notes' | 'finance' | 'inventory' | 'sales' | 'fournitures' | 'evenements' | 'reparations' | 'specialistes' | 'licenses' | 'gamification' | 'ia-quebec' | 'tools' | 'macbook-chat' | 'overview' | 'ia';

interface CalendarEvent {
  type: string;
  title: string;
  color: string;
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<TabType | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [toolView, setToolView] = useState<'metronome' | 'tuner'>('metronome');
  const { user, logout } = useAuth();
  const { groups, homework, messages, announcements, assignments, courseNotes, purchases, getStudentsByGroup } = useData();
  const { resetSettings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [showGamificationMessageModal, setShowGamificationMessageModal] = useState(false);
  const [showGamificationPointsModal, setShowGamificationPointsModal] = useState(false);
  const [showGamificationChallengeModal, setShowGamificationChallengeModal] = useState(false);
  const [selectedGamificationStudent, setSelectedGamificationStudent] = useState('');
  const [gamificationMessageText, setGamificationMessageText] = useState('');
  const [gamificationPointsToAward, setGamificationPointsToAward] = useState(10);
  const [gamificationChallengeTitle, setGamificationChallengeTitle] = useState('');
  const [gamificationChallengeDescription, setGamificationChallengeDescription] = useState('');
  const [isInitializingData, setIsInitializingData] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  const teacherGroups = groups.filter(group => group.teacherId === user?.id);
  const selectedGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) : null;
  
  // Charger les notifications
  useEffect(() => {
    if (user?.id) {
      const loadNotificationCount = async () => {
        try {
          const { notificationService } = await import('../services/firebaseService');
          const count = await notificationService.getUnreadCount(user.id);
          setUnreadNotificationCount(count);
        } catch (error) {
          console.error('Erreur lors du chargement du compteur de notifications:', error);
        }
      };
      
      loadNotificationCount();
      
      // Mettre à jour le compteur toutes les 30 secondes
      const interval = setInterval(loadNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);
  
  // Bloquer le défilement quand le modal est ouvert
  useEffect(() => {
    if (showSettings) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Nettoyer lors du démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSettings]);
  
  // Filter data based on selected group
  const filteredHomework = selectedGroupId 
    ? homework.filter(hw => hw.groupId === selectedGroupId)
    : homework.filter(hw => hw.teacherId === user?.id);
  
  const filteredMessages = selectedGroupId
    ? messages.filter(msg => msg.groupId === selectedGroupId)
    : messages.filter(msg => msg.senderId === user?.id);
    
  const filteredAnnouncements = selectedGroupId
    ? announcements.filter(ann => ann.groupId === selectedGroupId)
    : announcements.filter(ann => ann.teacherId === user?.id);

  const filteredAssignments = selectedGroupId
    ? assignments.filter(assign => assign.groupIds.includes(selectedGroupId))
    : assignments.filter(assign => assign.teacherId === user?.id);

  const filteredCourseNotes = selectedGroupId
    ? courseNotes.filter(note => !note.groupId || note.groupId === selectedGroupId)
    : courseNotes.filter(note => note.teacherId === user?.id);

  const filteredPurchases = selectedGroupId
    ? purchases.filter(purchase => purchase.groupId === selectedGroupId)
    : purchases.filter(purchase => purchase.teacherId === user?.id);

  // Calendar functions
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Fonction pour initialiser les données de test
  const initializeTestData = async () => {
    setIsInitializingData(true);
    try {
      // Créer des élèves de test
      const testStudents = [
        { firstName: 'Emma', lastName: 'Martin', email: 'emma@test.com', instrument: 'Piano' },
        { firstName: 'Lucas', lastName: 'Moreau', email: 'lucas@test.com', instrument: 'Guitare' },
        { firstName: 'Sofia', lastName: 'Rodriguez', email: 'sofia@test.com', instrument: 'Violon' }
      ];

      // Créer un groupe de test
      const testGroup = {
        name: 'Groupe Test',
        description: 'Groupe de test pour le chat',
        teacherId: user?.id || '',
        studentIds: []
      };

      // Simuler la création des données (en mode test)
      console.log('🔄 Initialisation des données de test...');
      
      // Ajouter les élèves au groupe
      const updatedGroup = {
        ...testGroup,
        studentIds: ['student-1', 'student-2', 'student-3']
      };

      // Forcer la mise à jour des données
      setTimeout(() => {
        console.log('✅ Données de test initialisées !');
        setIsInitializingData(false);
        alert('Données de test créées ! Vous pouvez maintenant vous connecter en tant qu\'étudiant pour tester le chat.');
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setIsInitializingData(false);
      alert('Erreur lors de l\'initialisation des données de test.');
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const events: CalendarEvent[] = [];
    
    // Add homework due dates
    const homeworkDue = homework.filter(hw => 
      hw.teacherId === user?.id && isSameDay(hw.dueDate, day)
    );
    events.push(...homeworkDue.map(hw => ({ type: 'homework', title: hw.title, color: 'bg-blue-500' })));
    
    // Add assignment due dates
    const assignmentsDue = assignments.filter(assign => 
      assign.teacherId === user?.id && isSameDay(assign.dueDate, day)
    );
    events.push(...assignmentsDue.map(assign => ({ type: 'assignment', title: assign.title, color: 'bg-green-500' })));
    
    return events;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'homework':
        return <HomeworkManager selectedGroupId={selectedGroupId} />;
      case 'messages':
        return <ChatCenter selectedGroupId={selectedGroupId} />;
      case 'announcements':
        return <AnnouncementManager selectedGroupId={selectedGroupId} />;
      case 'profile':
        return <TeacherProfile />;
      case 'groups':
        return <GroupManager selectedGroupId={selectedGroupId} />;
      case 'students':
        return <StudentManager selectedGroupId={selectedGroupId} />;
      case 'assignments':
        return <AssignmentManager selectedGroupId={selectedGroupId} />;
      case 'notes':
        return <CourseNotesManager selectedGroupId={selectedGroupId} />;
      case 'sales':
        return <SalesManager selectedGroupId={selectedGroupId} />;
      case 'finance':
        return <BudgetDashboard selectedGroupId={selectedGroupId} />;
      case 'overview':
        return <BudgetOverview />;
      case 'fournitures':
        return <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Fournitures</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Contenu de la section des fournitures */}
          </div>
        </div>;
      case 'evenements':
        return <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Événements</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Contenu de la section des événements */}
          </div>
        </div>;
      case 'reparations':
        return <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Réparations</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Contenu de la section des réparations */}
          </div>
        </div>;
      case 'specialistes':
        return <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Spécialistes</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Contenu de la section des spécialistes */}
          </div>
        </div>;
      case 'licenses':
        return <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Licences</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Statut des licences */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Statut des Licences</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Licences actives :</span>
                    <span className="font-semibold text-blue-900">25/30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Licences disponibles :</span>
                    <span className="font-semibold text-green-600">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'expiration :</span>
                    <span className="font-semibold text-orange-600">15 décembre 2024</span>
                  </div>
                </div>
              </div>

              {/* Acheter des licences */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Acheter des Licences</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input type="number" min="1" max="100" className="w-20 px-2 py-1 border border-gray-300 rounded" placeholder="1" />
                    <span className="text-gray-600">licences supplémentaires</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Prix : <span className="font-semibold">15$/licence/mois</span>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Acheter via Stripe
                  </button>
                </div>
              </div>
            </div>

            {/* Historique des achats */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Historique des Achats</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <span className="font-medium">+10 licences</span>
                      <span className="text-gray-500 ml-2">15 novembre 2024</span>
                    </div>
                    <span className="text-green-600 font-semibold">150$</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <span className="font-medium">+5 licences</span>
                      <span className="text-gray-500 ml-2">1 octobre 2024</span>
                    </div>
                    <span className="text-green-600 font-semibold">75$</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>;
      case 'gamification':
        return <GamificationManager viewMode={viewMode} setViewMode={setViewMode} />;
      case 'ia-quebec':
        return <IAToolsManager />;
      case 'tools':
        return (
          <div className="space-y-6">
            {/* En-tête avec boutons de basculement */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-center">
                  {/* Boutons de basculement */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setToolView('metronome')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        toolView === 'metronome'
                          ? 'bg-white text-[#1473AA] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Métronome</span>
                    </button>
                    <button
                      onClick={() => setToolView('tuner')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        toolView === 'tuner'
                          ? 'bg-white text-[#1473AA] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Accordeur</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Affichage conditionnel des outils */}
            {toolView === 'metronome' ? <Metronome /> : <Tuner />}
          </div>
        );
      case 'macbook-chat':
        return <MacBookChat />;
      default:
        return null;
    }
  };

  const getGroupStats = (groupId: string) => {
    const students = getStudentsByGroup(groupId);
    const groupHomework = homework.filter(hw => hw.groupId === groupId);
    const activeHomework = groupHomework.filter(hw => hw.dueDate > new Date());
    const groupMessages = messages.filter(msg => msg.groupId === groupId);
    const groupAnnouncements = announcements.filter(ann => ann.groupId === groupId);
    const groupAssignments = assignments.filter(assign => assign.groupIds.includes(groupId));
    
    return {
      studentCount: students.length,
      homeworkCount: activeHomework.length,
      messageCount: groupMessages.length,
      announcementCount: groupAnnouncements.length,
      assignmentCount: groupAssignments.length
    };
  };

  // Calculate finance statistics
  const totalSales = filteredPurchases
    .filter(p => p.status === 'paid')
    .reduce((total, purchase) => total + purchase.amount, 0);

  const totalCredit = filteredPurchases
    .filter(p => p.status === 'credit')
    .reduce((total, purchase) => total + purchase.amount, 0);

  // Simuler des étudiants pour la gamification
  const gamificationStudents = [
    { id: '1', name: 'Marie Dubois', avatar: 'https://ui-avatars.com/api/?name=Marie+Dubois&background=1473AA&color=fff&size=32' },
    { id: '2', name: 'Lucas Martin', avatar: 'https://ui-avatars.com/api/?name=Lucas+Martin&background=10B981&color=fff&size=32' },
    { id: '3', name: 'Sophie Bernard', avatar: 'https://ui-avatars.com/api/?name=Sophie+Bernard&background=8B5CF6&color=fff&size=32' },
    { id: '4', name: 'Thomas Leroy', avatar: 'https://ui-avatars.com/api/?name=Thomas+Leroy&background=F59E0B&color=fff&size=32' },
    { id: '5', name: 'Emma Rousseau', avatar: 'https://ui-avatars.com/api/?name=Emma+Rousseau&background=EF4444&color=fff&size=32' }
  ];

  // Fonctions pour les actions de gamification
  const handleGamificationSendMessage = () => {
    if (selectedGamificationStudent && gamificationMessageText.trim()) {
      console.log(`Message envoyé à ${selectedGamificationStudent}: ${gamificationMessageText}`);
      alert(`Message d'encouragement envoyé à ${gamificationStudents.find(s => s.id === selectedGamificationStudent)?.name}!`);
      setShowGamificationMessageModal(false);
      setGamificationMessageText('');
      setSelectedGamificationStudent('');
    }
  };

  const handleGamificationAwardPoints = () => {
    if (selectedGamificationStudent && gamificationPointsToAward > 0) {
      console.log(`${gamificationPointsToAward} points attribués à ${selectedGamificationStudent}`);
      alert(`${gamificationPointsToAward} points attribués à ${gamificationStudents.find(s => s.id === selectedGamificationStudent)?.name}!`);
      setShowGamificationPointsModal(false);
      setGamificationPointsToAward(10);
      setSelectedGamificationStudent('');
    }
  };

  const handleGamificationCreateChallenge = () => {
    if (gamificationChallengeTitle.trim() && gamificationChallengeDescription.trim()) {
      console.log(`Challenge créé: ${gamificationChallengeTitle}`);
      alert(`Challenge "${gamificationChallengeTitle}" créé avec succès!`);
      setShowGamificationChallengeModal(false);
      setGamificationChallengeTitle('');
      setGamificationChallengeDescription('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Fonction pour naviguer vers l'onglet Élèves
  const handleNavigateToStudents = (groupId?: string) => {
    setActiveTab('students');
    if (groupId) {
      setSelectedGroupId(groupId);
    }
  };

  // Vérifier si l'utilisateur a les permissions d'accès
  if (!user || user.role !== 'teacher') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <User className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Accès refusé</h3>
            <p className="text-sm text-gray-500 mb-4">
              Vous devez être connecté en tant que professeur pour accéder à cette page.
            </p>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* En-tête */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-right gap-4">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt="Photo de profil"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-sm text-gray-600">Professeur de Musique</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-grey  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Menu de budget horizontal */}
        {(activeTab === 'finance' || activeTab === 'overview' || activeTab === 'fournitures' || activeTab === 'evenements' || activeTab === 'reparations' || activeTab === 'specialistes') && (
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8 py-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-[#1473AA] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <BarChart className="w-4 h-4" />
                  <span>Vue d'ensemble</span>
                </button>
                <button
                  onClick={() => setActiveTab('fournitures')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'fournitures'
                      ? 'bg-[#1473AA] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Fournitures</span>
                </button>
                <button
                  onClick={() => setActiveTab('evenements')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'evenements'
                      ? 'bg-[#1473AA] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Événements</span>
                </button>
                <button
                  onClick={() => setActiveTab('reparations')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'reparations'
                      ? 'bg-[#1473AA] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Réparations</span>
                </button>
                <button
                  onClick={() => setActiveTab('specialistes')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'specialistes'
                      ? 'bg-[#1473AA] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Spécialistes</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex h-screen">
          {/* Menu latéral gauche - Catégories */}
          <div className="w-80 bg-white shadow-xl border-r border-gray-200 p-4 overflow-y-auto">
            {/* First bloc */}
            {/* Sélecteur de groupe */}
            <div className="mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un groupe
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1473AA] focus:border-[#1473AA] bg-white"
              >
                <option value="">Tous les groupes</option>
                {teacherGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* second bloc */}
            <div className="space-y-2 mb-4 border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Catégories</h2>
              <button
                onClick={() => {
                  setActiveTab('homework');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'homework'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Music className={`w-4 h-4 ${activeTab === 'homework' ? 'text-white' : 'text-blue-500'}`} />
                  <span className="font-medium text-sm">Pratique</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === 'homework' ? 'bg-white text-[#1473AA]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {filteredHomework.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('assignments');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'assignments'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-4 h-4 ${activeTab === 'assignments' ? 'text-white' : 'text-green-500'}`} />
                  <span className="font-medium text-sm">Devoir</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === 'assignments' ? 'bg-white text-[#1473AA]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {filteredAssignments.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('notes');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'notes'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${activeTab === 'notes' ? 'text-white' : 'text-purple-500'}`} />
                  <span className="font-medium text-sm">Notes de cours</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === 'notes' ? 'bg-white text-[#1473AA]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {filteredCourseNotes.length}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('sales');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'sales'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className={`w-4 h-4 ${activeTab === 'sales' ? 'text-white' : 'text-orange-500'}`} />
                  <span className="font-medium text-sm">Ventes totales</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('announcements');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'announcements'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Megaphone className={`w-4 h-4 ${activeTab === 'announcements' ? 'text-white' : 'text-red-500'}`} />
                  <span className="font-medium text-sm">Annonces</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('messages');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'messages'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className={`w-4 h-4 ${activeTab === 'messages' ? 'text-white' : 'text-teal-500'}`} />
                  <span className="font-medium text-sm">Musichat</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === 'messages' ? 'bg-white text-[#1473AA]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {filteredMessages.filter(m => !m.readBy.includes(user?.id || '')).length}
                </span>
              </button>
            </div>

            {/* third bloc */}
            <div className="space-y-2 border border-gray-200 rounded-lg p-3">
              <button
                onClick={() => {
                  setActiveTab('ia');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'ia'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className={`w-4 h-4 ${activeTab === 'ia' ? 'text-white' : 'text-yellow-500'}`} />
                  <span className="font-medium text-xs">Intelligence Artificielle</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('gamification');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'gamification'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className={`w-4 h-4 ${activeTab === 'gamification' ? 'text-white' : 'text-rose-500'}`} />
                  <span className="font-medium text-sm">Gamification</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('tools');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'tools'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart className={`w-4 h-4 ${activeTab === 'tools' ? 'text-white' : 'text-cyan-500'}`} />
                  <span className="font-medium text-sm">Outils</span>
                </div>
              </button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Conteneur centré avec largeur maximale */}
            <div className="max-w-6xl mx-auto h-full">
              {/* Affichage conditionnel du contenu */}
              {(activeTab === 'finance' || activeTab === 'overview' || activeTab === 'fournitures' || activeTab === 'evenements' || activeTab === 'reparations' || activeTab === 'specialistes') ? (
                // Contenu des onglets de budget
                <div className="h-full">
                  {renderTabContent()}
                </div>
              ) : (
                // Contenu principal avec logo en haut à gauche
                <div className="relative h-full">
                  {/* Logo en haut à gauche */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-[500px] h-[500px]">
                      <Logo variant="hero" size="xl" className="w-full h-full" />
                    </div>
                  </div>
                  
                  {/* Message d'accueil centré */}
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Bienvenue sur MusiqueConnect
                      </h1>
                      <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        Utilisez les menus latéraux pour naviguer entre les différentes fonctionnalités.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Menu latéral droit - Gestion */}
          <div className="w-80 bg-white shadow-lg border-l border-gray-200 border border-gray-200 rounded-lg p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Gestion</h2>
            
            {/* fifth bloc */}
            {/* Boutons de gestion */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('groups');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'groups'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className={`w-4 h-4 ${activeTab === 'groups' ? 'text-white' : 'text-indigo-500'}`} />
                  <span className="font-medium text-sm">Groupe</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('students');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'students'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserPlus className={`w-4 h-4 ${activeTab === 'students' ? 'text-white' : 'text-pink-500'}`} />
                  <span className="font-medium text-sm">Élèves</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('finance');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'finance'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className={`w-4 h-4 ${activeTab === 'finance' ? 'text-white' : 'text-emerald-500'}`} />
                  <span className="font-medium text-sm">Budget</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('sales');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'sales'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className={`w-4 h-4 ${activeTab === 'sales' ? 'text-white' : 'text-orange-500'}`} />
                  <span className="font-medium text-sm">Ventes totales</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('inventory');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'inventory'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-white' : 'text-amber-500'}`} />
                  <span className="font-medium text-sm">Inventaire</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('profile');
                  setShowContentModal(true);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-[#1473AA] text-white border border-[#1473AA] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium text-sm">Profil</span>
                </div>
              </button>
            </div>

            {/* Mini calendrier */}
            <div className="bg-gray-50 rounded-lg p-3 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Calendrier</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ChevronLeft className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Mois et année */}
              <div className="text-center mb-2">
                <p className="text-sm font-medium text-gray-900">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </p>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => (
                  <div key={day} className="text-xs text-gray-500 text-center font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille des dates */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                  const day = i + 1;
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  
                  return (
                    <div
                      key={day}
                      className={`text-xs text-center p-1 rounded ${
                        isToday
                          ? 'bg-[#1473AA] text-white font-medium'
                          : isCurrentMonth
                          ? 'text-gray-900 hover:bg-gray-200'
                          : 'text-gray-400'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour le contenu des onglets */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* En-tête de la modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'homework' && 'Pratiques'}
                  {activeTab === 'messages' && 'Messages'}
                  {activeTab === 'announcements' && 'Annonces'}
                  {activeTab === 'groups' && 'Groupes'}
                  {activeTab === 'students' && 'Élèves'}
                  {activeTab === 'assignments' && 'Devoirs'}
                  {activeTab === 'notes' && 'Notes de cours'}
                  {activeTab === 'finance' && 'Finances'}
                  {activeTab === 'inventory' && 'Inventaire'}
                  {activeTab === 'profile' && 'Profil'}
                  {activeTab === 'ia' && 'Intelligence Artificielle'}
                  {activeTab === 'gamification' && 'Gamification'}
                  {activeTab === 'tools' && 'Outils'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'homework' && 'Gérez les pratiques de vos élèves'}
                  {activeTab === 'messages' && 'Communiquez avec vos élèves et leurs parents'}
                  {activeTab === 'announcements' && 'Publiez des annonces importantes'}
                  {activeTab === 'groups' && 'Gérez vos groupes d\'élèves'}
                  {activeTab === 'students' && 'Consultez et gérez vos élèves'}
                  {activeTab === 'assignments' && 'Créez et suivez les devoirs'}
                  {activeTab === 'notes' && 'Organisez vos notes de cours'}
                  {activeTab === 'finance' && 'Suivez vos finances et paiements'}
                  {activeTab === 'inventory' && 'Gérez votre inventaire de matériel'}
                  {activeTab === 'profile' && 'Gérez vos informations personnelles'}
                  {activeTab === 'ia' && 'Outils d\'intelligence artificielle'}
                  {activeTab === 'gamification' && 'Système de gamification'}
                  {activeTab === 'tools' && 'Outils pédagogiques'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('sales');
                    setShowContentModal(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ventes totales
                </button>
                <button
                  onClick={() => setShowContentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Contenu de la modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {renderTabContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}