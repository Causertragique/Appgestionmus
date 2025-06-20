import React, { useState } from 'react';
import { User, Camera, Save, X, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AppSettings from './AppSettings';

export default function TeacherProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'settings'>('profile');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    picture: user?.picture || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      picture: user?.picture || ''
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, picture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mon Profil Professeur</h2>
        {!isEditing && activeSection === 'profile' && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Modifier le Profil
          </button>
        )}
      </div>

      {/* Navigation entre sections */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveSection('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations Personnelles
            </div>
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Paramètres de l'Application
            </div>
          </button>
        </nav>
      </div>

      {/* Contenu des sections */}
      {activeSection === 'profile' && (
        <div className="card">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo de profil */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {formData.picture ? (
                      <img
                        src={formData.picture}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-600">Cliquez sur l'icône pour changer votre photo</p>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="input"
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
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="input"
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
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Photo de profil */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt="Photo de profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Prénom</h3>
                  <p className="text-lg text-gray-900">{user.firstName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Nom de famille</h3>
                  <p className="text-lg text-gray-900">{user.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Adresse e-mail</h3>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Rôle</h3>
                  <p className="text-lg text-gray-900">Professeur de Musique</p>
                </div>
              </div>

              {/* Statistiques professeur */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques d'Enseignement</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-blue-600">Groupes Actifs</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-green-600">Élèves Total</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-purple-600">Pratiques Assignées</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <div className="text-sm text-orange-600">Messages Envoyés</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'settings' && (
        <div className="card">
          <AppSettings userRole="teacher" />
        </div>
      )}
    </div>
  );
}