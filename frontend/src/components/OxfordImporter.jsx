import React, { useState } from 'react';
import API from '../services/api';

const OxfordImporter = () => {
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState('');

  const handleImport = async (listType) => {
    setLoading(true);
    try {
      const res = await API.post('flashcards/wordsets/import_from_file/', {
        list_type: listType,
      });
      setImported(`${listType.toUpperCase()} імпортовано: ${res.data.imported} слів`);
    } catch (err) {
      setImported('❌ Помилка імпорту');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>📘 Імпорт словників</h2>
      <label>
        <input
          type="checkbox"
          onChange={() => handleImport('oxford3000')}
          disabled={loading}
        />
        Oxford 3000
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          onChange={() => handleImport('oxford5000')}
          disabled={loading}
        />
        Oxford 5000
      </label>
      <p>{imported}</p>
      <br />
      <label>
        <input
          type="checkbox"
          onChange={() => handleImport('phrases')}
          disabled={loading}
        />
        Phrases
      </label>
      <p>{imported}</p>
    </div>
  );
};

export default OxfordImporter;
