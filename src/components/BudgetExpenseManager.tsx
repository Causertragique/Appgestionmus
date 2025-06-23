import React, { useState } from 'react';
import { Plus, Edit, Trash2, DollarSign, Calendar, Package } from 'lucide-react';

interface BudgetExpense {
  id: string;
  title: string;
  amount: number;
  category: string;
  supplier: string;
  budgetCode: string;
  date: string;
  status: 'pending' | 'paid';
  description: string;
}

export default function BudgetExpenseManager() {
  const [expenses, setExpenses] = useState<BudgetExpense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<BudgetExpense | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: 0,
    category: 'fournitures',
    supplier: '',
    budgetCode: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const categories = [
    { id: 'fournitures', name: 'Fournitures', icon: Package },
    { id: 'evenements', name: 'Événements', icon: Calendar },
    { id: 'reparations', name: 'Réparations', icon: Package },
    { id: 'specialistes', name: 'Spécialistes', icon: Package }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newExpense: BudgetExpense = {
      id: editingExpense?.id || Date.now().toString(),
      ...formData,
      status: 'pending'
    };

    if (editingExpense) {
      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? newExpense : exp));
      setEditingExpense(null);
    } else {
      setExpenses([...expenses, newExpense]);
    }

    setFormData({
      title: '',
      amount: 0,
      category: 'fournitures',
      supplier: '',
      budgetCode: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setShowForm(false);
  };

  const handleEdit = (expense: BudgetExpense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      supplier: expense.supplier,
      budgetCode: expense.budgetCode,
      date: expense.date,
      description: expense.description
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending');
  const paidExpenses = expenses.filter(exp => exp.status === 'paid');

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dépenses totales</p>
              <p className="text-2xl font-semibold text-red-600">{totalExpenses}€</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-semibold text-yellow-600">{pendingExpenses.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payées</p>
              <p className="text-2xl font-semibold text-green-600">{paidExpenses.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Gestion des dépenses</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle dépense
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingExpense ? 'Modifier la dépense' : 'Nouvelle dépense'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (€)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fournisseur
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code budgétaire
                </label>
                <input
                  type="text"
                  value={formData.budgetCode}
                  onChange={(e) => setFormData({...formData, budgetCode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingExpense ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                  setFormData({
                    title: '',
                    amount: 0,
                    category: 'fournitures',
                    supplier: '',
                    budgetCode: '',
                    date: new Date().toISOString().split('T')[0],
                    description: ''
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des dépenses */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Liste des dépenses</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Titre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Montant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Catégorie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fournisseur</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Aucune dépense enregistrée
                  </td>
                </tr>
              ) : (
                expenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{expense.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{expense.amount}€</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {categories.find(cat => cat.id === expense.category)?.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{expense.supplier}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        expense.status === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {expense.status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 