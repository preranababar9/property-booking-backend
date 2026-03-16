import { Router } from "express";
import { createPropertyType, deletePropertyType, getAllPropertyType, getPropertyTypeById, updatePropertyType } from "../controllers/propertyType.controller";

const router = Router();

router.post("/", createPropertyType);
router.get("/", getAllPropertyType);
router.get("/:id", getPropertyTypeById);

router.put("/:id", updatePropertyType);
router.delete("/:id", deletePropertyType);

export default router;