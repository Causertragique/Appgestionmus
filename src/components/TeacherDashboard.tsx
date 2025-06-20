import React, { useState } from 'react';
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
  BarChart,
  TrendingUp,
  LineChart,
  Bell,
  Target,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import GroupManager from './GroupManager';
import HomeworkManager from './HomeworkManager';
import ChatCenter from './ChatCenter';
import AnnouncementManager from './AnnouncementManager';
import TeacherProfile from './TeacherProfile';
import StudentManager from './StudentManager';
import AssignmentManager from './AssignmentManager';
import CourseNotesManager from './CourseNotesManager';
import FinanceManager from './FinanceManager';

type TabType = 'homework' | 'messages' | 'announcements' | 'profile' | 'groups' | 'students' | 'assignments' | 'notes' | 'finance';

type Event = {
  type: 'homework' | 'assignment';
  title: string;
  color: string;
};

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('homework');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user, logout } = useAuth();
  const { groups, homework, messages, announcements, assignments, courseNotes, purchases, getStudentsByGroup, getActiveGroups } = useData();

  // Utiliser la fonction getActiveGroups pour filtrer les groupes
  const teacherGroups = getActiveGroups(user?.id || '');
  const selectedGroup = selectedGroupId ? groups?.find(g => g?.id === selectedGroupId) : null;
  
  // Filter data based on selected group
  const filteredHomework = selectedGroupId 
    ? homework?.filter(hw => hw?.groupId === selectedGroupId) || []
    : homework?.filter(hw => hw?.teacherId === user?.id) || [];
  
  const filteredMessages = selectedGroupId
    ? messages?.filter(msg => msg?.groupId === selectedGroupId) || []
    : messages?.filter(msg => msg?.senderId === user?.id) || [];
    
  const filteredAnnouncements = selectedGroupId
    ? announcements?.filter(ann => ann?.groupId === selectedGroupId) || []
    : announcements?.filter(ann => ann?.teacherId === user?.id) || [];

  const filteredAssignments = selectedGroupId
    ? assignments?.filter(assign => assign?.groupIds?.includes(selectedGroupId)) || []
    : assignments?.filter(assign => assign?.teacherId === user?.id) || [];

  const filteredCourseNotes = selectedGroupId
    ? courseNotes?.filter(note => !note?.groupId || note?.groupId === selectedGroupId) || []
    : courseNotes?.filter(note => note?.teacherId === user?.id) || [];

  const filteredPurchases = selectedGroupId
    ? purchases?.filter(purchase => purchase?.groupId === selectedGroupId) || []
    : purchases?.filter(purchase => purchase?.teacherId === user?.id) || [];

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

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const events: Event[] = [];
    // Add homework due dates
    const homeworkDue = homework?.filter(hw => 
      hw?.teacherId === user?.id && hw?.dueDate && isSameDay(new Date(hw.dueDate), day)
    ) || [];
    events.push(...homeworkDue.map(hw => ({ 
      type: 'homework' as const, 
      title: hw.title || 'Devoir sans titre', 
      color: 'bg-blue-500' 
    })));
    
    // Add assignment due dates
    const assignmentsDue = assignments?.filter(assign => 
      assign?.teacherId === user?.id && assign?.dueDate && isSameDay(new Date(assign.dueDate), day)
    ) || [];
    events.push(...assignmentsDue.map(assign => ({ 
      type: 'assignment' as const, 
      title: assign.title || 'Devoir sans titre', 
      color: 'bg-green-500' 
    })));
    
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
      case 'finance':
        return <FinanceManager selectedGroupId={selectedGroupId} />;
      default:
        return null;
    }
  };

  const getGroupStats = (groupId: string) => {
    const students = getStudentsByGroup(groupId) || [];
    const groupHomework = homework?.filter(hw => hw?.groupId === groupId) || [];
    const activeHomework = groupHomework.filter(hw => hw?.dueDate && new Date(hw.dueDate) > new Date());
    const groupMessages = messages?.filter(msg => msg?.groupId === groupId) || [];
    const groupAnnouncements = announcements?.filter(ann => ann?.groupId === groupId) || [];
    const groupAssignments = assignments?.filter(assign => assign?.groupIds?.includes(groupId)) || [];
    
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
    ?.filter(p => p?.status === 'paid')
    ?.reduce((total, purchase) => total + (purchase?.amount || 0), 0) || 0;

  const totalCredit = filteredPurchases
    ?.filter(p => p?.status === 'credit')
    ?.reduce((total, purchase) => total + (purchase?.amount || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Statistiques des devoirs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Devoirs actifs</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredHomework.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Music className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Prochain devoir : {filteredHomework[0]?.dueDate ? format(new Date(filteredHomework[0].dueDate), 'dd MMM', { locale: fr }) : 'Aucun'}</span>
              </div>
            </div>
          </div>

          {/* Statistiques des messages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages non lus</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredMessages.filter(m => !m.readBy.includes(user?.id || '')).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <MessageSquare className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Dernier message : {filteredMessages[0]?.createdAt ? format(new Date(filteredMessages[0].createdAt), 'dd MMM', { locale: fr }) : 'Aucun'}</span>
              </div>
            </div>
          </div>

          {/* Statistiques des annonces */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annonces actives</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredAnnouncements.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Megaphone className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Dernière annonce : {filteredAnnouncements[0]?.createdAt ? format(new Date(filteredAnnouncements[0].createdAt), 'dd MMM', { locale: fr }) : 'Aucune'}</span>
              </div>
            </div>
          </div>

          {/* Statistiques financières */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus du mois</p>
                <p className="text-2xl font-semibold text-gray-900">{totalSales}€</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Crédits en attente : {totalCredit}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Calendrier
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* En-têtes des jours */}
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}

          {/* Jours du mois */}
          {monthDays.map((day, dayIdx) => {
            const events = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`min-h-[100px] bg-white p-2 ${
                  !isCurrentMonth ? 'text-gray-400' : ''
                }`}
              >
                <div className={`text-sm font-medium ${
                  isCurrentDay ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                }`}>
                  {format(day, 'd')}
                </div>
                
                {/* Événements du jour */}
                <div className="mt-1 space-y-1">
                  {events.map((event, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-1 rounded truncate ${event.color} text-white`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rappels et Échéances */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Rappels et Échéances
        </h3>
        
        <div className="space-y-3">
          {filteredHomework
            .filter(hw => new Date(hw.dueDate) > new Date())
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5)
            .map(hw => (
              <div key={hw.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Music className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{hw.title}</p>
                    <p className="text-sm text-gray-500">Groupe {groups?.find(g => g.id === hw.groupId)?.name}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {format(new Date(hw.dueDate), 'dd MMM', { locale: fr })}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Notes et Commentaires */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Notes et Commentaires
        </h3>
        
        <div className="space-y-4">
          {teacherGroups.map(group => (
            <div key={group.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Groupe {group.name}</h4>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Ajouter une note
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Commentaire du cours</h4>
                      <span className="text-sm text-gray-500">
                        {format(new Date().setDate(new Date().getDate() - 1), 'dd MMM', { locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Bonne progression sur les gammes. Continuez à travailler la technique de respiration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ressources d'Apprentissage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Ressources
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Partitions', count: 12, icon: '🎼' },
            { title: 'Exercices', count: 8, icon: '📝' },
            { title: 'Vidéos', count: 5, icon: '🎥' },
            { title: 'Documents', count: 15, icon: '📄' }
          ].map((resource, index) => (
            <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{resource.icon}</div>
                <h4 className="font-medium text-gray-900">{resource.title}</h4>
              </div>
              <div className="text-sm text-gray-600">
                {resource.count} fichiers disponibles
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rappels Automatiques */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Rappels Automatiques
        </h3>
        
        <div className="space-y-3">
          {[
            { title: 'Paiement en retard', count: 3, color: 'red' },
            { title: 'Devoirs non rendus', count: 5, color: 'yellow' },
            { title: 'Absences à notifier', count: 2, color: 'blue' }
          ].map((reminder, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-${reminder.color}-100`}>
                  <Bell className={`w-4 h-4 text-${reminder.color}-600`} />
                </div>
                <span className="font-medium text-gray-900">{reminder.title}</span>
              </div>
              <span className={`px-2 py-1 text-sm font-medium rounded-full bg-${reminder.color}-100 text-${reminder.color}-700`}>
                {reminder.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions d'Amélioration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-500" />
          Suggestions d'Amélioration
        </h3>
        
        <div className="space-y-4">
          {[
            { title: 'Augmenter la pratique', group: 'Groupe A', priority: 'Haute' },
            { title: 'Renforcer la théorie', group: 'Groupe B', priority: 'Moyenne' },
            { title: 'Diversifier les exercices', group: 'Groupe C', priority: 'Basse' }
          ].map((suggestion, index) => (
            <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  suggestion.priority === 'Haute' ? 'bg-red-100 text-red-700' :
                  suggestion.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {suggestion.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600">Pour {suggestion.group}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons de catégories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
        
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setActiveTab('homework')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeTab === 'homework'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Music className={`w-5 h-5 ${activeTab === 'homework' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">Pratique</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === 'homework' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {filteredHomework.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeTab === 'messages'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className={`w-5 h-5 ${activeTab === 'messages' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">Chat</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === 'messages' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {filteredMessages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeTab === 'announcements'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Megaphone className={`w-5 h-5 ${activeTab === 'announcements' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">Annonces</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === 'announcements' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {filteredAnnouncements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeTab === 'groups'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-5 h-5 ${activeTab === 'groups' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">Groupes</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === 'groups' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {teacherGroups.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeTab === 'students'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserPlus className={`w-5 h-5 ${activeTab === 'students' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">Élèves</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeTab === 'assignments'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className={`w-5 h-5 ${activeTab === 'assignments' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">Devoirs</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === 'assignments' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {filteredAssignments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeTab === 'notes'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className={`w-5 h-5 ${activeTab === 'notes' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">Notes de cours</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === 'notes' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {filteredCourseNotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeTab === 'finance'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign className={`w-5 h-5 ${activeTab === 'finance' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">Finances</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === 'finance' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {totalSales}€
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className={`w-5 h-5 ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium">Profil</span>
            </div>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1">
        {/* En-tête dynamique du contenu */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
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
                {activeTab === 'profile' && 'Profil'}
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
                {activeTab === 'profile' && 'Gérez vos informations personnelles'}
              </p>
            </div>
            
            {/* Actions rapides selon l'onglet */}
            <div className="flex items-center gap-3">
              {activeTab !== 'profile' && (
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {activeTab === 'homework' && 'Nouvelle pratique'}
                  {activeTab === 'messages' && 'Nouveau message'}
                  {activeTab === 'announcements' && 'Nouvelle annonce'}
                  {activeTab === 'groups' && 'Nouveau groupe'}
                  {activeTab === 'students' && 'Nouvel élève'}
                  {activeTab === 'assignments' && 'Nouveau devoir'}
                  {activeTab === 'notes' && 'Nouvelle note'}
                  {activeTab === 'finance' && 'Nouvelle transaction'}
                </button>
              )}
            </div>
          </div>
          
          {/* Filtres rapides */}
          {selectedGroup && activeTab !== 'profile' && (
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtre actif : Groupe {selectedGroup.name}
              </span>
              <button
                onClick={() => setSelectedGroupId('')}
                className="text-blue-600 hover:text-blue-700"
              >
                Effacer le filtre
              </button>
            </div>
          )}
        </div>

        {/* Contenu de l'onglet */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}