import * as assignmentController from "../controllers/assignmentController.js";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/crear", authMiddleware, assignmentController.createAssignment());

router.patch(
  "/finalizar",
  authMiddleware,
  assignmentController.finishAssignment
);
