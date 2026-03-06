// ALTCMS_frontend/src/services/statusMapping.js
// ─────────────────────────────────────────────────────────────
// AL TCMS frontend — same unified status vocabulary.
// AL TCMS already used the correct DB strings natively, so
// this is mostly additive (display helpers + slug util).
// ─────────────────────────────────────────────────────────────

export const DB_STATUS = {
  OPEN:        "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED:    "RESOLVED",
  CLOSED:      "CLOSED",
};

export const STATUS_TO_LABEL = {
  OPEN:        "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED:    "Resolved",
  CLOSED:      "Closed",
};

export const LABEL_TO_STATUS = {
  "Open":        "OPEN",
  "In Progress": "IN_PROGRESS",
  "Resolved":    "RESOLVED",
  "Closed":      "CLOSED",
};

/** Human-readable label for a DB status string. */
export const statusToLabel = (dbStatus = "") =>
  STATUS_TO_LABEL[dbStatus] ?? dbStatus;

/** DB status string from a human-readable label. */
export const labelToStatus = (label = "") =>
  LABEL_TO_STATUS[label] ?? "OPEN";

export const createSlug = (title = "") =>
  title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");