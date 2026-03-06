// Taiga_frontend/src/services/statusMapping.js
// ─────────────────────────────────────────────────────────────
// Unified status utilities.
//
// The shared 'issues' table stores AL TCMS VARCHAR statuses:
//   OPEN | IN_PROGRESS | RESOLVED | CLOSED
//
// Taiga's UI previously used numeric codes (1-4).  The maps
// below let both frontends translate between the two without
// touching the stored value.
// ─────────────────────────────────────────────────────────────

// ── Canonical DB values (AL TCMS master) ─────────────────────
export const DB_STATUS = {
  OPEN:        "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED:    "RESOLVED",
  CLOSED:      "CLOSED",
};

// ── Display label for each DB value ──────────────────────────
export const STATUS_TO_LABEL = {
  OPEN:        "New",
  IN_PROGRESS: "In Progress",
  RESOLVED:    "Ready For Test",
  CLOSED:      "Closed",
};

// ── Reverse: Taiga UI label → DB value ───────────────────────
export const LABEL_TO_STATUS = {
  "New":           "OPEN",
  "In Progress":   "IN_PROGRESS",
  "Ready For Test":"RESOLVED",
  "Ready for Test":"RESOLVED",   // tolerate either capitalisation
  "Closed":        "CLOSED",
  "Done":          "CLOSED",    // legacy alias
};

// ── Legacy numeric maps (kept for any code still using them) ──
// Numeric → DB string
export const NUMBER_TO_STATUS = {
  1: "OPEN",
  2: "IN_PROGRESS",
  3: "RESOLVED",
  4: "CLOSED",
};

// DB string → numeric (for components that render a step indicator etc.)
export const STATUS_TO_NUMBER = {
  OPEN:        1,
  IN_PROGRESS: 2,
  RESOLVED:    3,
  CLOSED:      4,
};

// ── Helper functions ─────────────────────────────────────────

/** Returns the human-readable label for a DB status string. */
export const statusToLabel = (dbStatus = "") =>
  STATUS_TO_LABEL[dbStatus] ?? dbStatus;

/** Returns the DB status string for a human-readable label. */
export const labelToStatus = (label = "") =>
  LABEL_TO_STATUS[label] ?? "OPEN";

/** Legacy shim — converts old numeric status to DB string. */
export const numberToStatusString = (num) =>
  NUMBER_TO_STATUS[num] ?? "OPEN";

/** Legacy shim — converts DB string to numeric step index. */
export const stringToStatusNumber = (dbStatus) =>
  STATUS_TO_NUMBER[dbStatus] ?? 1;

// ── Slug helper (unchanged) ───────────────────────────────────
export const createSlug = (title = "") =>
  title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");