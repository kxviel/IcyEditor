import axios from "axios";
import { env } from "./env";
import { toast } from "sonner";

const http = axios.create({
  baseURL: env.API_URL,
});

// Request Interceptor
http.interceptors.request.use((req) => {
  const user = localStorage.getItem(env.LOCALSTORAGE_IDENTIFIER);
  const token = user ? JSON.parse(user).token : "";

  req.headers.Authorization = token ? `Bearer ${token}` : "";

  return req;
});

// Response Interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      toast.warning("Unauthorized, logging out ...");
      localStorage.clear();
      window.location.href = "/login";
    } else {
      return Promise.reject(error?.response.data?.message);
    }
  },
);

export default http;
