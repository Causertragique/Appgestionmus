import React, { useState } from 'react';
import { LogIn, Music, UserPlus, User, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import MicrosoftLoginButton from './MicrosoftLoginButton';

type ViewMode = 'login' | 'role-selection' | 'create-account' | 'oauth-role-selection';
type UserRole = 'teacher' | 'student';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [oauthProvider, setOauthProvider] = useState<'google' | 'microsoft' | null>(null);
  
  // Données du formulaire de création de compte
  const [createAccountData, setCreateAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    instrument: '' // Pour les élèves seulement
  });

  const { login, createAccount, loginWithGoogle, loginWithMicrosoft } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email ou mot de passe invalide');
      }
    } catch (err) {
      setError('Échec de la connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation des mots de passe
    if (createAccountData.password !== createAccountData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (createAccountData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const success = await createAccount({
        firstName: createAccountData.firstName,
        lastName: createAccountData.lastName,
        email: createAccountData.email,
        password: createAccountData.password,
        role: selectedRole,
        instrument: selectedRole === 'student' ? createAccountData.instrument : undefined
      });

      if (!success) {
        setError('Échec de la création du compte. Cet email est peut-être déjà utilisé.');
      }
    } catch (err) {
      setError('Erreur lors de la création du compte. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const success = await loginWithGoogle();
      if (!success) {
        setError('Échec de la connexion avec Google');
      }
    } catch (err) {
      setError('Erreur lors de la connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const success = await loginWithMicrosoft();
      if (!success) {
        setError('Échec de la connexion avec Microsoft');
      }
    } catch (err) {
      setError('Erreur lors de la connexion avec Microsoft');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthAccountCreation = async (provider: 'google' | 'microsoft') => {
    setOauthProvider(provider);
    setViewMode('oauth-role-selection');
  };

  const handleOAuthRoleSelection = async (role: UserRole) => {
    if (!oauthProvider) return;
    
    setError('');
    setLoading(true);
    
    try {
      let success = false;
      if (oauthProvider === 'google') {
        success = await loginWithGoogle();
      } else if (oauthProvider === 'microsoft') {
        success = await loginWithMicrosoft();
      }
      
      if (!success) {
        setError(`Échec de la création du compte avec ${oauthProvider === 'google' ? 'Google' : 'Microsoft'}`);
      }
    } catch (err) {
      setError(`Erreur lors de la création du compte avec ${oauthProvider === 'google' ? 'Google' : 'Microsoft'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCreateAccountData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      instrument: ''
    });
    setError('');
    setOauthProvider(null);
  };

  const goBackToLogin = () => {
    setViewMode('login');
    resetForm();
  };

  const startAccountCreation = () => {
    setViewMode('role-selection');
    resetForm();
  };

  const selectRoleAndContinue = (role: UserRole) => {
    setSelectedRole(role);
    setViewMode('create-account');
  };

  // Vue de sélection du rôle pour OAuth
  if (viewMode === 'oauth-role-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Créer un Compte avec {oauthProvider === 'google' ? 'Google' : 'Microsoft'}
            </h1>
            <p className="text-gray-600">Choisissez votre rôle dans MusiqueConnect</p>
          </div>

          <div className="space-y-4">
            {/* Option Enseignant */}
            <button
              onClick={() => handleOAuthRoleSelection('teacher')}
              disabled={loading}
              className="w-full p-6 bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <GraduationCap className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Enseignant de Musique</h3>
                  <p className="text-gray-600 text-sm">
                    Gérez vos groupes, assignez des devoirs et suivez les progrès de vos élèves
                  </p>
                </div>
              </div>
            </button>

            {/* Option Élève */}
            <button
              onClick={() => handleOAuthRoleSelection('student')}
              disabled={loading}
              className="w-full p-6 bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-secondary-300 hover:bg-secondary-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                  <User className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Élève</h3>
                  <p className="text-gray-600 text-sm">
                    Accédez à vos devoirs, soumettez vos pratiques et communiquez avec votre professeur
                  </p>
                </div>
              </div>
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">Création du compte en cours...</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={goBackToLogin}
              disabled={loading}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50"
            >
              ← Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue de sélection du rôle
  if (viewMode === 'role-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un Compte</h1>
            <p className="text-gray-600">Choisissez votre rôle dans MusiqueConnect</p>
          </div>

          <div className="space-y-4">
            {/* Option Enseignant */}
            <button
              onClick={() => selectRoleAndContinue('teacher')}
              className="w-full p-6 bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <GraduationCap className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Enseignant de Musique</h3>
                  <p className="text-gray-600 text-sm">
                    Gérez vos groupes, assignez des devoirs et suivez les progrès de vos élèves
                  </p>
                </div>
              </div>
            </button>

            {/* Option Élève */}
            <button
              onClick={() => selectRoleAndContinue('student')}
              className="w-full p-6 bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-secondary-300 hover:bg-secondary-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                  <User className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Élève</h3>
                  <p className="text-gray-600 text-sm">
                    Accédez à vos devoirs, soumettez vos pratiques et communiquez avec votre professeur
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={goBackToLogin}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ← Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue de création de compte
  if (viewMode === 'create-account') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Créer un Compte {selectedRole === 'teacher' ? 'Enseignant' : 'Élève'}
            </h1>
            <p className="text-gray-600">
              {selectedRole === 'teacher' 
                ? 'Rejoignez MusiqueConnect en tant qu\'enseignant'
                : 'Rejoignez MusiqueConnect en tant qu\'élève'
              }
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleCreateAccount} className="space-y-4">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={createAccountData.firstName}
                    onChange={(e) => setCreateAccountData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="input"
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={createAccountData.lastName}
                    onChange={(e) => setCreateAccountData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="input"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="createEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <input
                  id="createEmail"
                  type="email"
                  value={createAccountData.email}
                  onChange={(e) => setCreateAccountData(prev => ({ ...prev, email: e.target.value }))}
                  className="input"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              {/* Instrument (pour les élèves seulement) */}
              {selectedRole === 'student' && (
                <div>
                  <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-2">
                    Instrument Principal
                  </label>
                  <select
                    id="instrument"
                    value={createAccountData.instrument}
                    onChange={(e) => setCreateAccountData(prev => ({ ...prev, instrument: e.target.value }))}
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
              )}

              {/* Mots de passe */}
              <div>
                <label htmlFor="createPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="createPassword"
                  type="password"
                  value={createAccountData.password}
                  onChange={(e) => setCreateAccountData(prev => ({ ...prev, password: e.target.value }))}
                  className="input"
                  placeholder="Minimum 6 caractères"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={createAccountData.confirmPassword}
                  onChange={(e) => setCreateAccountData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="input"
                  placeholder="Répétez votre mot de passe"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? 'Création en cours...' : 'Créer mon compte'}
              </button>
            </form>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou créer avec</span>
              </div>
            </div>

            {/* Boutons OAuth pour création de compte */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuthAccountCreation('google')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs font-medium">Google</span>
              </button>
              
              <button
                onClick={() => handleOAuthAccountCreation('microsoft')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                  <path fill="#7fba00" d="M1 13h10v10H1z"/>
                  <path fill="#ffb900" d="M13 13h10v10H13z"/>
                </svg>
                <span className="text-xs font-medium">Microsoft</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setViewMode('role-selection')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium mr-4"
              >
                ← Changer de rôle
              </button>
              <button
                onClick={goBackToLogin}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue de connexion par défaut
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MusiqueConnect</h1>
          <p className="text-gray-600">Connecter harmonieusement professeurs et élèves de musique</p>
        </div>

        <div className="card">
          {/* Formulaire de connexion classique */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Entrez votre e-mail"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          {/* Boutons OAuth côte à côte */}
          <div className="grid grid-cols-2 gap-3">
            <GoogleLoginButton 
              onClick={handleGoogleLogin}
              disabled={loading}
            />
            <MicrosoftLoginButton 
              onClick={handleMicrosoftLogin}
              disabled={loading}
            />
          </div>

          {/* Bouton de création de compte */}
          <div className="mt-6">
            <button
              onClick={startAccountCreation}
              className="w-full btn-outline flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Créer un nouveau compte
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Comptes de démonstration :</p>
              <div className="space-y-1">
                <p><strong>Professeur de musique :</strong> teacher@demo.com</p>
                <p><strong>Élèves :</strong></p>
                <div className="ml-4 space-y-1">
                  <p>• Emma Martin (Piano, Groupe 118) : student1@demo.com</p>
                  <p>• Lucas Moreau (Guitare, Groupe 119) : student2@demo.com</p>
                  <p>• Sofia Rodriguez (Violon, Groupe 218) : student3@demo.com</p>
                </div>
                <p><strong>Mot de passe :</strong> demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}