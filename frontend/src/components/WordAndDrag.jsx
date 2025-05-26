import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import API from '../services/api'; // Шлях до твого API-сервісу
import './WordAndDrag.css';

const WordDragAndDrop = () => {
  const [words, setWords] = useState([]);
  const [originalSentence, setOriginalSentence] = useState('');
  const [status, setStatus] = useState('');
  const [animateKey, setAnimateKey] = useState(0);

  const loadSentence = () => {
    API.get('drag-sentence/wd/')
      .then(res => {
        const { shuffled, original } = res.data;
        setWords(shuffled);
        setOriginalSentence(original);
        setStatus('');
        setAnimateKey(prev => prev + 1);
      })
      .catch(err => {
        console.error('❌ Error loading sentence:', err);
        setStatus('❌ Не вдалося завантажити речення.');
      });
  };

  useEffect(() => {
    loadSentence();
  }, []);

  const moveWord = (from, to) => {
    const updated = [...words];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setWords(updated);
  };

  const handleSubmit = () => {
    const sentence = words.join(' ');
    API.post('drag-sentence/check/', {
      sentence,
      original_sentence: originalSentence
    })
      .then(res => {
        setStatus(res.data.is_correct
          ? '✅ Речення правильне!'
          : `❌ Неправильно. Оригінал: "${res.data.original_sentence}"`);
      })
      .catch(err => {
        console.error('❌ Error checking sentence:', err);
        setStatus('❌ Помилка при перевірці.');
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h2>🧩 Складіть речення</h2>
      <ul className="drag-container" key={animateKey}>
        {words.map((word, idx) => (
          <WordItem key={idx} word={word} index={idx} moveWord={moveWord} />
        ))}
      </ul>
      <button onClick={handleSubmit}>✅ Перевірити</button>
      <button onClick={loadSentence} style={{ marginLeft: '1rem' }}>🔄 Нове речення</button>
      <p>{status}</p>
    </DndProvider>
  );
};

const WordItem = ({ word, index, moveWord }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'WORD',
    hover(item) {
      if (item.index !== index) {
        moveWord(item.index, index);
        item.index = index;
      }
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'WORD',
    item: { index },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className="drag-item animate-in"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        transition: 'transform 0.2s ease, opacity 0.2s ease'
      }}
    >
      {word}
    </li>
  );
};

export default WordDragAndDrop;
