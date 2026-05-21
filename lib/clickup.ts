const CLICKUP_API_URL = "https://api.clickup.com/api/v2";

function getClickUpToken() {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    throw new Error("Missing CLICKUP_API_TOKEN in environment variables.");
  }

  return token;
}

async function clickupRequest(endpoint: string, options: RequestInit = {}) {
  const token = getClickUpToken();
  const res = await fetch(`${CLICKUP_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: token,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`ClickUp API error: ${res.status} ${res.statusText} - ${errorBody}`);
  }

  return res.json();
}

export async function createClickUpTask(listId: string, name: string, description: string) {
  return clickupRequest(`/list/${listId}/task`, {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
    }),
  });
}

export async function addClickUpComment(taskId: string, comment: string) {
  return clickupRequest(`/task/${taskId}/comment`, {
    method: "POST",
    body: JSON.stringify({
      comment_text: comment,
      notify_all: false,
    }),
  });
}

// Example usage (to be called from server actions or API routes):
// await createClickUpTask("LIST_ID", "PR: Add new feature", "Automated task for PR #123");
// await addClickUpComment("TASK_ID", "Review comment from GitHub");
