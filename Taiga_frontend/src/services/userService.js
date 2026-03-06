import { authFetch } from "./authFetch";

/* ================= GET ALL USERS ================= */

export const getUsers = async () =>
  await authFetch("/users/");

/* ================= GET CURRENT USER ================= */

export const getCurrentUser = async () =>
  await authFetch("/users/me/");