import React, { useState } from 'react';
import { Plus, Users, Edit, Trash2, UserPlus, User, Search, Mail, Music2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

interface StudentManagerProps {
  selectedGroupId?: string;
}

export default function StudentManager({ selectedGroupId }: StudentManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const { user } = useAuth();
  const { groups, users, getStudentsByGroup, getActiveGroups } = useData();

  // Utiliser la fonction getActiveGroups pour filtrer les groupes
  const teacherGroups = getActiveGroups(user?.id || '');
  const allStudents = users.filter(u => u.role === 'student');
  
  // Filter students based on selected group or show all
  const displayStudents = selectedGroupId 
    ? getStudentsByGroup(selectedGroupId)
    : allStudents.filter(student => 
        teacherGroups.some(group => group.studentIds.includes(student.id))
      );

  // Filter by search term
  const filteredStudents = displayStudents.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.instrument && student.instrument.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // In a real app, this would create a new student
    console.log('Creating student:', {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      instrument: formData.get('instrument'),
      groupId: selectedGroupId || formData.get('groupId')
    });

    setShowCreateForm(false);
    e.currentTarget.reset();
  };

  const getStudentGroups = (studentId: string) => {
    return teacherGroups.filter(group => group.studentIds.includes(studentId));
  };

  const getStudentStats = (studentId: string) => {
    // In a real app, this would calculate actual stats
    return {
      homeworkCompleted: Math.floor(Math.random() * 10),
      homeworkTotal: Math.floor(Math.random() * 15) + 5,
      averageGrade: Math.floor(Math.random() * 30) + 70
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedGroupId 
            ? `Élèves - Groupe ${groups.find(g => g.id === selectedGroupId)?.name}` 
            : 'Gérer les Élèves'
          }
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Élève
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, email ou instrument..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Formulaire de création d'élève */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un Nouvel Élève</h3>
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="input"
                  placeholder="Prénom de l'élève"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de famille
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="input"
                  placeholder="Nom de famille de l'élève"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                placeholder="email@exemple.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-2">
                  Instrument Principal
                </label>
                <select
                  id="instrument"
                  name="instrument"
                  className="input"
                  required
                >
                  <option value="">Sélectionner un instrument</option>
                  <option value="Piano">Piano</option>
                  <option value="Guitare">Guitare</option>
                  <option value="Violon">Violon</option>
                  <option value="Violoncelle">Violoncelle</option>
                  <option value="Flûte">Flûte</option>
                  <option value="Clarinette">Clarinette</option>
                  <option value="Saxophone">Saxophone</option>
                  <option value="Saxophone Alto">Saxophone Alto</option>
                  <option value="Saxophone Tenor">Saxophone Tenor</option>
                  <option value="Trompette">Trompette</option>
                  <option value="Trombone">Trombone</option>
                  <option value="Euphonium">Euphonium</option>
                  <option value="Tuba">Tuba</option>
                  <option value="Batterie">Batterie</option>
                  <option value="Chant">Chant</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              {!selectedGroupId && (
                <div>
                  <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-2">
                    Assigner au Groupe
                  </label>
                  <select
                    id="groupId"
                    name="groupId"
                    className="input"
                  >
                    <option value="">
                      {teacherGroups.length === 0 
                        ? 'Aucun groupe disponible - Créez d\'abord un groupe' 
                        : 'Sélectionner un groupe (optionnel)'
                      }
                    </option>
                    {teacherGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        Groupe {group.name} ({group.studentIds.length} élève{group.studentIds.length > 1 ? 's' : ''})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                Ajouter l'Élève
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-outline"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des élèves */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Aucun élève trouvé avec ces critères de recherche'
              : selectedGroupId 
                ? 'Aucun élève dans ce groupe pour le moment'
                : 'Aucun élève inscrit pour le moment'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Ajouter Votre Premier Élève
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredStudents.map((student) => {
            const studentGroups = getStudentGroups(student.id);
            const stats = getStudentStats(student.id);
            
            return (
              <div key={student.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {student.picture ? (
                        <img
                          src={student.picture}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {student.firstName} {student.lastName}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Music2 className="w-4 h-4" />
                          {student.instrument || 'Instrument non spécifié'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {studentGroups.length > 0 
                            ? studentGroups.map(g => `Groupe ${g.name}`).join(', ')
                            : 'Aucun groupe'
                          }
                        </div>
                      </div>

                      {/* Statistiques de l'élève */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {stats.homeworkCompleted}/{stats.homeworkTotal}
                          </div>
                          <div className="text-xs text-blue-600">Pratiques</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {Math.round((stats.homeworkCompleted / stats.homeworkTotal) * 100)}%
                          </div>
                          <div className="text-xs text-green-600">Taux de Réussite</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {stats.averageGrade}
                          </div>
                          <div className="text-xs text-purple-600">Note Moyenne</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingStudent(student.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="Modifier l'élève"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Retirer l'élève"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-outline text-sm">
                      Voir les Pratiques
                    </button>
                    <button className="btn-outline text-sm">
                      Envoyer un Message
                    </button>
                    <button className="btn-outline text-sm">
                      Changer de Groupe
                    </button>
                    <button className="btn-outline text-sm">
                      Voir le Profil Complet
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Résumé des élèves */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des Élèves</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{filteredStudents.length}</div>
            <div className="text-sm text-gray-600">
              {selectedGroupId ? 'Élèves dans ce groupe' : 'Total Élèves'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredStudents.filter(s => s.instrument === 'Piano').length}
            </div>
            <div className="text-sm text-gray-600">Pianistes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredStudents.filter(s => s.instrument === 'Guitare').length}
            </div>
            <div className="text-sm text-gray-600">Guitaristes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredStudents.filter(s => s.instrument === 'Violon').length}
            </div>
            <div className="text-sm text-gray-600">Violonistes</div>
          </div>
        </div>
      </div>
    </div>
  );
}