import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFlashcards, updateProgress } from '../services/flashcards';
import api from '../services/api';
import './FlashcardTrainer.css';

const FlashcardTrainer = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState('');
  const [skippedCards, setSkippedCards] = useState(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState(['new', 'learning']);
  const [isTrainingStarted, setIsTrainingStarted] = useState(false);

  const statusOptions = [
    { value: 'new', label: '🆕 Нові' },
    { value: 'learning', label: '🧠 Вчу' },
    { value: 'learned', label: '✅ Вивчені' },
  ];

  // Завантаження вподобань
  useEffect(() => {
    api.get('flashcards/user-preferences/')
      .then(res => {
        if (Array.isArray(res.data.selected_statuses)) {
          setSelectedStatuses(res.data.selected_statuses);
        }
      })
      .catch(() => {
        console.warn('Не вдалося завантажити уподобання');
        setSelectedStatuses(['new', 'learning']);
      });
  }, []);

  // Збереження вподобань
  const savePreferences = (statuses) => {
    api.post('flashcards/user-preferences/', {
      selected_statuses: statuses
    }).catch(() => {
      console.warn('Не вдалося зберегти уподобання');
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedStatuses(prev => {
      const updated = checked
        ? [...prev, value]
        : prev.filter(status => status !== value);

      savePreferences(updated);
      return updated;
    });
  };

  const loadFlashcards = () => {
    getFlashcards(selectedStatuses)
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Невірний формат відповіді");
        const shuffled = data.sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setSkippedCards(new Set());
        setCurrentIndex(0);
        setFlipped(false);
        setError('');
        setIsTrainingStarted(true);
      })
      .catch(() => {
        setError('❌ Не вдалося завантажити картки.');
      });
  };

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = () => {
    const currentCard = flashcards[currentIndex];
    if (currentCard) {
      setSkippedCards(prev => {
        const updated = new Set(prev);
        updated.add(currentCard.id);
        return updated;
      });

      const remaining = flashcards.filter((card, idx) =>
        idx !== currentIndex && !skippedCards.has(card.id)
      );

      setFlashcards(remaining);
      setCurrentIndex(0);
      setFlipped(false);
    }
  };

  const handleProgress = (status) => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    updateProgress(currentCard.id, status)
      .then(() => {
        const newList = flashcards.filter((_, idx) => idx !== currentIndex);
        setFlashcards(newList);
        setCurrentIndex(0);
        setFlipped(false);
      })
      .catch(() => {
        setError('❌ Помилка оновлення статусу картки.');
      });
  };

  if (error) {
    return (
      <div>
        <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
        <p>
          <Link to="/wordsets">Обрати набір слів</Link> або імпортуйте словник вручну.
        </p>
      </div>
    );
  }

  if (!isTrainingStarted) {
    return (
      <div>
        <h2>Оберіть типи слів для тренування:</h2>
        <form>
          {statusOptions.map(opt => (
            <label key={opt.value} style={{ display: 'block', marginBottom: '6px' }}>
              <input
                type="checkbox"
                value={opt.value}
                checked={selectedStatuses.includes(opt.value)}
                onChange={handleCheckboxChange}
              />
              {opt.label}
            </label>
          ))}
        </form>
        <button onClick={loadFlashcards} disabled={selectedStatuses.length === 0}>
          🚀 Почати тренування
        </button>
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <p>
        🎉 Усі слова опрацьовані! <Link to="/wordsets">Обрати інший набір</Link>
      </p>
    );
  }

  const card = flashcards[currentIndex];

  return (
    <div className="trainer-container">
      <div className={`trainer-card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="front">{card.word}</div>
        <div className="back">{card.definition || 'немає перекладу'}</div>
      </div>

      <div className="trainer-controls">
        <button onClick={() => handleProgress('learning')}>🧠 Вчу</button>
        <button onClick={() => handleProgress('learned')}>✅ Вивчив</button>
        <button onClick={handleNext}>➡️ Пропустити</button>
      </div>
    </div>
  );
};

export default FlashcardTrainer;
