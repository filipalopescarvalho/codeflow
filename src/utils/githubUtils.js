export async function syncToGitHubRepo({ todos, token, owner, repo }) {
    const filePath = "tasks.json";
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  
    const content = btoa(JSON.stringify(todos, null, 2));
  
    const checkRes = await fetch(url, {
      headers: { Authorization: `token ${token}` }
    });
  
    let sha;
    if (checkRes.ok) {
      const data = await checkRes.json();
      sha = data.sha;
    }
  
    const body = {
      message: "Sync tasks from TodoApp",
      content,
      sha 
    };
  
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  
    if (!response.ok) throw new Error("GitHub sync failed");
  
    return response.json();
  }
  
  export async function fetchFromGitHubRepo({ token, owner, repo }) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/tasks.json`;
  
    const response = await fetch(url, {
      headers: { Authorization: `token ${token}` }
    });
  
    if (!response.ok) throw new Error("GitHub fetch failed");
  
    const data = await response.json();
    const decoded = atob(data.content);
    return JSON.parse(decoded);
  }
  