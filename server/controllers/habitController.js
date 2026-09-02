const pool = require('../db');

// Safe helper to shift a YYYY-MM-DD string by N days
const shiftDateStr = (dateStr, days) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day + days));
  return utcDate.toISOString().split('T')[0];
};

// Safe helper to convert DB date output (string or Date object) to YYYY-MM-DD
const formatDbDate = (dbValue) => {
  if (!dbValue) return '';
  if (typeof dbValue === 'string') return dbValue.split('T')[0];
  if (dbValue instanceof Date) {
    const year = dbValue.getFullYear();
    const month = String(dbValue.getMonth() + 1).padStart(2, '0');
    const day = String(dbValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(dbValue).split('T')[0];
};

// Helper to compute contiguous daily streak dynamically using reference date
const computeStreak = (logRows, referenceDateStr) => {
  if (!logRows || logRows.length === 0) return 0;

  // Standardize all DB log dates to YYYY-MM-DD strings
  const dates = logRows.map(row => formatDbDate(row.completed_date));

  const todayStr = referenceDateStr;
  const yesterdayStr = shiftDateStr(referenceDateStr, -1);

  const latestLog = dates[0];
  if (latestLog !== todayStr && latestLog !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let expectedStr = latestLog;

  for (let i = 0; i < dates.length; i++) {
    const currentStr = dates[i];

    if (currentStr === expectedStr) {
      streak++;
      expectedStr = shiftDateStr(expectedStr, -1);
    } else if (currentStr === shiftDateStr(expectedStr, 1)) {
      // Ignore duplicate entries for the same date if any exist
      continue;
    } else {
      break;
    }
  }

  return streak;
};

// GET /api/habits
exports.getHabits = async (req, res) => {
  const userId = req.user.id;
  const clientDate = req.query.client_date || new Date().toISOString().split('T')[0];

  try {
    const habitsResult = await pool.query(
      'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at ASC',
      [userId]
    );
    const habits = habitsResult.rows;

    const habitsWithStreak = await Promise.all(
      habits.map(async (habit) => {
        const logsResult = await pool.query(
          'SELECT completed_date FROM logs WHERE habit_id = $1 ORDER BY completed_date DESC',
          [habit.id]
        );
        
        const streak = computeStreak(logsResult.rows, clientDate);

        const loggedToday = logsResult.rows.some(row => {
          return formatDbDate(row.completed_date) === clientDate;
        });

        return { ...habit, streak, loggedToday };
      })
    );

    res.json(habitsWithStreak);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/habits
exports.createHabit = async (req, res) => {
  const userId = req.user.id;
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const newHabit = await pool.query(
      'INSERT INTO habits (user_id, title) VALUES ($1, $2) RETURNING *',
      [userId, title]
    );
    res.status(201).json(newHabit.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/habits/:id/log
exports.logHabit = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { date } = req.body;

  if (!date) return res.status(400).json({ error: 'Client date standard is required' });

  try {
    const habitCheck = await pool.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [id, userId]);
    if (habitCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found or unauthorized' });
    }

    await pool.query(
      'INSERT INTO logs (habit_id, completed_date) VALUES ($1, $2)',
      [id, date]
    );

    const logsResult = await pool.query(
      'SELECT completed_date FROM logs WHERE habit_id = $1 ORDER BY completed_date DESC',
      [id]
    );
    const updatedStreak = computeStreak(logsResult.rows, date);

    res.status(201).json({ message: 'Logged successfully', streak: updatedStreak });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Already completed for today' });
    }
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found or unauthorized' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};