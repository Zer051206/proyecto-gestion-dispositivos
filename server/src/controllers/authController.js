import { loginSchema, registerSchema } from "../schemas/authSchema.js";
import * as authService from "../services/authService.js";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../config/cookie.config.js";

export const registerUser = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const newUser = await authService.registerUser(validatedData);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const validateData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validateData);

    res.cookie("accessToken", result.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.cookie(
      "refreshToken",
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.refreshAccessToken(refreshToken);

    // Establecer nuevo Access Token (15 minutos)
    res.cookie("accessToken", result.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

    res.status(200).json({
      message: "Token renovado exitosamente.",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.logoutUser(refreshToken);

    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.status(200).json({
      message: "logout exitoso",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
};
