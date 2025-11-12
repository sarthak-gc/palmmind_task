import a from "axios";
import { BACKEND_URL } from "./constants";

const token = localStorage.getItem("token");
export const axios = a.create({
  baseURL: BACKEND_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
