import React, { useState } from 'react';
import axios from 'axios';

const TenseLayout = ({ title, explanation, structure, examples, practiceTense }) => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleCheck = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/tense/check/', {
        sentence: input,
      });
      const predicted = res.data.tense.toLowerCase();
      if (predicted === practiceTense.toLowerCase()) {
        setFeedback('✅ Правильно! Ви використали правильний час.');
      } else {
        setFeedback(`❌ Виявлений час: ${predicted}. Спробуйте ще раз.`);
      }
    } catch (err) {
      setFeedback('❌ Помилка при перевірці.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{title}</h1>
      <p><strong>Пояснення:</strong> {explanation}</p>
      <p><strong>Структура:</strong> {structure}</p>

      <h3>Приклади:</h3>
      <ul>
        {examples.map((ex, i) => (
          <li key={i}><strong>{ex.sentence}</strong> – {ex.translation}</li>
        ))}
      </ul>

      <h3>📝 Практика</h3>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Напишіть приклад у цьому часі..."
      />
      <button onClick={handleCheck}>Перевірити</button>
      <p>{feedback}</p>
    </div>
  );
};

export default TenseLayout;