import { Router } from "express";
import * as deviceController from "../controllers/deviceController.js";

const router = Router();

router.get("/dispositivos", deviceController.getAllDevices);

router.get("/dispositivos/:id", deviceController.getDeviceById);

router.post("/dispositivos", deviceController.createDevice);

router.patch("/dispositivos/:id", deviceController.updateDevice);

export default router;
