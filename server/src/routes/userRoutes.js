import router from "./authRoutes";
import * as userController from "../controllers/userController.js";

router.get("/usuarios", userController.getAllUsers);

router.get("/usuarios/:id", userController.getUserById);

router.post("/usuarios", userController.createUser);

router.patch("/usuarios/:id", userController.updateUser);
