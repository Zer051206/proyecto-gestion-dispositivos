import * as apiService from "../services/apiService.js";

export const getAssets = async (req, res, next) => {
  try {
    const user = req.user;
    const assets = await apiService.getAssets(user);
    return res.status(200).json({
      message: "Activos obtenidos exitosamente.",
      success: true,
      assets: assets
    })
  } catch (error) {
    next(error);
  }
};
