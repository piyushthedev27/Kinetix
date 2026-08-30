import { getToken } from "./session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  console.warn("NEXT_PUBLIC_API_URL is not defined in environment variables");
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    if (!response.ok) throw new Error("An error occurred");
    return null;
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
}

export async function sendOtp(email: string) {
  return fetchApi("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(email: string, otp: string) {
  return fetchApi("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function resendOtp(email: string) {
  return fetchApi("/api/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getCurrentUser() {
  return fetchApi("/api/auth/me", {
    method: "GET",
  });
}
