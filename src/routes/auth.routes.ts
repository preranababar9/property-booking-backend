import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/users", authenticate, authorize("admin"), createUser);
router.get("/users", authenticate, authorize("admin"), getUsers);
router.get("/users/:id", authenticate, authorize("admin"), getUserById);
router.patch("/users/:id", authenticate, authorize("admin"), updateUser);
router.delete("/users/:id", authenticate, authorize("admin"), deleteUser);

export default router;
