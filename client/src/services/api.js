import axios from "axios";

export const api = axios.create({
  baseURL: "/api",

  // Without this, the browser drops the auth cookie on every request.
  withCredentials: true,

  headers: { "Content-Type": "application/json" },
});

// Endpoints that must not trigger a refresh: /refresh failing is the signal
// that the session is gone, and retrying it would loop.
const NO_RETRY = ["/auth/refresh", "/auth/login", "/auth/register"];

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const request = error.config;
    const status = error.response?.status;

    const shouldRefresh = status === 401 && request && !request._retried && !NO_RETRY.some((path) => request.url?.includes(path));

    if (shouldRefresh) {
      request._retried = true;

      try {
        // Several requests can expire together. They share one refresh call
        // instead of each spending a rotation and tripping reuse detection.
        refreshPromise = refreshPromise ?? api.post("/auth/refresh");
        await refreshPromise;

        return api(request);
      } catch {
        window.location.href = "/login";
        return Promise.reject({ status: 401, message: "Your session has expired" });
      } finally {
        refreshPromise = null;
      }
    }

    const message = error.response?.data?.message ?? "Something went wrong. Please try again.";

    return Promise.reject({ status, message });
  },
);
