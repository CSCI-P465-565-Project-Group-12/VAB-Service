import { Request, Response, NextFunction } from "express";
import { createReservation, updateReservation, getAllReservations, getReservation, getReservationsByUser, getReservationsByActivity, getReservationsByVenue } from "../db/reservation";
import { getActivity, updateActivity } from "../db/activities";
import { Reservation } from "../models/reservation";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
// import { API_GATEWAY_URL } from "../app";
import { mailUrl, userUrl } from "../app";
import { getVenue } from "../db/venues";


export const createReservationReq = async (req: Request, res: Response) => {
  const { userId, activityId, venueId, status, paymentStatus, bookingTimeStamp } = req.body;
  const id = uuidv4();
  const activity = await getActivity(activityId);
  const reservationsForCurrentActivity = await getReservationsByActivity(activityId);
  if (activity.activityStatus === "sold out") {
    return res.status(400).json({ message: "Activity is sold out." });
  }
  if (activity.capacity && reservationsForCurrentActivity.length >= activity.capacity) {
    const updatedActivity = await updateActivity(activityId, { activityStatus: "sold out" });
    return res.status(400).json({ message: "Activity is sold out." });
  }
  const reservation: Reservation = {
    id,
    userId,
    activityId,
    venueId,
    status,
    paymentStatus,
    bookingTimeStamp,
  };
  try {
    const newReservation = await createReservation(reservation);
    //Mails thing
    const user = req.user.jwtUserObj;
    //TODO: update the url with api gateway url
    // const profile = await axios.get(`${API_GATEWAY_URL}/profile/${user.id}`);
    const profile = await axios.get(`${userUrl}/profile/${user.id}`);
    const body = {
      to: req.user.email,
      data: {
        firstName: profile.data.firstName,
        activityName: activity.name,
        activityDate: activity.startTime,
      },
    };
    //TODO: update the url with api gateway url
    // const sendMailToUser = await axios.post(`${API_GATEWAY_URL}/event-registration-confirmation-mail`, { body });
    const sendMailToUser = await axios.post(`${mailUrl}/event-registration-confirmation-mail`, { body });
    const venue =  await getVenue(venueId);
    const venueOwner = await axios.get(`${userUrl}/profile/${venue.userId}`);
    const body2 = {
      to: venueOwner.data.email,
      subject: "New Reservation Notification",
      text: `You have a new reservation for your venue ${venue.name}.`,
    }
    const sendMailToVenueOwner = await axios.post(`${mailUrl}/send-mail`, { body2 });

    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({ message: "An error occurred during reservation creation." });
  }
};

export const getReservationReq = async (req: Request, res: Response) => {
  const { reservationId } = req.params;
  try {
    const reservation = await getReservation(reservationId);
    res.status(200).json(reservation);
  } catch (error) {
    console.error("Get reservation error:", error);
    res.status(500).json({ message: "An error occurred during reservation retrieval." });
  }
};

export const getAllReservationsReq = async (req: Request, res: Response) => {
  try {
    const reservations = await getAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Get all reservations error:", error);
    res.status(500).json({ message: "An error occurred during reservation retrieval." });
  }
};

export const getReservationsByUserReq = async (req: Request, res: Response) => {
  const { userId } = req.user.id;
  try {
    const reservations = await getReservationsByUser(userId);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Get reservations by user error:", error);
    res.status(500).json({ message: "An error occurred during reservation retrieval." });
  }
};

export const getReservationsByActivityReq = async (req: Request, res: Response) => {
  const { activityId } = req.params;
  try {
    const reservations = await getReservationsByActivity(activityId);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Get reservations by activity error:", error);
    res.status(500).json({ message: "An error occurred during reservation retrieval." });
  }
};

export const getReservationsByVenueReq = async (req: Request, res: Response) => {
  const { venueId } = req.params;
  try {
    const reservations = await getReservationsByVenue(venueId);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Get reservations by venue error:", error);
    res.status(500).json({ message: "An error occurred during reservation retrieval." });
  }
};

export const changeReservationStatusReq = async (req: Request, res: Response) => {
  const { reservationId } = req.params;
  const { status } = req.body;
  try {
    const updatedReservation = await updateReservation(reservationId, { status });
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Change reservation status error:", error);
    res.status(500).json({ message: "An error occurred during reservation status change." });
  }
};

export const changePaymentStatusReq = async (req: Request, res: Response) => {
  const { reservationId } = req.params;
  const { paymentStatus } = req.body;
  try {
    const updatedReservation = await updateReservation(reservationId, { paymentStatus });
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Change payment status error:", error);
    res.status(500).json({ message: "An error occurred during payment status change." });
  }
};

export const addRatingsReq = async (req: Request, res: Response) => {
  const { reservationId } = req.params;
  const { venueRating, activityRating } = req.body;
  try {
    const updatedReservation = await updateReservation(reservationId, { venueRating, activityRating });
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Add ratings error:", error);
    res.status(500).json({ message: "An error occurred during ratings addition." });
  }
};