import React from 'react';
import './ExpenseList.css';

function ExpenseList({ expenses, onDelete, showTitle = true }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma despesa cadastrada ainda.</p>
        <p className="empty-hint">Adicione sua primeira despesa clicando no botão acima!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {showTitle && <h2 className="list-title">Despesas Cadastradas</h2>}
      <div className="expense-grid">
        {expenses.map(expense => (
          <div key={expense._id} className="expense-card">
            <div 
              className="expense-category-badge"
              style={{ backgroundColor: expense.category?.color || 'var(--primary-3)' }}
            >
              {expense.category?.name || 'Sem categoria'}
            </div>
            <div className="expense-content">
              <h3 className="expense-description">{expense.description}</h3>
              <div className="expense-details">
                <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                <span className="expense-date">{formatDate(expense.date)}</span>
              </div>
            </div>
            <button 
              className="delete-btn"
              onClick={() => onDelete(expense._id)}
              title="Deletar despesa"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;

