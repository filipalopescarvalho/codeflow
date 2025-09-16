export const getMetrics = (taskId) => {
    const data = localStorage.getItem(`metrics-${taskId}`);
    return data ? JSON.parse(data) : { totalTime: 0, sessions: 0 };
  };
  
  export const saveMetrics = (taskId, metrics) => {
    localStorage.setItem(`metrics-${taskId}`, JSON.stringify(metrics));
  };
  