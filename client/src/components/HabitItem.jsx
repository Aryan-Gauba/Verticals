import React from 'react';
import toast from 'react-hot-toast';

function HabitItem({ habit, onLog, onDelete }) {
  const { id, title, streak, loggedToday } = habit;

  // Calculate progress within current 21-day cycle
  const currentBlockProgress = streak % 21 === 0 && streak > 0 ? 21 : streak % 21;
  const progressPercent = Math.min((currentBlockProgress / 21) * 100, 100);

  const handleClick = () => {
    if (loggedToday) {
      // Calculate remaining time until local midnight
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight - now;

      const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      toast(
        (t) => (
          <div>
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>
              Already completed "{title}" for today! 🔥
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>
              Come back in <strong>{hoursLeft}h {minutesLeft}m</strong> after midnight to log your next streak.
            </p>
          </div>
        ),
        {
          icon: '⏳',
          duration: 4000,
        }
      );
      return;
    }

    // Pass today's date formatted as YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    onLog(id, todayStr);
    toast.success(`Logged progress for "${title}"! 🔥`, { duration: 3000 });
  };

  return (
    <div className="habit-card">
      <div className="habit-top-row">
        <div className="habit-info">
          <h3>{title}</h3>
          <p>Current Streak: <strong>{streak} Days</strong> 🔥</p>
        </div>
        <div className="habit-actions">
          <button 
            className={`btn-checkin ${loggedToday ? 'completed' : ''}`}
            onClick={handleClick}
            title={loggedToday ? 'Completed for today' : 'Log progress'}
          >
            {loggedToday ? '✓' : '+'}
          </button>
          <button 
            className="btn-delete" 
            onClick={() => onDelete(id)}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="streak-progress-container">
        <div className="progress-header">
          <span>21-Day Cycle Progress</span>
          <span>{currentBlockProgress} / 21 Days</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default HabitItem;