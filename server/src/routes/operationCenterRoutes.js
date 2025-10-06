import { Router } from "express";
import * as operationCenterController from "../controllers/operationCenterController.js";

const router = Router();

router.get(
  "/centros-operacion",
  operationCenterController.getAllOperationCenters
);
router.get(
  "/centros-operacion/:id",
  operationCenterController.getOperationCenterById
);
router.post(
  "/centros-operacion",
  operationCenterController.createOperationCenter
);
router.patch(
  "/centros-operacion/:id",
  operationCenterController.updateOperationCenter
);

export default router;
