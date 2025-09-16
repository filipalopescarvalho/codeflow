import React, { useState, useEffect } from "react";
import './App.css';
import Task from './components/Task';

const App = () => {
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) || []);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate, setFilterDate] = useState(selectedDate);

  // Persist todos
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new task
  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo = {
      id: Date.now(),
      title: inputValue,
      date: selectedDate
    };
    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  // Remove a task
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    localStorage.removeItem(`metrics-${id}`);
    localStorage.removeItem(`timer-${id}`);
  };

  // Filter tasks for the selected day
  const tasksForDay = todos.filter(todo => todo.date === filterDate);

  return (
    <div className="container">
      <h1>Code Flow </h1>

      {/* Task input */}
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Add a new task"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
        <button onClick={addTodo}>Add Task</button>
      </div>

      {/* Calendar filter */}
      <div style={{ marginBottom: '15px' }}>
        <label>View tasks for: </label>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
      </div>

      {/* Tasks */}
      {tasksForDay.length === 0 && <p>No tasks for this day. Add one!</p>}
      {tasksForDay.map(todo => (
        <div key={todo.id} className="task-wrapper">
          <Task task={todo} />
          <button className="remove-btn" onClick={() => removeTodo(todo.id)}>X</button>
        </div>
      ))}
    </div>
  );
};

export default App;
