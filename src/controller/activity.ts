import { Request, Response, NextFunction } from "express";
import { createActivity, getActivity, getAllActivities, getActivitiesByVenue, findConflictActivities, updateActivity } from "../db/activities";
// import { findConflictActivities } from "../db/activities";
import { Activity } from "../models/activity";
import { v4 as uuidv4 } from "uuid";
import { getBookedorConfirmedReservationsByActivity, updateReservation } from "../db/reservation";
import axios from "axios";
import { mailUrl, userUrl } from "../app";


export const createActivityReq = async (req: Request, res: Response) => {
  const { name, venueId, ageRange, cost, capacity, activityStatus, startTime, endTime, images,coverImg, description } = req.body;
  const id = uuidv4();
  const parsedStartTime = new Date(startTime);
  const parsedEndTime = new Date(endTime);
  const conflictActivities = await findConflictActivities(venueId, parsedStartTime, parsedEndTime);
  if (conflictActivities.length > 0) {
    return res.status(409).json({ message: "Activity conflicts with existing activities." });
  }
  const activity: Activity = {
    id,
    name,
    venueId,
    ageRange,
    cost,
    capacity,
    activityStatus,
    description,
    startTime: parsedStartTime,
    endTime: parsedEndTime,
    images,
    coverImg
  };
  try {
    const newActivity = await createActivity(activity);
    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({ message: "An error occurred during activity creation." });
  }
};

export const getActivityReq = async(req: Request, res: Response) => {
  const { activityId } = req.params;
  try {
    const activity = await getActivity(activityId);
    res.status(200).json(activity);
  } catch (error) {
    console.error("Get activity error:", error);
    res.status(500).json({ message: "An error occurred during activity retrieval." });
  }
};

export const getAllActivitiesReq = async(req: Request, res: Response) => {
  try {
    const activities = await getAllActivities();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Get all activities error:", error);
    res.status(500).json({ message: "An error occurred during activity retrieval." });
  }
};

export const getActivitiesByVenueReq = async(req: Request, res: Response) => {
  const { venueId } = req.params;
  try {
    const activities = await getActivitiesByVenue(venueId);
    res.status(200).json(activities);
  } catch (error) {
    console.error("Get activities by venue error:", error);
    res.status(500).json({ message: "An error occurred during activity retrieval." });
  }
};

export const changeActivityStatusReq = async(req: Request, res: Response) => {
  const { activityId } = req.params;
  const { activityStatus } = req.body;
  try {
    const updatedActivity = await updateActivity(activityId, { activityStatus });
    //TODO: Cancel and refund all reservations for the activity and send mails to all users with reservations
    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error("Change activity status error:", error);
    res.status(500).json({ message: "An error occurred during activity status change." });
  }
};

export const cancelActivityReq = async(req: Request, res: Response) => {
  const { activityId } = req.params;
  try {
    const reservations = await getBookedorConfirmedReservationsByActivity(activityId);
    await Promise.all(reservations.map(async (reservation) => {
      const cancelReservation = await updateReservation(reservation.id, { status: "Cancelled", paymentStatus: "Refunded" });
      const activity = await getActivity(activityId);
      const user = await axios.get(`${userUrl}/user/${cancelReservation.userId}`);
      const sendMail = await axios.post(`${mailUrl}/send-mail`, {
        to : user.data.email,
        subject: "Event Cancellation Notification",
        text: `The event ${activity.name} has been cancelled. Your reservation has been refunded. It typically takes 3-5 business days for the refund to reflect in your account. If not refunded within this time, please contact us.`
      });
    }));
    const updatedActivity = await updateActivity(activityId, { activityStatus: "cancelled" });
    res.status(200).json(updatedActivity);
  }
  catch (error) {
    console.error("Cancel activity error:", error);
    res.status(500).json({ message: "An error occurred during activity cancellation." });
  }
};