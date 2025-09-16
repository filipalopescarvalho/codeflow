import React, { useState, useEffect } from "react";
import './App.css';
import Task from './components/Task';
import { syncToGitHubRepo, fetchFromGitHubRepo } from "./utils/githubUtils";

const App = () => {
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) || []);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate, setFilterDate] = useState(selectedDate);

  const [githubToken, setGithubToken] = useState("");
  const [repo, setRepo] = useState("");
  const [owner, setOwner] = useState("");

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

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

  // GitHub sync handlers
  const handleRepoSync = async () => {
    if (!githubToken || !owner || !repo) {
      alert("Please provide GitHub username, repository, and token.");
      return;
    }
    try {
      await syncToGitHubRepo({ todos, token: githubToken, owner, repo });
      alert("✅ Tasks synced to your GitHub repo!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to sync with GitHub");
    }
  };

  const handleRepoFetch = async () => {
    if (!githubToken || !owner || !repo) {
      alert("Please provide GitHub username, repository, and token.");
      return;
    }
    try {
      const remoteTodos = await fetchFromGitHubRepo({ token: githubToken, owner, repo });
      setTodos(remoteTodos);
      alert("✅ Tasks fetched from GitHub repo!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch from GitHub");
    }
  };

  return (
    <div className="container">
      <h1>Code Flow</h1>

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

      <div style={{ marginBottom: '15px' }}>
        <label>View tasks for: </label>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
      </div>

      {tasksForDay.length === 0 && <p>No tasks for this day. Add one!</p>}
      {tasksForDay.map(todo => (
        <div key={todo.id} className="task-wrapper">
          <Task task={todo} />
          <button className="remove-btn" onClick={() => removeTodo(todo.id)}>X</button>
        </div>
      ))}

      <div className="github-sync">
        <h2>Sync Tasks to GitHub</h2>
        <input
          type="text"
          placeholder="GitHub Username"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <input
          type="text"
          placeholder="Repository Name"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
        <input
          type="password"
          placeholder="GitHub Token"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
        />
        <div className="github-buttons">
          <button onClick={handleRepoSync}>Sync to Repo</button>
          <button onClick={handleRepoFetch}>Fetch from Repo</button>
        </div>
      </div>
    </div>
  );
};

export default App;
