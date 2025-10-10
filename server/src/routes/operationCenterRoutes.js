import { Router } from "express";
import * as operationCenterController from "../controllers/operationCenterController.js";

const router = Router();

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

router.patch(
  "/centros-operacion/:id/desactivar",
  operationCenterController.closeOperationCenter
);

export default router;
