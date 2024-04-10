import { Request, Response, NextFunction } from "express";
import { createReservation, updateReservation, getAllReservations, getReservation, getReservationsByUser, getReservationsByActivity, getReservationsByVenue } from "../db/reservation";
import { Reservation } from "../models/reservation";
import { v4 as uuidv4 } from "uuid";

//TODO: Endpoints for ratings.

export const createReservationReq = async (req: Request, res: Response) => {
  const { userId, activityId, venueId, status, paymentStatus, bookingTimeStamp } = req.body;
  const id = uuidv4();
  //TODO: Add capacity check if capacity is equal to maxcapacity-1 update activity status to sold out after reservation
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