import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseManager from './ExpenseManager';
import RevenueManager from './RevenueManager';
import SpecialistManager from './SpecialistManager';
import BudgetOverview from './BudgetOverview';
import BudgetExpenseManager from './BudgetExpenseManager';

type BudgetTabType = 'overview' | 'fournitures' | 'evenements' | 'reparations' | 'specialistes';

interface BudgetDashboardProps {
  selectedGroupId?: string;
}

export default function BudgetDashboard({ selectedGroupId }: BudgetDashboardProps) {
  const [activeTab, setActiveTab] = useState<BudgetTabType>('overview');
  const { user } = useAuth();
  const schoolYear = '2025-2026'; // Année scolaire actuelle

  const isTeacher = user?.role === 'teacher';

  if (!isTeacher) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Accès Restreint</h3>
        <p className="text-gray-600">Seuls les enseignants peuvent accéder à la gestion budgétaire.</p>
      </div>
    );
  }

  const tabs = [
    {
      id: 'overview' as BudgetTabType,
      label: 'Vue d\'ensemble',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Résumé global du budget'
    },
    {
      id: 'fournitures' as BudgetTabType,
      label: 'Fournitures',
      icon: <TrendingDown className="w-4 h-4" />,
      description: 'Gestion des dépenses'
    },
    {
      id: 'evenements' as BudgetTabType,
      label: 'Événements',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Gestion des revenus'
    },
    {
      id: 'reparations' as BudgetTabType,
      label: 'Réparations',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Gestion des spécialistes'
    },
    {
      id: 'specialistes' as BudgetTabType,
      label: 'Spécialistes',
      icon: <Users className="w-4 h-4" />,
      description: 'Suivi des spécialistes'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <BudgetOverview />;
      case 'fournitures':
        return <BudgetExpenseManager />;
      case 'evenements':
        return <BudgetExpenseManager />;
      case 'reparations':
        return <BudgetExpenseManager />;
      case 'specialistes':
        return <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Spécialistes</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">Interface dédiée aux spécialistes - À développer</p>
          </div>
        </div>;
      default:
        return <BudgetOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestion Budgétaire</h2>
              <p className="text-gray-600">Planification et suivi des budgets départementaux - {schoolYear}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <DollarSign className="w-4 h-4" />
              <span>Mode Admin</span>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu de l'onglet */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
        {renderTabContent()}
      </div>
    </div>
  );
} 