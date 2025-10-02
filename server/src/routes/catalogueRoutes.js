import { Router } from "express";
import { csrfTokenMiddleware } from "../middlewares/crsfMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import * as catalogueController from "../controllers/catalogueController";

const router = Router();

router.get("/csrf-token", csrfTokenMiddleware);

router.get(
  "/historial/dispositivos",
  authMiddleware,
  catalogueController.getDevicesHistorial()
);

router.get(
  "/historial/personas",
  authMiddleware,
  catalogueController.getPeopleHistorial()
);

router.get(
  "/historial/asignaciones",
  authMiddleware,
  catalogueController.getAssignmentsHistorial()
);

/**
 * @route GET /api/status
 * @description Verifica el estado de la sesión activa del usuario.
 * @access Private
 * @middleware authMiddleware - Requiere autenticación.
 */
router.get("/status", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Sesión activa" });
});
