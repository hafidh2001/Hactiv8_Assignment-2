import {
  login,
  register,
  showAllUsers,
} from "../controllers/UserController.js";
import { Router } from "express";
import { checkCredential } from "../middlewares/checkCredentials.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/data-user", checkCredential, showAllUsers);

export default router;
