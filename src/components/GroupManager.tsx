import React, { useState } from 'react';
import { Plus, Users, Edit, Trash2, Save, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

interface GroupManagerProps {
  selectedGroupId?: string;
}

export default function GroupManager({ selectedGroupId }: GroupManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { user } = useAuth();
  const { groups, addGroup, updateGroup, deleteGroup, getStudentsByGroup, getActiveGroups } = useData();

  // Utiliser la fonction getActiveGroups pour filtrer les groupes
  const teacherGroups = getActiveGroups(user?.id || '');
  
  // Filter groups based on selection
  const displayGroups = selectedGroupId 
    ? teacherGroups.filter(group => group.id === selectedGroupId)
    : teacherGroups;

  const handleCreateGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Générer un code d'invitation unique
    const invitationCode = generateInvitationCode();
    
    const newGroup = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      teacherId: user?.id || '',
      studentIds: [],
      invitationCode: invitationCode,
      qrCodeUrl: `https://musiqueconnect.ca/join/${invitationCode}`
    };
    
    addGroup(newGroup);

    setShowCreateForm(false);
    e.currentTarget.reset();
    
    // Afficher le code d'invitation
    alert(`Groupe créé avec succès !\n\nCode d'invitation: ${invitationCode}\n\nPartagez ce code avec vos élèves pour qu'ils rejoignent le groupe.`);
  };

  // Fonction pour générer un code d'invitation unique
  const generateInvitationCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group.id);
    setEditFormData({
      name: group.name,
      description: group.description
    });
  };

  const handleSaveEdit = () => {
    if (editingGroup && editFormData.name.trim()) {
      updateGroup(editingGroup, editFormData);
      setEditingGroup(null);
      setEditFormData({ name: '', description: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditFormData({ name: '', description: '' });
  };

  const handleDeleteGroup = (groupId: string) => {
    deleteGroup(groupId);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedGroupId ? `Groupe Sélectionné` : 'Gérer les Groupes de Musique'}
        </h2>
        {!selectedGroupId && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer un Groupe
          </button>
        )}
      </div>

      {/* Formulaire de création de groupe - seulement si aucun groupe sélectionné */}
      {showCreateForm && !selectedGroupId && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Créer un Nouveau Groupe de Musique</h3>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Groupe
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input"
                placeholder="ex: 118, 119, 218, 219"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="textarea"
                rows={3}
                placeholder="Description du groupe de musique..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                Créer le Groupe
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

      {/* Liste des groupes */}
      {displayGroups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {selectedGroupId ? 'Groupe non trouvé' : 'Aucun groupe de musique créé pour le moment'}
          </p>
          {!selectedGroupId && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Créer Votre Premier Groupe
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {displayGroups.map((group) => {
            const students = getStudentsByGroup(group.id);
            const isEditing = editingGroup === group.id;
            const isConfirmingDelete = deleteConfirm === group.id;
            
            return (
              <div key={group.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du Groupe
                          </label>
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="input"
                            placeholder="Nom du groupe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editFormData.description}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="textarea"
                            rows={2}
                            placeholder="Description du groupe"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="btn-primary flex items-center gap-1 text-sm"
                          >
                            <Save className="w-3 h-3" />
                            Sauvegarder
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="btn-outline flex items-center gap-1 text-sm"
                          >
                            <X className="w-3 h-3" />
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                        <p className="text-gray-600 mb-3">{group.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {students.length} élèves
                          </div>
                          <div>
                            Créé le {format(group.createdAt, 'dd MMM yyyy')}
                          </div>
                        </div>
                        
                        {/* Code d'invitation */}
                        {group.invitationCode && (
                          <div className="mt-4 p-4 bg-[#1473AA]/10 rounded-lg border border-[#1473AA]/20">
                            <h4 className="font-medium text-[#1473AA] mb-2">Code d'Invitation</h4>
                            <div className="flex items-center gap-3">
                              <div className="bg-white px-3 py-2 rounded border text-lg font-mono font-bold text-[#1473AA]">
                                {group.invitationCode}
                              </div>
                              <button
                                onClick={() => group.invitationCode && navigator.clipboard.writeText(group.invitationCode)}
                                className="px-3 py-2 bg-[#1473AA] text-white rounded hover:bg-[#1473AA]/80 text-sm"
                              >
                                Copier
                              </button>
                            </div>
                            <p className="text-xs text-[#1473AA]/80 mt-2">
                              Partagez ce code avec vos élèves pour qu'ils rejoignent le groupe
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {!isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        title="Modifier le groupe"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(group.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Supprimer le groupe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Confirmation de suppression */}
                {isConfirmingDelete && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">Confirmer la suppression</span>
                    </div>
                    <p className="text-red-700 text-sm mb-3">
                      Êtes-vous sûr de vouloir supprimer le groupe "{group.name}" ? 
                      Cette action est irréversible et supprimera également tous les exercices et messages associés.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Oui, supprimer
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Section Élèves - seulement si pas en mode édition */}
                {!isEditing && !isConfirmingDelete && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Élèves du Groupe</h4>
                      <span className="text-sm text-gray-600">
                        {students.length} élève{students.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {students.length === 0 ? (
                      <p className="text-gray-500 text-sm">Aucun élève inscrit pour le moment</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                              {student.picture ? (
                                <img
                                  src={student.picture}
                                  alt={`${student.firstName} ${student.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-500 font-medium text-sm">
                                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {student.instrument || 'Instrument non spécifié'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Statistiques des groupes */}
      {!selectedGroupId && teacherGroups.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques des Groupes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{teacherGroups.length}</div>
              <div className="text-sm text-gray-600">Groupes Créés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {teacherGroups.reduce((acc, group) => acc + getStudentsByGroup(group.id).length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Élèves</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {teacherGroups.filter(group => getStudentsByGroup(group.id).length > 0).length}
              </div>
              <div className="text-sm text-gray-600">Groupes Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(teacherGroups.reduce((acc, group) => acc + getStudentsByGroup(group.id).length, 0) / teacherGroups.length) || 0}
              </div>
              <div className="text-sm text-gray-600">Moy. Élèves/Groupe</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}