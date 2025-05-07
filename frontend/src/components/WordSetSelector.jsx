import React, { useEffect, useState } from 'react';
import { getWordSets, subscribeToSet } from '../services/wordsets';
import { Link } from 'react-router-dom';

const WordSetSelector = ({ onSubscribed }) => {
  const [sets, setSets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getWordSets()
      .then((res) => {
        if (Array.isArray(res)) {
          setSets(res);
        } else if (res?.data && Array.isArray(res.data)) {
          setSets(res.data);
        } else {
          setError('⚠️ Помилка формату даних з сервера.');
        }
      })
      .catch(() => {
        setError('📡 Помилка завантаження наборів слів.');
      });
  }, []);

  const handleSubscribe = async (id) => {
    await subscribeToSet(id);
    onSubscribed();
  };

  return (
    <div>
      <h2>📚 Доступні набори слів</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!sets.length && !error ? (
        <div>
          <p>❌ Наразі немає доступних публічних наборів слів.</p>
          <p>
            👉 Ви можете <Link to="/import">завантажити власний .txt файл</Link>, де кожне слово — в новому рядку.
          </p>
        </div>
      ) : (
        <ul>
          {sets.map((set) => (
            <li key={set.id}>
              {set.name}
              <button onClick={() => handleSubscribe(set.id)}>➕ Додати</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WordSetSelector;
