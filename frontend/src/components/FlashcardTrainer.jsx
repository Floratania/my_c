import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFlashcards, updateProgress } from '../services/flashcards';
import './FlashcardTrainer.css';

const FlashcardTrainer = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getFlashcards(['new', 'learning'])
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Невірний формат відповіді");
        const shuffled = data.sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setCurrentIndex(0);
        setFlipped(false);
      })
      .catch(() => {
        setError('❌ Не вдалося завантажити картки. ');
      });
  }, []);

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex(prev => (prev + 1 < flashcards.length ? prev + 1 : 0));
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
        <p style={{ color: 'red' }}>{error}</p>
        <p>
          <Link to="/wordsets">Обрати набір слів</Link> |{' '}
          або імпортуйте словник вручну
        </p>
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <p>
        🎉 Усі слова опрацьовані!{' '}
        <Link to="/wordsets">Обрати інший набір</Link>
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
