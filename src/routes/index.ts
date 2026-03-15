import { Router } from "express";

import amenityRoutes from "./amenity.routes"

 
 const router = Router();

 router.use('/amenity', amenityRoutes);

export default router;
