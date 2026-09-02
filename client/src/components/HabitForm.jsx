import React, { useState } from 'react';

function HabitForm({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <input
        className="habit-input"
        type="text"
        placeholder="New Vertical (e.g. Coding, Exercise)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" className="btn-secondary">Add Vertical</button>
    </form>
  );
}

export default HabitForm;