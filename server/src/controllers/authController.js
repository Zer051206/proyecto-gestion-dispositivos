import * as authService from "../services/authService.js";
import { registerAdminSchema, loginSchema } from "../schemas/authSchema.js";

export const registerAdmin = async (req, res, next) => {
  try {
    const validatedData = registerAdminSchema.parse(req.body);
    const newAdmin = await authService.registerAdmin(validatedData);
    res.status(201).json(newAdmin);
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginAdmin(validatedData);

    // ¡CORREGIDO! YA NO ESTABLECEMOS COOKIES.
    // Los tokens ahora viajan en el cuerpo de la respuesta JSON.
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      admin: result.admin,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    // ¡CORREGIDO! Leemos el refreshToken del BODY, no de las cookies.
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);

    // Devolvemos el nuevo accessToken en el cuerpo del JSON.
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logoutAdmin(refreshToken);

    res.status(200).json({
      message: "Logout exitoso",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = (req, res) => {
  // El middleware ya nos da req.admin. Solo lo devolvemos.
  res.status(200).json({ authenticated: true, admin: req.admin });
};
