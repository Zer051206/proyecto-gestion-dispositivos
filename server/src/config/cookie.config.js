export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true, // No accesible por JavaScript (Seguridad XSS)
  path: "/",
  secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 15 * 60 * 1000, // 15 minutos
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
};
