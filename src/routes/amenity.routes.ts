import { Router } from "express";
import {
  createAmenity,
  deleteAmenity,
  getAllAmenities,
  getAmenityById,
  updateAmenity,
} from "../controllers/amentity.controller";

const router = Router();

router.post("/", createAmenity);
router.get("/", getAllAmenities);
router.get("/:id", getAmenityById);

router.put("/:id", updateAmenity);
router.delete("/:id", deleteAmenity);

export default router;
