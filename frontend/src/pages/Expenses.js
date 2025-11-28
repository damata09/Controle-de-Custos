import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import CategoryForm from '../components/CategoryForm';
import './Expenses.css';

function Expenses() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const showMessage = (message, type = 'error') => {
    if (type === 'error') {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, categoriesData] = await Promise.all([
        api.get('/expenses'),
        api.get('/categories')
      ]);
      setExpenses(expensesData.data);
      setCategories(categoriesData.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await api.post('/expenses', expenseData);
      await loadData();
      setShowExpenseForm(false);
      showMessage('Despesa adicionada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      showMessage(error.response?.data?.error || 'Erro ao adicionar despesa');
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      await api.post('/categories', categoryData);
      await loadData();
      setShowCategoryForm(false);
      showMessage('Categoria adicionada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      showMessage(error.response?.data?.error || 'Erro ao adicionar categoria');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta despesa?')) {
      try {
        await api.delete(`/expenses/${id}`);
        await loadData();
        showMessage('Despesa deletada com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao deletar despesa:', error);
        showMessage(error.response?.data?.error || 'Erro ao deletar despesa');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="expenses-page">
      <nav className="navbar">
        <div className="nav-content">
          <h2 className="nav-logo">💰 Controle de Custos</h2>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/expenses" className="nav-link active">Despesas</Link>
            <Link to="/profile" className="nav-link">Perfil</Link>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Alternar tema claro/escuro"
              title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <button
              className="btn btn-secondary btn-logout-nav"
              onClick={handleLogout}
              title="Sair da conta"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="expenses-container">
        {(error || success) && (
          <div className={`message ${error ? 'error' : 'success'}`}>
            {error || success}
          </div>
        )}
        <div className="expenses-header">
          <h1>Todas as Despesas</h1>
          <p className="subtitle">Gerencie todas as suas despesas</p>
        </div>

        <div className="stats-card">
          <div className="stat-item">
            <span className="stat-label">Total de Despesas</span>
            <span className="stat-value">R$ {totalExpenses.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Quantidade</span>
            <span className="stat-value">{expenses.length}</span>
          </div>
        </div>

        <div className="actions-bar">
          <button
            className="btn btn-primary"
            onClick={() => setShowExpenseForm(!showExpenseForm)}
          >
            {showExpenseForm ? 'Cancelar' : '+ Nova Despesa'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
          >
            {showCategoryForm ? 'Cancelar' : '+ Nova Categoria'}
          </button>
        </div>

        {showCategoryForm && (
          <CategoryForm
            onSubmit={handleAddCategory}
            onCancel={() => setShowCategoryForm(false)}
          />
        )}

        {showExpenseForm && (
          <ExpenseForm
            categories={categories}
            onSubmit={handleAddExpense}
            onCancel={() => setShowExpenseForm(false)}
          />
        )}

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onDelete={handleDeleteExpense}
          />
        )}
      </div>
    </div>
  );
}

export default Expenses;


