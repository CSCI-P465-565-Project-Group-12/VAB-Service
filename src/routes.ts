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
  createReservationReq,
  getReservationReq,
  getAllReservationsReq,
  getReservationsByUserReq,
  getReservationsByActivityReq,
  getReservationsByVenueReq,
  changePaymentStatusReq,
  changeReservationStatusReq,
  addRatingsReq,
  createPaymentIntent,
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
router.post('/reservation', validateUserToken, createReservationReq);
router.get('/reservation/:reservationId',validateUserToken, getReservationReq);
router.get('/reservations',validateUserToken, getAllReservationsReq);
router.get('/reservations/user/',validateUserToken, getReservationsByUserReq);
router.get('/reservations/activity/:activityId',validateUserToken, getReservationsByActivityReq);
router.get('/reservations/venue/:venueId',validateUserToken, getReservationsByVenueReq);
router.post('/changePaymentStatus/:reservationId', validateUserToken, changePaymentStatusReq);
router.post('/changeReservationStatus/:reservationId', validateUserToken, changeReservationStatusReq);
router.post('/addRatings/:reservationId', validateUserToken, addRatingsReq);
router.post('/createPaymentIntent', validateUserToken, createPaymentIntent);

export default router;