import axios from "axios";

export const BASE_URL =
    (import.meta.env?.VITE_STRAPI_URL ?? "http://localhost:1337").replace(/\/+$/, "");

export const API_URL = `${BASE_URL}/api`;   // para endpoints JSON
export const ASSETS_URL = BASE_URL;         // para archivos /uploads/*

const api = axios.create({ baseURL: API_URL });
export default api;
