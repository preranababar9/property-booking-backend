import { Router } from "express";

import amenityRoutes from "./amenity.routes"
import propertyTypeRoutes from "./propertyType.routes"
import propertyRoutes from "./property.routes"
 
 const router = Router();

 router.use('/amenity', amenityRoutes);
 router.use('/property-type', propertyTypeRoutes);
 router.use('/property', propertyRoutes)

export default router;
