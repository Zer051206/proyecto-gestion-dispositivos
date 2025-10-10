import { Router } from "express";
import * as apiController from "../controllers/apiController.js";

const router = Router();

router.get("/activos", apiController.getAssets);

router.get("/centros-operacion", apiController.getOperationCenters);

router.get("/usuarios", apiController.getUsers);

router.get("/logs", apiController.getLogs)

router.get("/bajas", apiController.getDecomissions)

export default router;
