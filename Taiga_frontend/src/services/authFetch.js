const API_BASE = "http://127.0.0.1:8000/api";

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("access");

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Something went wrong");
  }

  // Handle 204 No Content (common for DELETE operations)
  if (response.status === 204) {
    return null;
  }

  // Try to parse JSON, but handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  return response.text();
}
