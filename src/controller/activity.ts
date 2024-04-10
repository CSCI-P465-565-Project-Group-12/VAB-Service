import { Request, Response, NextFunction } from "express";
import { createActivity, getActivity, getAllActivities, findConflictActivities, getActivitiesByVenue, updateActivity } from "../db/activities";
import { Activity } from "../models/activity";
import { v4 as uuidv4 } from "uuid";

//TODO: activity rating take average of all ratings from reservsations.activityRating

export const createActivityReq = async (req: Request, res: Response) => {
  const { name, venueId, ageRange, cost, capacity, activityStatus, startTime, endTime, images,coverImg } = req.body;
  const id = uuidv4();
  const conflictActivities = await findConflictActivities(venueId, new Date(startTime), new Date(endTime));
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
    startTime,
    endTime,
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
    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error("Change activity status error:", error);
    res.status(500).json({ message: "An error occurred during activity status change." });
  }
};