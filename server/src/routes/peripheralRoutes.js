import { Router } from "express";
import * as peripheralController from "../controllers/peripheralController.js";

const router = Router();

router.get("/perifericos", peripheralController.getAllPeripherals);

router.get("/perifericos/:id", peripheralController.getPeripheralById);

router.post("/perifericos", peripheralController.createPeripheral);

router.patch("/perifericos/:id", peripheralController.updatePeripheral);

router.patch(
  "/perifericos/:id/baja",
  peripheralController.decomissionPeripheral
);

export default router;
