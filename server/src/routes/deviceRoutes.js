import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import * as deviceController from "../controllers/deviceController.js";

const router = Router();

router.get("/historial", authMiddleware, deviceController.getDeviceHistorial());

router.patch(
  "/historial/actualizar",
  authMiddleware,
  deviceController.updateDevice()
);
