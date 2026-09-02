import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Toaster } from 'react-hot-toast';
import { fetchHabits, createHabit, logHabit, deleteHabit } from './api';
import Auth from './components/Auth';
import HabitForm from './components/HabitForm';
import HabitItem from './components/HabitItem';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loadHabits = async () => {
    try {
      const { data } = await fetchHabits();
      setHabits(data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleLogHabit = async (id, date) => {
    try {
      const { data } = await logHabit(id, date);
      
      // Trigger confetti on every 21-day milestone
      if (data && data.streak > 0 && data.streak % 21 === 0) {
        fireConfetti();
      }

      loadHabits();
    } catch (err) {
      console.error('Failed to log habit:', err);
    }
  };

  const handleAddHabit = async (title) => {
    try {
      await createHabit(title);
      loadHabits();
    } catch (err) {
      console.error('Failed to create habit:', err);
    }
  };

  const handleDeleteHabit = async (id) => {
    if (window.confirm('Are you sure you want to delete this vertical?')) {
      try {
        await deleteHabit(id);
        loadHabits();
      } catch (err) {
        console.error('Failed to delete habit:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setHabits([]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div>
      {/* Toast Notification Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card, #2b2b2b)',
            color: 'var(--text-primary, #ffffff)',
            border: '1px solid var(--border-color, #444)',
            borderRadius: '8px',
          },
        }}
      />

      <nav className="navbar">
        <div className="navbar-container">
          <div className="brand-logo">
            <div className="brand-icon">V</div>
            <span className="brand-name">Verticals</span>
          </div>
          <button onClick={toggleTheme} className="btn-theme-toggle">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </nav>

      {!user ? (
        <Auth onAuthSuccess={(userData) => setUser(userData)} />
      ) : (
        <div className="app-container">
          <div className="app-header">
            <h2>Welcome, {user.username}</h2>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>

          <HabitForm onAdd={handleAddHabit} />

          <div>
            {habits.length === 0 ? (
              <div className="empty-state">
                <p>No active verticals yet. Add one above to start building your streak!</p>
              </div>
            ) : (
              habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onLog={handleLogHabit}
                  onDelete={handleDeleteHabit}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;