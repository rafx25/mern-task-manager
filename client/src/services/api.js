import axios from "axios";

export const api = axios.create({
  baseURL: "/api",

  // Without this, the browser drops the auth cookie on every request.
  withCredentials: true,

  headers: { "Content-Type": "application/json" },
});

// The API always answers with { success, data } or { success, message }, so
// components can work with the payload instead of unwrapping every response.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? "Something went wrong. Please try again.";

    return Promise.reject({
      status: error.response?.status,
      message,
    });
  },
);
