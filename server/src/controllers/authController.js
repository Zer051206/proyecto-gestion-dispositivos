import * as userService from "../services/userService.js";
import { loginSchema } from "../schemas/userSchema.js";

export const loginUser = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await userService.loginUser(validatedData);

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await userService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: "Token renovado exitosamente.",
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await userService.logoutUser(refreshToken);

    res.status(200).json({
      message: "Logout exitoso",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
};
