"use client";

export function getAdminBackendUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return "https://api.grind.org.in/v1/api";
  }

  return "http://localhost:5000/v1/api";
}

export function readStoredAdminToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    window.localStorage.getItem("adminToken") ||
    window.localStorage.getItem("token") ||
    ""
  );
}

export async function readJsonResponse<T>(response: Response) {
  return (await response.json().catch(() => null)) as T | null;
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = readStoredAdminToken();
  if (!token) {
    throw new Error("Admin token not found. Please sign in again.");
  }

  const response = await fetch(`${getAdminBackendUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      token,
      ...(init?.headers ?? {}),
    },
  });

  const json = await readJsonResponse<T & { message?: string; success?: boolean }>(
    response,
  );

  if (!response.ok || (json && "success" in json && json.success === false)) {
    throw new Error(json?.message || "Request failed.");
  }

  if (!json) {
    throw new Error("Empty response from server.");
  }

  return json;
}
