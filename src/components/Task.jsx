import React, { useState } from 'react';
import Timer from './Timer';
import Metrics from './Metrics';
import { getMetrics, saveMetrics } from '../utils/metricsUtils';

const Task = ({ task }) => {
  const savedMetrics = getMetrics(task.id);
  const [totalTime, setTotalTime] = useState(savedMetrics.totalTime ?? 0);
  const [sessions, setSessions] = useState(savedMetrics.sessions ?? 0);

  const handleSessionEnd = (taskId, duration) => {
    const newTotalTime = totalTime + duration;
    const newSessions = sessions + 1;

    setTotalTime(newTotalTime);
    setSessions(newSessions);

    saveMetrics(taskId, { totalTime: newTotalTime, sessions: newSessions });
  };

  return (
    <div className="task">
      <h3>{task.title}</h3>
      <Timer taskId={task.id} onSessionEnd={handleSessionEnd} />
      <Metrics totalTime={totalTime} sessions={sessions} />
    </div>
  );
};

export default Task;
