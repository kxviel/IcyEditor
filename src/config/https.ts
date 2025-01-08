import axios from "axios";
import { env } from "./env";

const http = axios.create({
  baseURL: env.API_URL,
});

// Request Interceptor
http.interceptors.request.use((req) => {
  const token = document.cookie.split("=")[1];
  req.headers.Authorization = token ? `Bearer ${token}` : "";

  return req;
});

// Response Interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      // message.warning("Unauthorized, logging out ...");
      window.location.href = "/auth";
    } else {
      console.log(error?.response.data?.error);

      return Promise.reject(error?.response.data?.message[0]);
    }
  }
);

export default http;
