import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import CategoryForm from '../components/CategoryForm';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

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
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      alert('Erro ao adicionar despesa');
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      await api.post('/categories', categoryData);
      await loadData();
      setShowCategoryForm(false);
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      alert('Erro ao adicionar categoria');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta despesa?')) {
      try {
        await api.delete(`/expenses/${id}`);
        await loadData();
      } catch (error) {
        console.error('Erro ao deletar despesa:', error);
        alert('Erro ao deletar despesa');
      }
    }
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    let startDate;

    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return expenses;
    }

    return expenses.filter(expense => new Date(expense.date) >= startDate);
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyIncome = user?.monthlyIncome || 0;
  const balance = monthlyIncome - totalExpenses;
  const percentageUsed = monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0;

  // Agrupar por categoria
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const catName = expense.category?.name || 'Sem categoria';
    acc[catName] = (acc[catName] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Dados para o gráfico de pizza
  const pieLabels = Object.keys(expensesByCategory);
  const pieDataValues = Object.values(expensesByCategory);
  const pieColors = pieLabels.map((label) => {
    const cat = categories.find(c => c.name === label);
    return cat?.color || 'var(--primary-3)';
  });

  const chartData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieDataValues,
        backgroundColor: pieColors,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 12,
        }
      }
    },
    maintainAspectRatio: false,
  };

  // add percentage display in tooltip
  chartOptions.plugins.tooltip = {
    callbacks: {
      label: function(context) {
        const value = context.parsed || 0;
        const total = pieDataValues.reduce((s, v) => s + v, 0) || 1;
        const percent = ((value / total) * 100).toFixed(1);
        return `${context.label}: R$ ${value.toFixed(2)} (${percent}%)`;
      }
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-content">
          <h2 className="nav-logo">💰 Controle de Custos</h2>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link active">Dashboard</Link>
            <Link to="/expenses" className="nav-link">Despesas</Link>
            <Link to="/profile" className="nav-link">Perfil</Link>
            {/* Theme toggle */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Alternar tema claro/escuro"
              title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Olá, {user?.name}! 👋</h1>
          <p className="subtitle">Gerencie suas finanças de forma inteligente</p>
        </div>

        <div className="period-selector">
          <button
            className={selectedPeriod === 'week' ? 'active' : ''}
            onClick={() => setSelectedPeriod('week')}
          >
            Semana
          </button>
          <button
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => setSelectedPeriod('month')}
          >
            Mês
          </button>
          <button
            className={selectedPeriod === 'year' ? 'active' : ''}
            onClick={() => setSelectedPeriod('year')}
          >
            Ano
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card income">
            <div className="stat-icon">💵</div>
            <div className="stat-info">
              <span className="stat-label">Renda Mensal</span>
              <span className="stat-value">R$ {monthlyIncome.toFixed(2)}</span>
            </div>
          </div>

          <div className="stat-card expenses">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-label">Total Gasto</span>
              <span className="stat-value">R$ {totalExpenses.toFixed(2)}</span>
            </div>
          </div>

          <div className="stat-card balance">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-label">Saldo</span>
              <span className={`stat-value ${balance < 0 ? 'negative' : ''}`}>
                R$ {balance.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="stat-card percentage">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <span className="stat-label">% Utilizado</span>
              <span className="stat-value">{percentageUsed.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-label">
            <span>Uso da Renda Mensal</span>
            <span>{percentageUsed.toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                  width: `${Math.min(percentageUsed, 100)}%`,
                  backgroundColor: percentageUsed > 80 ? '#ef4444' : percentageUsed > 60 ? 'var(--primary-2)' : 'var(--primary-3)'
                }}
            />
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section chart-card">
            <h2>Distribuição por Categoria</h2>
            <div className="chart-and-list">
              <div className="chart-area">
                {pieDataValues.length > 0 ? (
                  <Pie data={chartData} options={chartOptions} />
                ) : (
                  <p className="empty-text">Nenhuma despesa no período selecionado</p>
                )}
              </div>

              <div className="chart-list">
                {topCategories.map(([name, amount]) => {
                  const category = categories.find(cat => cat.name === name);
                  return (
                    <div key={name} className="category-item">
                      <div
                        className="category-color"
                        style={{ backgroundColor: category?.color || 'var(--primary-3)' }}
                      />
                      <div className="category-info">
                        <span className="category-name">{name}</span>
                        <span className="category-amount">R$ {amount.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Últimas Despesas</h2>
            {loading ? (
              <div className="loading">Carregando...</div>
            ) : (
              <ExpenseList
                expenses={filteredExpenses.slice(0, 5)}
                onDelete={handleDeleteExpense}
                showTitle={false}
              />
            )}
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

        {/* Floating quick-add button (mobile/desktop) */}
        <button
          className="fab"
          onClick={() => setShowExpenseForm(!showExpenseForm)}
          title={showExpenseForm ? 'Fechar formulário' : 'Adicionar despesa'}
          aria-label="Adicionar despesa"
        >
          {showExpenseForm ? '✕' : '+'}
        </button>

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
      </div>
    </div>
  );
}

export default Dashboard;

