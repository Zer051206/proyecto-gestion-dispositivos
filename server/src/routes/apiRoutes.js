import { Router } from "express";
import * as apiController from "../controllers/apiController.js";

const router = Router();

router.use("/activos", apiController.getAssets);

export default router;
