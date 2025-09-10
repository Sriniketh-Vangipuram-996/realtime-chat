import axios from "axios";

const API = axios.create({
  baseURL: '/api',
  withCredentials: true // ⬅️ send cookies automatically
});

export default API;
