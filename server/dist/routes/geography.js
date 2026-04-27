import express from 'express';
import { getRegions, getProvinces, getMunicipalities, getBarangays, registerProvince, registerMunicipality, registerBarangay, getRegisteredProvinces, getRegisteredMunicipalities, getRegisteredBarangays } from '../controllers/geographyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.get('/psgc/regions', getRegions);
router.get('/psgc/provinces', getProvinces);
router.get('/psgc/municipalities', getMunicipalities);
router.get('/psgc/barangays', getBarangays);
router.get('/provinces', protect, getRegisteredProvinces);
router.get('/municipalities', protect, getRegisteredMunicipalities);
router.get('/barangays', protect, getRegisteredBarangays);
router.post('/provinces', protect, authorize('super_admin'), registerProvince);
router.post('/municipalities', protect, authorize('super_admin'), registerMunicipality);
router.post('/barangays', protect, authorize('super_admin'), registerBarangay);
export default router;
//# sourceMappingURL=geography.js.map