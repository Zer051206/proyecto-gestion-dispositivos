import { Router } from "express";
import * as catalogueController from "../controllers/catalogueController.js";

const router = Router();

router.get("/ciudades", catalogueController.getCities);

router.get("/tipos-identificacion", catalogueController.getIdTypes);

router.get("/tipos-perifericos", catalogueController.getPeripheralTypes);

export default router;
