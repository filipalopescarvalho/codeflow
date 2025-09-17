import React, { useState, useEffect } from "react";
import './App.css';
import Task from './components/Task';

const App = () => {
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) || []);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate] = useState(selectedDate);
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState("");

  // GitHub credentials
  const [githubUsername, setGithubUsername] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubToken, setGithubToken] = useState("");

  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => { localStorage.setItem('todos', JSON.stringify(todos)); }, [todos]);

  // Add / Edit task
  const addTodo = () => {
    if (!inputValue.trim()) return;

    if (todos.some(t => t.editing)) {
      setTodos(todos.map(t =>
        t.editing ? { ...t, title: inputValue, priority, tags: tags.split(",").map(tag => tag.trim()).filter(Boolean), editing: false } : t
      ));
    } else {
      const newTodo = {
        id: Date.now(),
        title: inputValue,
        date: selectedDate,
        priority,
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean)
      };
      setTodos([...todos, newTodo]);
    }

    setInputValue("");
    setTags("");
    setPriority("Medium");
  };

  // Remove task
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    localStorage.removeItem(`metrics-${id}`);
    localStorage.removeItem(`timer-${id}`);
  };

  // Start editing task
  const editTodo = (task) => {
    setInputValue(task.title);
    setTags(task.tags.join(", "));
    setPriority(task.priority);
    setTodos(todos.map(t => t.id === task.id ? { ...t, editing: true } : t));
  };

  // Filter tasks
  const [filterPriority, setFilterPriority] = useState("");
  const [filterTag, setFilterTag] = useState("");

  const tasksForDay = todos.filter(todo => {
    if (todo.date !== filterDate) return false;
    if (filterPriority && todo.priority !== filterPriority) return false;
    if (filterTag && !todo.tags.includes(filterTag)) return false;
    return true;
  });

  // --- GitHub Sync Utilities ---
  const FETCH_FROM_GITHUB = async (username, repo, token) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/tasks.json`, {
        headers: { Authorization: `token ${token}` },
      });

      if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);

      const data = await res.json();
      const content = data.content ? atob(data.content) : "[]";
      return JSON.parse(content);
    } catch (err) {
      console.error("❌ Failed to fetch from GitHub", err);
      return [];
    }
  };

  const _pushToGitHub = async (username, repo, token, todos, commitMessage = "Update tasks") => {
    try {
      const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/tasks.json`, {
        headers: { Authorization: `token ${token}` },
      });
      const data = await res.json();
      const sha = data.sha;

      const body = {
        message: commitMessage,
        content: btoa(JSON.stringify(todos, null, 2)),
        sha,
      };

      const putRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/tasks.json`, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!putRes.ok) throw new Error(`GitHub push failed: ${putRes.status}`);
      return await putRes.json();
    } catch (err) {
      console.error("❌ Failed to push to GitHub", err);
    }
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Code Flow</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      {/* Filters */}
      <div className="filter-container">
        <label>
          Priority:
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label>
          Tag:
          <input type="text" placeholder="Filter by tag" value={filterTag} onChange={e => setFilterTag(e.target.value)} />
        </label>
      </div>

{/* GitHub Sync Section */}
<div className="github-sync" style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
  <input
    type="text"
    placeholder="GitHub Username"
    value={githubUsername}
    onChange={e => setGithubUsername(e.target.value)}
  />
  <input
    type="text"
    placeholder="Repository Name"
    value={githubRepo}
    onChange={e => setGithubRepo(e.target.value)}
  />
  <input
    type="password"
    placeholder="Personal Access Token"
    value={githubToken}
    onChange={e => setGithubToken(e.target.value)}
  />
  <button onClick={async () => {
    const githubTasks = await FETCH_FROM_GITHUB(githubUsername, githubRepo, githubToken);
    if (githubTasks.length) setTodos([...todos, ...githubTasks]);
  }}>Fetch from GitHub</button>

  <button onClick={async () => {
    if (githubUsername && githubRepo && githubToken) {
      await _pushToGitHub(githubUsername, githubRepo, githubToken, todos);
      alert("Tasks pushed to GitHub successfully!");
    } else {
      alert("Please fill in all GitHub fields.");
    }
  }}>Push to GitHub</button>
</div>

      {/* Task input */}
      <div className="input-container">
        <input type="text" placeholder="Add a new task" value={inputValue} onChange={e => setInputValue(e.target.value)} />
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
        <button onClick={addTodo}>{todos.some(t => t.editing) ? "Update Task" : "Add Task"}</button>
      </div>

      {/* Tasks */}
      {tasksForDay.length === 0 && <p>No tasks for this day. Add one!</p>}
      {tasksForDay.map(todo => (
        <div key={todo.id} className="task-wrapper">
          <Task task={todo} />
          <div className="task-buttons">
            <button onClick={() => editTodo(todo)}>Edit</button>
            <button className="remove-btn" onClick={() => removeTodo(todo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
