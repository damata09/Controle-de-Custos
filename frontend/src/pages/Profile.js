import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Profile.css';

function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMonthlyIncome(user.monthlyIncome || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateProfile(name, monthlyIncome ? parseFloat(monthlyIncome) : 0);

    if (result.success) {
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <nav className="navbar">
        <div className="nav-content">
          <h2 className="nav-logo">💰 Controle de Custos</h2>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/expenses" className="nav-link">Despesas</Link>
            <Link to="/profile" className="nav-link active">Perfil</Link>
          </div>
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h1>Meu Perfil</h1>
            <p className="profile-email">{user?.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthlyIncome">Renda Mensal (R$)</label>
              <input
                type="number"
                id="monthlyIncome"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <small>Informe sua renda mensal para cálculos de saldo</small>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>

          <div className="profile-actions">
            <button onClick={handleLogout} className="btn btn-secondary btn-logout">
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;


