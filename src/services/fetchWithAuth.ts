// services/fetchWithAuth.ts
import { useAuthStore } from "../features/auth/store/store";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  includeContentType: boolean = true
): Promise<Response> {
  const token = useAuthStore.getState().token;

  // Obtener encabezados base (si se incluye Content-Type)
  const baseHeaders: Record<string, string> = includeContentType
    ? { "Content-Type": "application/json" }
    : {};

  // Obtener encabezados existentes en options, sin importar si es Headers, objeto o undefined
  let existingHeaders: Record<string, string> = {};

  if (options.headers instanceof Headers) {
    existingHeaders = Object.fromEntries(options.headers.entries());
  } else if (typeof options.headers === "object" && options.headers !== null) {
    existingHeaders = options.headers as Record<string, string>;
  }

  // Unir encabezados
  const headers: Record<string, string> = {
    ...baseHeaders,
    ...existingHeaders,
  };

  // Agregar Authorization si hay token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ejecutar fetch final
  return fetch(url, {
    ...options,
    headers,
  });
}
