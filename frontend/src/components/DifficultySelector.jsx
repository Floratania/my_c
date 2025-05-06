// src/components/DifficultySelector.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DifficultySelector() {
  const navigate = useNavigate();

  const handleSelect = (level) => {
    navigate(`/flashcards?difficulty=${level}`);
  };

  return (
    <div className="difficulty-selector">
      <h2>Оберіть рівень складності</h2>
      <button onClick={() => handleSelect('easy')}>Легкий</button>
      <button onClick={() => handleSelect('medium')}>Середній</button>
      <button onClick={() => handleSelect('hard')}>Складний</button>
    </div>
  );
}
