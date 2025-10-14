import { Router } from "express";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/usuarios/:id", userController.getUserById);

router.post("/usuarios", userController.createUser);

router.patch("/usuarios/:id", userController.updateUser);

router.patch("/usuarios/:id/estado", userController.stateUser);

export default router;
