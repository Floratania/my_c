import React, { useState } from 'react';
import API from '../services/flashcards';


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



// import React, { useState } from 'react';
// import API from '../services/flashcards';

// const OxfordImporter = () => {
//   const [loading, setLoading] = useState(false);
//   const [imported, setImported] = useState('');
//   const [customFile, setCustomFile] = useState(null);

//   const handleImport = async (listType) => {
//     setLoading(true);
//     try {
//       const res = await API.post('flashcards/wordsets/import_from_file/', {
//         list_type: listType,
//       });
//       setImported(`${listType.toUpperCase()} імпортовано: ${res.data.imported} слів`);
//     } catch (err) {
//       setImported('❌ Помилка імпорту');
//     }
//     setLoading(false);
//   };

//   const handleCustomUpload = async () => {
//     if (!customFile) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('file', customFile);

//     try {
//       const res = await API.post('flashcards/wordsets/import_custom/', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setImported(`✅ Імпортовано ${res.data.imported} слів з вашого файлу`);
//     } catch (err) {
//       setImported('❌ Помилка імпорту власного файлу');
//     }

//     setLoading(false);
//   };

//   return (
//     <div>
//       <h2>📘 Імпорт словників</h2>

//       <label>
//         <input
//           type="checkbox"
//           onChange={() => handleImport('oxford3000')}
//           disabled={loading}
//         />
//         Oxford 3000
//       </label>
//       <br />
//       <label>
//         <input
//           type="checkbox"
//           onChange={() => handleImport('oxford5000')}
//           disabled={loading}
//         />
//         Oxford 5000
//       </label>
//       <br />
//       <label>
//         <input
//           type="checkbox"
//           onChange={() => handleImport('phrases')}
//           disabled={loading}
//         />
//         Phrases
//       </label>

//       <hr />
//       <h3>📂 Завантажити свій .txt файл</h3>
//       <input
//         type="file"
//         accept=".txt"
//         onChange={(e) => setCustomFile(e.target.files[0])}
//         disabled={loading}
//       />
//       <button onClick={handleCustomUpload} disabled={loading || !customFile}>
//         📥 Імпортувати файл
//       </button>

//       <p>{imported}</p>
//     </div>
//   );
// };

// export default OxfordImporter;
