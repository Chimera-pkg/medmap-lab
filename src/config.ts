const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const API_URL = `${BASE_API_URL}/v1`;

export const CHAINMARKX_BASE_URL =
import.meta.env.VITE_CHAINMARKX_BASE_URL ?? "http://localhost:5000";
export const CHAINMARKX_USER_ID = import.meta.env.VITE_CHAINMARKX_USER_ID ?? "";
