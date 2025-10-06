import { Router } from "express";
import * as catalogueController from "../controllers/catalogueController.js";

const router = Router();

router.get("/catalogo/ciudades", catalogueController.getCities);

router.get("/catalogo/tipos-identificacion", catalogueController.getIdTypes);

router.get(
  "/catalogo/tipos-perifericos",
  catalogueController.getPeripheralTypes
);

export default router;
