// // import { authFetch } from "./authFetch";

// // export const getProjects = () =>
// //   authFetch("/projects/");

// // export const createProject = (data) =>
// //   authFetch("/projects/", {
// //     method: "POST",
// //     body: JSON.stringify(data),
// //   });

// import { authFetch } from "./authFetch";

// export const getProjects = async () => {
//   const res = await authFetch("/projects/");

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to fetch projects");
//   }

//   return await res.json();  // return array
// };

// export const createProject = async (data) => {
//   const res = await authFetch("/projects/", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to create project");
//   }

//   return await res.json();  // return created project
// };
import { authFetch } from "./authFetch";

export const getProjects = async () => {
  return await authFetch("/projects/");
};

export const createProject = async (data) => {
  return await authFetch("/projects/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ✅ NEW — fetch project detail (includes tcm_issues)
export const getProjectBySlug = async (slug) => {
  return await authFetch(`/projects/?slug=${slug}`);
};