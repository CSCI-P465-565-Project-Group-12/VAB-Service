import { Request, Response, NextFunction } from "express";
import { createVenue, getVenue, getAllVenues, updateVenue } from "../db/venues";
import { Venue } from "../models/venue";
import { v4 as uuidv4 } from "uuid";

export const createVenueReq = async (req: Request, res: Response) => {
  const { name, state, city, street, zipcode, details, venueType, images } = req.body;
  const venueStatus = "active";
  const id = uuidv4();
  const venue: Venue = {
    id,
    name,
    state,
    city,
    street,
    zipcode,
    venueStatus,
    details,
    venueType,
    images,
  };
  try {
    const newVenue = await createVenue(venue);
    res.status(201).json(newVenue);
  } catch (error) {
    console.error("Create venue error:", error);
    res.status(500).json({ message: "An error occurred during venue creation." });
  }
};

export const getVenueReq = async (req: Request, res: Response) => {
  const { venueId } = req.params;
  try {
    const venue = await getVenue(venueId);
    res.status(200).json(venue);
  } catch (error) {
    console.error("Get venue error:", error);
    res.status(500).json({ message: "An error occurred during venue retrieval." });
  }
};

export const getAllVenuesReq = async (req: Request, res: Response) => {
  try {
    const venues = await getAllVenues();
    res.status(200).json(venues);
  } catch (error) {
    console.error("Get all venues error:", error);
    res.status(500).json({ message: "An error occurred during venue retrieval." });
  } 
};

export const deActivateVenueReq = async (req: Request, res: Response) => {
  const { venueId } = req.params;
  const venue = await getVenue(venueId);
  if (!venue) {
    return res.status(404).json({ message: "Venue not found." });
  }
  const venueStatus = "inactive";
  try {
    const updatedVenue = await updateVenue(venueId, { venueStatus });
    res.status(200).json(updatedVenue);
  } catch (error) {
    console.error("Deactivate venue error:", error);
    res.status(500).json({ message: "An error occurred during venue deactivation." });
  }
};