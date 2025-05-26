// src/components/TenseSelector.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TENSES = [
  { name: 'Present Simple', ua: 'Теперішній простий (Present Simple)' },
  { name: 'Present Continuous', ua: 'Теперішній тривалий (Present Continuous)' },
  { name: 'Present Perfect', ua: 'Теперішній доконаний (Present Perfect)' },
  { name: 'Present Perfect Continuous', ua: 'Теперішній доконано-тривалий (Present Perfect Continuous)' },
  { name: 'Past Simple', ua: 'Минулий простий (Past Simple)' },
  { name: 'Past Continuous', ua: 'Минулий тривалий (Past Continuous)' },
  { name: 'Past Perfect', ua: 'Минулий доконаний (Past Perfect)' },
  { name: 'Past Perfect Continuous', ua: 'Минулий доконано-тривалий (Past Perfect Continuous)' },
  { name: 'Future Simple', ua: 'Майбутній простий (Future Simple)' },
  { name: 'Future Continuous', ua: 'Майбутній тривалий (Future Continuous)' },
  { name: 'Future Perfect', ua: 'Майбутній доконаний (Future Perfect)' },
  { name: 'Future Perfect Continuous', ua: 'Майбутній доконано-тривалий (Future Perfect Continuous)' },
];

export default function TenseSelector() {
  return (
    <div style={styles.wrapper}>
      <h2>🕒 Оберіть граматичний час</h2>
      <div style={styles.grid}>
        {TENSES.map((tense) => (
          <Link
            key={tense.name}
            to={`/tense/${encodeURIComponent(tense.name)}`}
            style={styles.card}
          >
            {tense.ua}
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1rem',
  },
  card: {
    display: 'block',
    padding: '1rem',
    textDecoration: 'none',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    color: '#333',
    transition: 'all 0.2s ease-in-out',
    fontWeight: 'bold',
  },
};
