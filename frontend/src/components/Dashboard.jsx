import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (!token) {
      navigate('/login');
    } else {
      axios.get('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setUsername(response.data.username);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        handleLogout();
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h1>Welcome, {username}!</h1>
      <p>You are now logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
