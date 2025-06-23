import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, BarChart, PieChart } from 'lucide-react';

interface BudgetData {
  totalBudget: number;
  totalExpenses: number;
  totalRevenue: number;
  balance: number;
  categories: {
    fournitures: { budget: number; spent: number };
    evenements: { budget: number; spent: number };
    reparations: { budget: number; spent: number };
    specialistes: { budget: number; spent: number };
  };
}

export default function BudgetOverview() {
  // Données fictives pour la démonstration
  const budgetData: BudgetData = {
    totalBudget: 50000,
    totalExpenses: 32000,
    totalRevenue: 45000,
    balance: 13000,
    categories: {
      fournitures: { budget: 15000, spent: 12000 },
      evenements: { budget: 20000, spent: 15000 },
      reparations: { budget: 8000, spent: 3000 },
      specialistes: { budget: 7000, spent: 2000 }
    }
  };

  const getCategoryProgress = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getCategoryColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble budgétaire</h2>
        <p className="text-gray-600">Analyse complète de vos finances</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget total</p>
              <p className="text-2xl font-semibold text-blue-600">{budgetData.totalBudget.toLocaleString()}€</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dépenses</p>
              <p className="text-2xl font-semibold text-red-600">{budgetData.totalExpenses.toLocaleString()}€</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus</p>
              <p className="text-2xl font-semibold text-green-600">{budgetData.totalRevenue.toLocaleString()}€</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solde</p>
              <p className={`text-2xl font-semibold ${budgetData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {budgetData.balance >= 0 ? '+' : ''}{budgetData.balance.toLocaleString()}€
              </p>
            </div>
            <div className={`p-3 rounded-full ${budgetData.balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <DollarSign className={`w-6 h-6 ${budgetData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Progression par catégorie */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression par catégorie</h3>
        
        <div className="space-y-4">
          {Object.entries(budgetData.categories).map(([category, data]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {category}
                </span>
                <span className="text-sm text-gray-600">
                  {data.spent.toLocaleString()}€ / {data.budget.toLocaleString()}€
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getCategoryColor(data.spent, data.budget)}`}
                  style={{ width: `${getCategoryProgress(data.spent, data.budget)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{getCategoryProgress(data.spent, data.budget).toFixed(1)}% utilisé</span>
                <span>{data.budget - data.spent}€ restant</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des dépenses */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des dépenses</h3>
          <div className="space-y-3">
            {Object.entries(budgetData.categories).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    category === 'fournitures' ? 'bg-blue-500' :
                    category === 'evenements' ? 'bg-green-500' :
                    category === 'reparations' ? 'bg-yellow-500' : 'bg-purple-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                </div>
                <span className="text-sm text-gray-600">{data.spent.toLocaleString()}€</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tendances */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-700">Revenus en hausse</p>
                <p className="text-xs text-green-600">+12% ce mois</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-700">Dépenses contrôlées</p>
                <p className="text-xs text-yellow-600">-5% ce mois</p>
              </div>
              <TrendingDown className="w-5 h-5 text-yellow-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-700">Solde positif</p>
                <p className="text-xs text-blue-600">+26% du budget</p>
              </div>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <DollarSign className="w-4 h-4" />
            Nouvelle dépense
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <TrendingUp className="w-4 h-4" />
            Nouveau revenu
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <PieChart className="w-4 h-4" />
            Rapport détaillé
          </button>
        </div>
      </div>
    </div>
  );
} 