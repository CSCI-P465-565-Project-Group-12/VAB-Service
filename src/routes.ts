import express from "express";
import {
  createVenueReq,
  getVenueReq,
  getAllVenuesReq,
  deActivateVenueReq,
  createActivityReq,
  getActivityReq,
  getAllActivitiesReq,
  getActivitiesByVenueReq,
  changeActivityStatusReq,
} from "./controller/index";
import { validateUserToken, validateVenueOwnerToken } from "./middleware/auth";


const router = express.Router();

router.post('/venue', validateVenueOwnerToken ,createVenueReq);
router.get('/venue/:venueId',validateUserToken, getVenueReq);
router.get('/venues',validateUserToken, getAllVenuesReq);
router.post('/deactivatevenue/:venueId', validateVenueOwnerToken, deActivateVenueReq);
router.post('/activity', validateVenueOwnerToken, createActivityReq);
router.get('/activity/:activityId',validateUserToken, getActivityReq);
router.get('/activities',validateUserToken, getAllActivitiesReq);
router.get('/activities/:venueId',validateUserToken, getActivitiesByVenueReq);
router.post('/changeactivitystatus/:activityId', validateVenueOwnerToken, changeActivityStatusReq);

export default router;