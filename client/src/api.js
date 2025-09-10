import axios from "axios";

const API = axios.create({
  baseURL: '',
  withCredentials: true // ⬅️ send cookies automatically
});

export default API;
