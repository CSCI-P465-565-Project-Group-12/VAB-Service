import { Request, Response, NextFunction } from "express";
import { createReservation, updateReservation, getAllReservations, getReservation, getReservationsByUser, getReservationsByActivity, getReservationsByVenue, getBookedorConfirmedReservationsByActivity } from "../db/reservation";
import { getActivity, updateActivity } from "../db/activities";
import { Reservation } from "../models/reservation";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
// import { API_GATEWAY_URL } from "../app";
import { mailUrl, userUrl } from "../app";
import { getVenue } from "../db/venues";


export const createReservationReq = async (req: Request, res: Response) => {
  const { activityId, venueId } = req.body;
  const bookingTimeStamp = new Date();
  const status = "Booked";
  const paymentStatus = "Pending";
  const userId = req.user.jwtUserObj.id;
  const id = uuidv4();
  const activity = await getActivity(activityId);
  const bookedorConfirmedReservationsForCurrentActivity = await getBookedorConfirmedReservationsByActivity(activityId);
  const userReservations = await getReservationsByUser(userId);
  const userReservationsForCurrentActivity = userReservations.filter((reservation) => reservation.activityId === activityId);
  if (userReservationsForCurrentActivity.length > 0) {
    return res.status(400).json({ message: "User already has a reservation for the activity." });
  }
  if (activity.activityStatus === "sold out") {
    return res.status(400).json({ message: "Activity is sold out." });
  }
  if (activity.capacity && bookedorConfirmedReservationsForCurrentActivity.length == activity.capacity) {
    const updatedActivity = await updateActivity(activityId, { activityStatus: "sold out" });
    return res.status(400).json({ message: "Activity is sold out." });
  }
  if (activity.capacity && bookedorConfirmedReservationsForCurrentActivity.length == activity.capacity - 1) {
    const updatedActivity = await updateActivity(activityId, { activityStatus: "sold out" });
  }
  if (activity.startTime && activity.startTime < bookingTimeStamp) {
    return res.status(400).json({ message: "Activity has already started." });
  }
  if(activity.endTime && activity.endTime < bookingTimeStamp) { 
    return res.status(400).json({ message: "Activity has already ended." });
  }
  if (activity.venueId !== venueId) {
    return res.status(400).json({ message: "Activity is not at the specified venue." });
  }
  if (activity.activityStatus === "cancelled") {
    return res.status(400).json({ message: "Activity is cancelled." });
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
  if (activity.cost && activity.cost === "0.00") {
    reservation.paymentStatus = "Completed";
    reservation.status = "Confirmed";
  }
  try {
    const newReservation = await createReservation(reservation);
    const venue =  await getVenue(venueId);
    //Mails thing
    const user = req.user.jwtUserObj;
    console.log("headers", req.headers, userUrl);
    const profile = await axios.get(`${userUrl}/profileByUserId/${userId}`);
    console.log("profile", profile.data);
    const sendMailToUser = await axios.post(`${mailUrl}/event-registration-confirmation-mail`,  {
      to: user.email,
      data: {
        firstName: profile.data.last_name,
        eventName: activity.name,
        eventDate: activity.startTime,
        eventLocation: `${venue.street}, ${venue.city}, ${venue.state}, ${venue.zipcode}`,
      },
    });
    const venueOwner = await axios.get(`${userUrl}/user/${venue.userId}`);
    console.log("venueOwner", venueOwner.data);
    const sendMailToVenueOwner = await axios.post(`${mailUrl}/send-mail`, {
      to: venueOwner.data.email,
      subject: "New Reservation Notification",
      text: `You have a new reservation for your activity ${activity.name} at the venue ${venue.name}.`,
    });

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
  const { userId } = req.user.jwtUserObj.id;
  try {
    const reservations = await getReservationsByUser(userId);
    const reservationsWithActivity = await Promise.all(reservations.map(async (reservation) => {
      const activity = await getActivity(reservation.activityId);
      return { ...reservation, activity };
    }))
    res.status(200).json(reservationsWithActivity);
  } catch (error) {
    console.error("Get reservations by user error:", error);
    res.status(500).json({ message: "An error occurred during reservation retrieval." });
  }
};

export const getReservationsByActivityReq = async (req: Request, res: Response) => {
  const { activityId } = req.params;
  try {
    const reservations = await getReservationsByActivity(activityId);
    const reservationsWithUserDetails = await Promise.all(reservations.map(async (reservation) => {
      const user = await axios.get(`${userUrl}/user/${reservation.userId}`);
      // const profile = await axios.get(`${userUrl}/profileByUserId/${reservation.userId}`);
      return { 
        ...reservation, 
        username: user.data.username, 
        email: user.data.email
      }
        // firstName: profile.data.first_name, 
        // lastName: profile.data.last_name};
    }));
    res.status(200).json(reservationsWithUserDetails);
  } catch (error) {
    console.error("Get reservations by activity error:", error);
    res.status(500).json({ message: "An error occurred during reservation retrieval." });
  }
};

export const getReservationsByVenueReq = async (req: Request, res: Response) => {
  const { venueId } = req.params;
  try {
    const reservations = await getReservationsByVenue(venueId);
    const reservationsWithActivity = await Promise.all(reservations.map(async (reservation) => {
      const activity = await getActivity(reservation.activityId);
      return { 
        reservation:{...reservation},
        activity:{...activity} 
      };
    }))
    res.status(200).json(reservationsWithActivity);
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
  const { venueRating, activityRating, activityReview } = req.body;
  try {
    const updatedReservation = await updateReservation(reservationId, { venueRating, activityRating });
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Add ratings error:", error);
    res.status(500).json({ message: "An error occurred during ratings addition." });
  }
};