import React, { useState } from 'react';
import API from '../services/flashcards';

const OxfordImporter = () => {
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState('');
  const [customFile, setCustomFile] = useState(null);

  const handleImport = async (listType) => {
    setLoading(true);
    setImported('');
    try {
      const res = await API.post('flashcards/wordsets/import_from_file/', {
        list_type: listType,
      });
      setImported(`✅ ${listType.toUpperCase()} імпортовано: ${res.data.imported} слів`);
    } catch (err) {
      setImported('❌ Помилка імпорту');
    }
    setLoading(false);
  };

  const handleCustomUpload = async () => {
    if (!customFile) return;
    if (!customFile.name.endsWith('.txt')) {
      setImported('❌ Потрібен .txt файл');
      return;
    }

    setLoading(true);
    setImported('');

    const formData = new FormData();
    formData.append('file', customFile);

    try {
      const res = await API.post('flashcards/wordsets/import_custom/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImported(`✅ Імпортовано ${res.data.imported} слів з вашого файлу`);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setImported(`❌ ${err.response.data.error}`);
      } else {
        setImported('❌ Помилка імпорту власного файлу');
      }
    }
    

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <h2>📘 Імпорт словників</h2>
{/* 
      <div style={styles.section}>
        <label>
          <input type="checkbox" onChange={() => handleImport('oxford3000')} disabled={loading} />
          Oxford 3000
        </label>
        <label>
          <input type="checkbox" onChange={() => handleImport('oxford5000')} disabled={loading} />
          Oxford 5000
        </label>
        <label>
          <input type="checkbox" onChange={() => handleImport('phrases')} disabled={loading} />
          Phrases
        </label>
      </div> */}

      <hr />

      <div style={styles.section}>
        <h3>📂 Завантажити власний .txt файл</h3>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setCustomFile(e.target.files[0])}
          disabled={loading}
        />
        <button onClick={handleCustomUpload} disabled={loading || !customFile}>
          📥 Імпортувати файл
        </button>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Кожне слово має бути в окремому рядку.</p>
      </div>

      {imported && <p style={styles.status}>{imported}</p>}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  status: {
    marginTop: '1rem',
    fontWeight: 'bold',
    color: '#444'
  }
};

export default OxfordImporter;
