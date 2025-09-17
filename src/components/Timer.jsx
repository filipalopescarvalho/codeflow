import React, { useState, useEffect } from 'react';
import { formatTime, saveTimer, loadTimer, resetTimer } from '../utils/timerUtils';

const Timer = ({ taskId, onSessionEnd }) => {
  const presets = [
    { label: 'Pomodoro', seconds: 25 * 60 },
    { label: 'Short Break', seconds: 15 * 60 },
    { label: 'Long Break', seconds: 50 * 60 },
  ];

  const [currentPreset, setCurrentPreset] = useState(presets[0]);
  const [seconds, setSeconds] = useState(() => loadTimer(taskId) || presets[0].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => { saveTimer(taskId, seconds); }, [seconds, taskId]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (seconds >= currentPreset.seconds) {
      onSessionEnd(taskId, seconds);
      setSessionsCompleted(sessionsCompleted + 1);
      setSeconds(0);
      setIsRunning(false);
      resetTimer(taskId);
    }
  }, [seconds, currentPreset, onSessionEnd, taskId, sessionsCompleted]);

  const handleStop = () => {
    setSeconds(0);
    setIsRunning(false);
    resetTimer(taskId);
  };

  const progressPercent = Math.min((seconds / currentPreset.seconds) * 100, 100);
  const progressColor = progressPercent > 80 ? '#ef4444' : '#3b82f6';

  return (
    <div className="timer">
      {/* Timer Display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <strong>{currentPreset.label}</strong>
        <span>{formatTime(seconds)}</span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '10px', width: '100%', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: progressColor,
          transition: 'width 0.3s, background 0.3s'
        }} />
      </div>

      {/* Timer Buttons */}
      <div className="timer-buttons" style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <button onClick={() => setIsRunning(!isRunning)} className="start">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleStop} className="stop">Stop</button>
      </div>

      {/* Dropdown for selecting preset */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ marginRight: '8px' }}>Select Timer:</label>
        <select
          value={currentPreset.label}
          onChange={(e) => {
            const selected = presets.find(p => p.label === e.target.value);
            setCurrentPreset(selected);
            setSeconds(0);
            setIsRunning(false);
          }}
        >
          {presets.map(p => (
            <option key={p.label} value={p.label}>{p.label} ({p.seconds / 60} min)</option>
          ))}
        </select>
      </div>

      {/* Completed Sessions */}
      <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#6b7280' }}>
        Completed sessions: {sessionsCompleted}
      </div>
    </div>
  );
};

export default Timer;
