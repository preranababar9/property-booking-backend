import { Router } from "express";
import { createProperty, deleteProperty, getAllProperties, getPropertyById, updateProperty } from "../controllers/property.controller";


const router = Router();

router.post("/", createProperty);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;