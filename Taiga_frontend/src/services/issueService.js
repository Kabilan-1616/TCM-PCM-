// Taiga_frontend/src/services/issueService.js
// ─────────────────────────────────────────────────────────────
// Issue service — all writes use the unified DB status strings
// (OPEN | IN_PROGRESS | RESOLVED | CLOSED).
// labelToStatus() is used before every write so callers can
// pass either a UI label or a raw DB value safely.
// ─────────────────────────────────────────────────────────────
import { authFetch } from "../utils/authFetch";
import { labelToStatus, statusToLabel } from "./statusMapping";

/* ── internal helper: normalise status before sending to API ── */
const normaliseOutgoing = (data) => {
  if (!data) return data;
  const copy = { ...data };
  if (copy.status) {
    // If someone passes "In Progress" we convert to "IN_PROGRESS", etc.
    copy.status = labelToStatus(copy.status) || copy.status;
  }
  return copy;
};

/* ── internal helper: normalise status on data received from API ── */
const normaliseIncoming = (issue) => {
  if (!issue) return issue;
  return {
    ...issue,
    statusLabel: statusToLabel(issue.status),   // convenience display field
  };
};

/* ================= GET PROJECT ISSUES ================= */
export const getProjectIssues = async (slug) => {
  const res = await authFetch(`/issues/?project_slug=${slug}`);
  if (Array.isArray(res)) return res.map(normaliseIncoming);
  return res;
};

/* ================= GET SINGLE ISSUE ================= */
export const getIssue = async (id) => {
  const res = await authFetch(`/issues/${id}/`);
  return normaliseIncoming(res);
};

/* ================= CREATE ISSUE ================= */
export const createIssue = async (data) =>
  await authFetch("/issues/", {
    method: "POST",
    body: JSON.stringify(normaliseOutgoing(data)),
  });

/* ================= UPDATE ISSUE ================= */
export const updateIssue = async (id, data) =>
  await authFetch(`/issues/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(normaliseOutgoing(data)),
  });

/* ================= DELETE ISSUE ================= */
export const deleteIssue = async (id) =>
  await authFetch(`/issues/${id}/`, { method: "DELETE" });