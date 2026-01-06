import axios from "axios";

// Force IPv4 for localhost to avoid Node 18+ IPv6 issues
const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
const baseUrl = rawBaseUrl.replace("localhost", "127.0.0.1");
const BASE_API_URL = baseUrl + "/api/v1";

export const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" }
});
