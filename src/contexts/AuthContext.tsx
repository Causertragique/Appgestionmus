import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface CreateAccountData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  instrument?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithMicrosoft: () => Promise<boolean>;
  createAccount: (accountData: CreateAccountData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateurs fictifs pour la démonstration
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Restaurer l'utilisateur depuis le localStorage au démarrage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Sauvegarder l'utilisateur dans le localStorage quand il change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Authentification fictive
    const foundUser = users.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const createAccount = async (accountData: CreateAccountData): Promise<boolean> => {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = users.find(u => u.email === accountData.email);
      if (existingUser) {
        return false; // Email déjà utilisé
      }

      // Créer le nouvel utilisateur
      const newUser: User = {
        id: `user_${Date.now()}`,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        role: accountData.role,
        instrument: accountData.instrument,
        // Assigner une photo par défaut selon le rôle
        picture: accountData.role === 'teacher' 
          ? 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
          : 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      };

      // Ajouter l'utilisateur à la liste
      setUsers(prev => [...prev, newUser]);
      
      // Connecter automatiquement le nouvel utilisateur
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Simulation d'une authentification Google
      // Dans un vrai projet, vous utiliseriez la Google OAuth API
      
      // Pour la démonstration, on simule une connexion réussie
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simule le délai d'API
      
      // Créer un utilisateur fictif basé sur Google
      const googleUser: User = {
        id: `google_${Date.now()}`,
        firstName: 'Utilisateur',
        lastName: 'Google',
        email: 'user@gmail.com',
        role: 'teacher', // Par défaut, on assigne le rôle de professeur
        picture: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      };
      
      setUser(googleUser);
      setUsers(prev => [...prev, googleUser]);
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
      return false;
    }
  };

  const loginWithMicrosoft = async (): Promise<boolean> => {
    try {
      // Simulation d'une authentification Microsoft
      // Dans un vrai projet, vous utiliseriez MSAL (Microsoft Authentication Library)
      
      // Pour la démonstration, on simule une connexion réussie
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simule le délai d'API
      
      // Créer un utilisateur fictif basé sur Microsoft
      const microsoftUser: User = {
        id: `microsoft_${Date.now()}`,
        firstName: 'Utilisateur',
        lastName: 'Microsoft',
        email: 'user@outlook.com',
        role: 'teacher', // Par défaut, on assigne le rôle de professeur
        picture: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      };
      
      setUser(microsoftUser);
      setUsers(prev => [...prev, microsoftUser]);
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion Microsoft:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (profileData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle, 
      loginWithMicrosoft, 
      createAccount,
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}