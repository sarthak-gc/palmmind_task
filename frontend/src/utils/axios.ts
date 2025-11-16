import a from "axios";
import { BACKEND_URL } from "./constants";

export const axios = a.create({
  baseURL: BACKEND_URL,
});
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
