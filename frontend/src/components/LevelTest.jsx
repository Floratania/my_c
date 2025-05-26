import React, { useEffect, useState } from 'react';
import API from '../services/api';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const nextLevel = (level) => {
  const idx = LEVELS.indexOf(level);
  return LEVELS[Math.min(idx + 1, LEVELS.length - 1)];
};

const determineUserLevel = (levelPercent) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    const lvl = LEVELS[i];
    if (levelPercent[lvl] >= 60) {
      const allBeforeOk = LEVELS.slice(0, i).every(l => levelPercent[l] >= 60);
      if (allBeforeOk) return lvl;
    }
  }
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (levelPercent[LEVELS[i]] >= 50) return LEVELS[i];
  }
  return 'A1';
};


const LevelTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [initialDone, setInitialDone] = useState(false);
  const [adaptiveAnswers, setAdaptiveAnswers] = useState([]);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState([]);
  const [adaptiveRound, setAdaptiveRound] = useState(1);
  const [currentLevel, setCurrentLevel] = useState('B1');
  const [adaptiveFinished, setAdaptiveFinished] = useState(false);
  const [finalLevel, setFinalLevel] = useState(null);

  useEffect(() => {
    API.get('leveltest/leveltest/')
      .then(res => setQuestions(res.data))
      .catch(() => alert('❌ Не вдалося завантажити стартовий тест'));
  }, []);

  const handleSelect = (qid, selected, adaptive = false) => {
    if (adaptive) {
      setAdaptiveAnswers(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(a => a.id === qid);
        if (idx >= 0) updated[idx].selected = selected;
        else updated.push({ id: qid, selected });
        return updated;
      });
    } else {
      setAnswers({ ...answers, [qid]: selected });
    }
  };

  const nextInitial = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleInitialSubmit();
    }
  };

  const handleInitialSubmit = async () => {
    const payload = Object.entries(answers).map(([qid, selected]) => ({
      question_id: qid,
      selected
    }));

    try {
      const res = await API.post('leveltest/leveltest/', payload);
      setInitialDone(true);
      setCurrentLevel(res.data.level);
      fetchAdaptive(currentLevel);
    } catch {
      alert('❌ Помилка при надсиланні результатів');
    }
  };

  const fetchAdaptive = async (level) => {
    try {
      const res = await API.get(`leveltest/adaptive/?level=${level}&count=5`);
      setAdaptiveQuestions(res.data);
    } catch {
      alert("❌ Не вдалося завантажити адаптивні питання");
    }
  };

  const submitAdaptiveRound = () => {
    const roundData = adaptiveQuestions.map(q => {
      const answer = adaptiveAnswers.find(a => a.id === q.id);
      return {
        ...q,
        correct: q.correct === answer?.selected
      };
    });

    const correctCount = roundData.filter(r => r.correct).length;
    const percent = (correctCount / roundData.length) * 100;
    const allAnswers = [...adaptiveAnswers, ...roundData];
    setAdaptiveAnswers(allAnswers);

    if (adaptiveRound >= 5 || percent < 60) {
      const grouped = {};
      allAnswers.forEach(a => {
        if (!grouped[a.level]) grouped[a.level] = { correct: 0, total: 0 };
        grouped[a.level].total++;
        if (a.correct) grouped[a.level].correct++;
      });
      const percents = {};
      for (let lvl in grouped) {
        percents[lvl] = Math.round((grouped[lvl].correct / grouped[lvl].total) * 100);
      }
      setFinalLevel(determineUserLevel(percents));
      setAdaptiveFinished(true);
    } else {
      const next = percent >= 80 ? nextLevel(currentLevel) : currentLevel;
      setCurrentLevel(next);
      setAdaptiveRound(adaptiveRound + 1);
      fetchAdaptive(next);
    }
  };

  if (adaptiveFinished) {
    return (
      <div>
        <h2>🧠 Тест завершено</h2>
        <p><strong>Фінальний рівень:</strong> {finalLevel}</p>
      </div>
    );
  }

  if (initialDone) {
    const q = adaptiveQuestions[adaptiveAnswers.length % 5];
    if (!q) return <p>⌛ Завантаження...</p>;
    return (
      <div>
        <h3>Раунд {adaptiveRound} / 5 | Рівень: {currentLevel}</h3>
        <p><strong>{q.question}</strong></p>
        {['a', 'b', 'c', 'd'].map(opt => (
          <label key={opt} style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              type="radio"
              name="adaptive"
              checked={adaptiveAnswers.find(a => a.id === q.id)?.selected === opt}
              onChange={() => handleSelect(q.id, opt, true)}
            />
            {q[`option_${opt}`]}
          </label>
        ))}
        <br />
        {adaptiveAnswers.length % 5 === 4 && (
          <button onClick={submitAdaptiveRound}>✅ Завершити раунд</button>
        )}
      </div>
    );
  }

  const q = questions[currentIdx];
  if (!q) return <p>⌛ Завантаження...</p>;

  return (
    <div>
      <h3>Базовий тест — Питання {currentIdx + 1} / {questions.length}</h3>
      <p><strong>{q.question}</strong></p>
      {['a', 'b', 'c', 'd'].map(opt => (
        <label key={opt} style={{ display: 'block', marginBottom: '0.5rem' }}>
          <input
            type="radio"
            name="option"
            checked={answers[q.id] === opt}
            onChange={() => handleSelect(q.id, opt)}
          />
          {q[`option_${opt}`]}
        </label>
      ))}
      <br />
      <button onClick={nextInitial} disabled={!answers[q.id]}>Далі</button>

    </div>
  );
};

export default LevelTest;
