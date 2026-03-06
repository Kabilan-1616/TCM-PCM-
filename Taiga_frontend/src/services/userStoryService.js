// // 

// import { authFetch } from "./authFetch";

// /* ================= GET SINGLE STORY ================= */

// export const getStory = async (id) => {
//   const res = await authFetch(`/userstories/${id}/`);

//   if (!res.ok) {
//      const err = await res.json();
//     throw new Error(err.detail || "Failed to fetch backlog stories");
//   }

//   return await res.json();
// };

// /* ================= GET BACKLOG STORIES ================= */

// export const getBacklogStories = async (slug) => {
//   const res = await authFetch(
//     `/userstories/?project_slug=${slug}&sprint_isnull=true`
//   );

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to fetch backlog stories");
//   }

//   return await res.json();
// };

// /* ================= GET STORIES IN SPRINT ================= */

// export const getSprintStories = async (slug, sprintId) => {
//   const res = await authFetch(
//     `/userstories/?project_slug=${slug}&sprint=${sprintId}`
//   );

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to fetch stories in sprint");
//   }

//   return await res.json();
// };

// /* ================= CREATE STORY ================= */

// export const createStory = async (data) => {
//   const res = await authFetch("/userstories/", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to create story");
//   }

//   return await res.json();
// };

// /* ================= UPDATE STORY ================= */

// export const updateStory = async (id, data) => {
//   const res = await authFetch(`/userstories/${id}/`, {
//     method: "PATCH",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to update stories");
//   }

//   return await res.json();
// };

// /* ================= DELETE STORY ================= */

// export const deleteStory = async (id) => {
//   const res = await authFetch(`/userstories/${id}/`, {
//     method: "DELETE",
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to fetch delete story");
//   }

//   return true;
// };
import { authFetch } from "./authFetch";

/* ================= GET SINGLE STORY ================= */

export const getStory = async (id) =>
  await authFetch(`/userstories/${id}/`);

/* ================= GET BACKLOG STORIES ================= */

export const getBacklogStories = async (slug) =>
  await authFetch(
    `/userstories/?project_slug=${slug}&sprint_isnull=true`
  );

/* ================= GET STORIES IN SPRINT ================= */

export const getSprintStories = async (slug, sprintId) =>
  await authFetch(
    `/userstories/?project_slug=${slug}&sprint=${sprintId}`
  );

/* ================= CREATE STORY ================= */

export const createStory = async (data) =>
  await authFetch("/userstories/", {
    method: "POST",
    body: JSON.stringify(data),
  });

/* ================= UPDATE STORY ================= */

export const updateStory = async (id, data) =>
  await authFetch(`/userstories/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

/* ================= DELETE STORY ================= */

export const deleteStory = async (id) => {
  const response = await authFetch(`/userstories/${id}/`, {
    method: "DELETE",
  });
  // Handle both 200 (with body) and 204 (no content) responses
  return response;
};