const API_BASE = "http://127.0.0.1:8000/api";

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await response.json();

  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  return data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
