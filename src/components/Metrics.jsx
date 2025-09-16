import React from 'react';

const Metrics = ({ totalTime = 0, sessions = 0 }) => {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  return (
    <div className="metrics">
      <p>Time Spent: {formatTime(totalTime)}</p>
      <p>Pomodoro Sessions: {sessions}</p>
    </div>
  );
};

export default Metrics;
