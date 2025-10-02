import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import * as personController from "../controllers/personController.js";

const router = Router();

router.get("/historial", authMiddleware, personController.getPersonHistorial());

router.patch(
  "/historial/actualizar",
  authMiddleware,
  personController.updatePerson()
);
