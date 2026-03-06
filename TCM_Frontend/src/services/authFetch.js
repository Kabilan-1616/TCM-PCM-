// TCM_Frontend/src/services/authFetch.js

const BASE_URL = "http://127.0.0.1:8001";

export const authFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  // Get token from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token || user?.access || "";

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;
  if (response.status === 401) throw new Error("Unauthorized — please log in again");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
};