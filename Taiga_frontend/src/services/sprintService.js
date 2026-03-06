// import { authFetch } from "./authFetch";

// /* ================= GET ALL SPRINTS (by project) ================= */

// export const getSprints = async (projectSlug) => {
//   const res = await authFetch(`/sprints/?project_slug=${projectSlug}`);

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to fetch all sprints");
//   }

//   return await res.json();
// };

// /* ================= GET SINGLE SPRINT ================= */

// export const getSprint = async (id) => {
//   const res = await authFetch(`/sprints/${id}/`);

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to fetch sprint");
//   }

//   return await res.json();
// };

// /* ================= CREATE SPRINT ================= */

// export const createSprint = async (data) => {
//   const res = await authFetch("/sprints/", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to create sprint");
//   }

//   return await res.json();
// };

// /* ================= UPDATE SPRINT ================= */

// export const updateSprint = async (id, data) => {
//   const res = await authFetch(`/sprints/${id}/`, {
//     method: "PATCH",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to update sprint");
//   }

//   return await res.json();
// };

// /* ================= DELETE SPRINT ================= */

// export const deleteSprint = async (id) => {
//   const res = await authFetch(`/sprints/${id}/`, {
//     method: "DELETE",
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to delete sprint");
//   }

//   return true;
// };

import { authFetch } from "./authFetch";

/* ================= GET ALL SPRINTS ================= */

export const getSprints = async (projectSlug) =>
  await authFetch(`/sprints/?project_slug=${projectSlug}`);

/* ================= GET SINGLE SPRINT ================= */

export const getSprint = async (id) =>
  await authFetch(`/sprints/${id}/`);

/* ================= CREATE SPRINT ================= */

export const createSprint = async (data) =>
  await authFetch("/sprints/", {
    method: "POST",
    body: JSON.stringify(data),
  });

/* ================= UPDATE SPRINT ================= */

export const updateSprint = async (id, data) =>
  await authFetch(`/sprints/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

/* ================= DELETE SPRINT ================= */

export const deleteSprint = async (id) => {
  const response = await authFetch(`/sprints/${id}/`, {
    method: "DELETE",
  });
  // Handle both 200 (with body) and 204 (no content) responses
  return true;
};