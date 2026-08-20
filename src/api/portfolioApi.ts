import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

export async function getPortfolio() {
  const { data } = await api.get("/portfolio");
  return data;
}

export async function sendChat(message: string) {
  const { data } = await api.post("/chat", { message });
  return data;
}
