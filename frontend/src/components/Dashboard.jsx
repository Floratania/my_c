// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export default function Dashboard() {
//   const [username, setUsername] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('access');

//     if (!token) {
//       navigate('/login');
//     } else {
//       axios.get('http://localhost:8000/api/profile/', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })
//       .then(response => {
//         setUsername(response.data.username);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching profile:', error);
//         handleLogout();
//       });
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('access');
//     localStorage.removeItem('refresh');
//     navigate('/login');
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="dashboard">
//       <h1>Welcome, {username}!</h1>
//       <p>You are now logged in.</p>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';


export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>👋 Вітаємо, {user?.username || 'користувачу'}!</h1>
      <p style={styles.subtext}>Оберіть один з розділів нижче, щоб розпочати вивчення англійської:</p>

      <div style={styles.grid}>
        <Link to="/flashcards" style={styles.card}>📚 Флеш-картки</Link>
        <Link to="/translate" style={styles.card}>🌍 Перекладач</Link>
        <Link to="/level-test" style={styles.card}>🧪 Тест рівня</Link>
        <Link to="/tenses" style={styles.card}>⏳ Вивчити часи</Link>
        <Link to="/wd" style={styles.card}>🧩 Складання речень</Link>
        <Link to="/wordsets" style={styles.card}>📖 Обрати словник</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subtext: {
    marginBottom: '2rem',
    color: '#555'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  card: {
    textDecoration: 'none',
    padding: '1rem',
    background: '#f1f1f1',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    transition: 'all 0.2s ease-in-out'
  }
};
