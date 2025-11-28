import React, { useState } from 'react';
import './CategoryForm.css';

const COLORS = [
  '#7c3aed', '#6d28d9', '#a78bfa', '#8b5cf6',
  '#c084fc', '#d946ef', '#fb7185', '#fb7185',
  '#fb923c', '#f97316', '#f59e0b', '#ef4444',
  '#10b981', '#06b6d4', '#3b82f6', '#7c3aed'
];

function CategoryForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: COLORS[0]
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Por favor, informe o nome da categoria');
      return;
    }
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      color: COLORS[0]
    });
  };

  return (
    <div className="form-container">
      <form className="category-form" onSubmit={handleSubmit}>
        <h2>Nova Categoria</h2>
        
        <div className="form-group">
          <label htmlFor="name">Nome da Categoria</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Alimentação, Transporte, Lazer"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição (opcional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva esta categoria"
          />
        </div>

        <div className="form-group">
          <label htmlFor="color">Cor</label>
          <div className="color-picker">
            {COLORS.map(color => (
              <label key={color} className="color-option">
                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={formData.color === color}
                  onChange={handleChange}
                />
                <span 
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Adicionar Categoria
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;


