const pool = require('../db');

// Helper to compute contiguous daily streak dynamically
const computeStreak = (logRows) => {
  if (!logRows || logRows.length === 0) return 0;

  const dates = logRows.map(row => {
    const d = new Date(row.completed_date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const latestLog = dates[0];
  if (latestLog !== todayStr && latestLog !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(latestLog);

  for (let i = 0; i < dates.length; i++) {
    const currentStr = dates[i];
    const expectedStr = expectedDate.toISOString().split('T')[0];

    if (currentStr === expectedStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// GET /api/habits
exports.getHabits = async (req, res) => {
  const userId = req.user.id;

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
        const streak = computeStreak(logsResult.rows);

        const todayStr = new Date().toISOString().split('T')[0];
        const loggedToday = logsResult.rows.some(row => {
          const d = new Date(row.completed_date);
          return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0] === todayStr;
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

    // Fetch updated streak to return to client
    const logsResult = await pool.query(
      'SELECT completed_date FROM logs WHERE habit_id = $1 ORDER BY completed_date DESC',
      [id]
    );
    const updatedStreak = computeStreak(logsResult.rows);

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