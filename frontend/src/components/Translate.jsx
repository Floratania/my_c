import React, { useState } from 'react';
import axios from 'axios';

const Translate = () => {
  const [input, setInput] = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('en_to_uk');
  const [history, setHistory] = useState([]);

  const detectMode = (text) => {
    return text.trim().split(/\s+/).length === 1 ? 'word' : 'sentence';
  };

  const detectDirection = (text) => {
    const cyrillic = /[а-яіїєґА-ЯІЇЄҐ]/g;
    const latin = /[a-zA-Z]/g;

    const cyrCount = (text.match(cyrillic) || []).length;
    const latCount = (text.match(latin) || []).length;

    return latCount >= cyrCount ? 'en_to_uk' : 'uk_to_en';
  };

  const handleTranslate = async () => {
    if (!input.trim()) return;

    const autoDirection = detectDirection(input);
    setDirection(autoDirection);
    setLoading(true);
    setError('');
    setTranslated('');

    try {
      const mode = detectMode(input);
      const res = await axios.post('http://localhost:8000/api/translator/translate/', {
        text: input.trim(),
        mode: mode,
        direction: autoDirection
      });

      setTranslated(res.data.translated);
      setHistory(prev => [...prev, { input, translated: res.data.translated, direction: autoDirection }]);
    } catch (err) {
      console.error(err);
      setError('❌ Помилка при перекладі.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleManualDirectionChange = (e) => {
    const newDir = e.target.value;
    setDirection(newDir);
    setInput('');
    setTranslated('');
    setError('');
  };

  const getPlaceholder = () => {
    return direction === 'en_to_uk'
      ? 'Enter a word or sentence in English...'
      : 'Введіть слово або речення українською...';
  };

  return (
    <div style={styles.container}>
      <h2>🌐 Перекладач</h2>
      <select value={direction} onChange={handleManualDirectionChange} style={styles.select}>
        <option value="en_to_uk">🇬🇧 Англійська → 🇺🇦 Українська</option>
        <option value="uk_to_en">🇺🇦 Українська → 🇬🇧 Англійська</option>
      </select>

      <textarea
        rows={4}
        style={styles.textarea}
        placeholder={getPlaceholder()}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleTranslate} style={styles.button} disabled={loading}>
        {loading ? 'Переклад...' : 'Перекласти'}
      </button>

      {translated && (
        <div style={styles.result}>
          <strong>Переклад:</strong>
          <p>{translated}</p>
          <button onClick={copyToClipboard} style={styles.copyButton}>📋 Копіювати</button>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}

      {history.length > 0 && (
        <div style={styles.history}>
          <h3>🕓 Історія перекладів:</h3>
          <ul>
            {history.slice().reverse().map((item, index) => (
              <li key={index}><strong>{item.input}</strong> → {item.translated}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 700,
    margin: '0 auto',
    padding: '1rem',
    fontFamily: 'Arial, sans-serif'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    marginBottom: '1rem'
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  select: {
    marginBottom: '1rem',
    padding: '0.5rem',
    fontSize: '1rem'
  },
  result: {
    marginTop: '1rem',
    backgroundColor: '#f0f0f0',
    padding: '1rem',
    borderRadius: '5px'
  },
  copyButton: {
    marginTop: '0.5rem',
    padding: '0.4rem 0.8rem',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginTop: '1rem'
  },
  history: {
    marginTop: '2rem'
  }
};

export default Translate;
