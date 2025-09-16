export const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };
  
  export const saveTimer = (taskId, seconds) => {
    localStorage.setItem(`timer-${taskId}`, JSON.stringify({ seconds }));
  };
  
  export const loadTimer = (taskId) => {
    const data = localStorage.getItem(`timer-${taskId}`);
    return data ? JSON.parse(data).seconds : 0;
  };
  
  export const resetTimer = (taskId) => {
    localStorage.removeItem(`timer-${taskId}`);
  };
  