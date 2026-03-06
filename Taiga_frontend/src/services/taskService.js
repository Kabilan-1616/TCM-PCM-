// // // import { authFetch } from "./authFetch";

// // // export const getTasksByStory = (storyId) =>
// // //   authFetch(`/tasks/?user_story=${storyId}`);

// // // export const createTask = (data) =>
// // //   authFetch(`/tasks/`, {
// // //     method: "POST",
// // //     body: JSON.stringify(data),
// // //   });

// // // export const updateTask = (id, data) =>
// // //   authFetch(`/tasks/${id}/`, {
// // //     method: "PATCH",
// // //     body: JSON.stringify(data),
// // //   });

// // import { authFetch } from "./authFetch";

// // export const getTasksByStory = async (storyId) => {
// //   const res = await authFetch(`/tasks/?user_story=${storyId}`);

// //   if (!res.ok) {
// //     const err = await res.json();
// //     throw new Error(err.detail || "Failed to fetch tasks");
// //   }

// //   return await res.json();  // return array
// // };

// // export const createTask = async (data) => {
// //   const res = await authFetch("/tasks/", {
// //     method: "POST",
// //     body: JSON.stringify(data),
// //   });

// //   if (!res.ok) {
// //     const err = await res.json();
// //     throw new Error(err.detail || "Failed to create task");
// //   }

// //   return await res.json();  // return created task
// // };

// import { authFetch } from "./authFetch";

// /* ================= GET TASKS BY STORY ================= */

// export const getTasksByStory = async (storyId) => {
//   const res = await authFetch(`/tasks/?user_story=${storyId}`);

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to fetch tasks");
//   }

//   return await res.json();
// };

// /* ================= CREATE TASK ================= */

// export const createTask = async (data) => {
//   const res = await authFetch("/tasks/", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to create task");
//   }

//   return await res.json();
// };

// /* ================= UPDATE TASK ================= */

// export const updateTask = async (taskId, data) => {
//   const res = await authFetch(`/tasks/${taskId}/`, {
//     method: "PATCH",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to update task");
//   }

//   return await res.json();
// };

// /* ================= DELETE TASK ================= */

// export const deleteTask = async (taskId) => {
//   const res = await authFetch(`/tasks/${taskId}/`, {
//     method: "DELETE",
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to delete task");
//   }

//   return true;
// };
import { authFetch } from "./authFetch";

/* ================= GET TASKS BY STORY ================= */

export const getTasksByStory = async (storyId) =>
  await authFetch(`/tasks/?user_story=${storyId}`);

/* ================= GET MY TASKS ================= */

export const getMyTasks = async () =>
  await authFetch(`/tasks/my/`);

/* ================= CREATE TASK ================= */

export const createTask = async (data) =>
  await authFetch("/tasks/", {
    method: "POST",
    body: JSON.stringify(data),
  });

/* ================= UPDATE TASK ================= */

export const updateTask = async (taskId, data) =>
  await authFetch(`/tasks/${taskId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

/* ================= DELETE TASK ================= */

export const deleteTask = async (taskId) => {
  const response = await authFetch(`/tasks/${taskId}/`, {
    method: "DELETE",
  });
  // Handle both 200 (with body) and 204 (no content) responses
  return response;
};