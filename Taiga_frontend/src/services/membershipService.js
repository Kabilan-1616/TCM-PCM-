import { authFetch } from "./authFetch";

/* ================= ADD MEMBER ================= */

export const addMember = async (data) =>
  await authFetch("/memberships/", {
    method: "POST",
    body: JSON.stringify(data),
  });

/* ================= GET PROJECT MEMBERS ================= */

export const getProjectMembers = async (projectId) =>
  await authFetch(`/memberships/?project=${projectId}`);

/* ================= REMOVE MEMBER ================= */

export const removeMember = async (id) => {
  const response = await authFetch(`/memberships/${id}/`, {
    method: "DELETE",
  });
  // Handle both 200 (with body) and 204 (no content) responses
  return response;
};