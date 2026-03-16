import { Router } from "express";

import amenityRoutes from "./amenity.routes"
import propertyTypeRoutes from "./propertyType.routes"
 
 const router = Router();

 router.use('/amenity', amenityRoutes);
 router.use('/property-type', propertyTypeRoutes);

export default router;
