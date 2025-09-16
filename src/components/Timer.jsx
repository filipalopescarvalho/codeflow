import React, { useState, useEffect } from 'react';
import { formatTime, saveTimer, loadTimer, resetTimer } from '../utils/timerUtils';

const Timer = ({ taskId, onSessionEnd }) => {
  const presets = [
    { label: 'Pomodoro', seconds: 25 * 60 },
    { label: 'Long', seconds: 50 * 60 },
    { label: 'Short', seconds: 15 * 60 }
  ];

  const [seconds, setSeconds] = useState(() => loadTimer(taskId));
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(presets[0].seconds);

  useEffect(() => {
    saveTimer(taskId, seconds);
  }, [seconds, taskId]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (seconds >= duration) {
      onSessionEnd(taskId, seconds);
      setSeconds(0);
      setIsRunning(false);
      resetTimer(taskId);
    }
  }, [seconds, duration, onSessionEnd, taskId]);

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
    resetTimer(taskId);
  };

  const handleDurationChange = (e) => {
    const newDuration = Number(e.target.value);
    setDuration(newDuration);
    setSeconds(0);
    setIsRunning(false);
  };

  const progressPercent = Math.min((seconds / duration) * 100, 100);

  return (
    <div className="timer">
      <div className="timer-controls">
        <span>{formatTime(seconds)}</span>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <div className="progress-bar-container" style={{ marginTop: '5px', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
        <div className="progress-bar" style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: '#2196f3',
          transition: 'width 0.2s'
        }}></div>
      </div>

      <div className="duration-select" style={{ marginTop: '5px' }}>
        <label>Select duration: </label>
        <select value={duration} onChange={handleDurationChange}>
          {presets.map(p => (
            <option key={p.label} value={p.seconds}>{p.label} ({p.seconds/60} min)</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Timer;
