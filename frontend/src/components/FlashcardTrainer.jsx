import React, { useEffect, useState } from 'react';
import { getFlashcards, updateProgress } from '../services/api';
import './FlashcardTrainer.css';

const FlashcardTrainer = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    getFlashcards([]).then(data => {
      const shuffled = data.sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
      setCurrentIndex(0);
    });
  }, []);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex(prev => (prev + 1 < flashcards.length ? prev + 1 : 0));
  };

  const handleProgress = (status) => {
    const currentCard = flashcards[currentIndex];
    updateProgress(currentCard.id, status);
    const newList = flashcards.filter((_, idx) => idx !== currentIndex);
    setFlashcards(newList);
    setCurrentIndex(0);
    setFlipped(false);
  };

  if (!flashcards.length) {
    return <p>🎉 Усі слова опрацьовані!</p>;
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
