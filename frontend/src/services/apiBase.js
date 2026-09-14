//Where the API lives.
//
//In development this stays empty, so every request is a relative path and the
//Vite proxy forwards it to localhost:4000 - same origin, no CORS involved.
//
//In production the API is on its own domain, so VITE_API_URL must be set at
//build time (Vite inlines it; it is not read at runtime). Set it to the API
//origin with no trailing slash, e.g. https://api.example.com
const configured = import.meta.env.VITE_API_URL ?? "";

export const API_BASE = configured.replace(/\/+$/, "");
