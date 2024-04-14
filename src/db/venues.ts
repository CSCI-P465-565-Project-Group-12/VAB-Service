// Purpose: Contains functions that interact with the database to perform CRUD operations on the venues table.
import {prisma} from '../db/index';
import { Venue } from '../models/venue';
import { calculateAverageVenueRating } from './reservation';

export const createVenue = async(venue: Venue) => {
  const {id, name, state, city, street, zipcode, venueStatus, details, venueType, images} = venue;
  return await prisma.venue.create({
      data: {
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
      },
  });
}

export const getVenue = async (venueId: string) => {
  const venue = await prisma.venue.findUnique({
    where: {
      id: String(venueId),
    },
  });
  const rating =  await calculateAverageVenueRating(venueId);
  return {...venue, rating: rating};  
};

export const getAllVenues = async () => {
  const venues = await prisma.venue.findMany();
  const venuesWithRatings = await Promise.all(venues.map(async (venue) => {
    const averageRating = await calculateAverageVenueRating(venue.id);
    return { ...venue, averageRating };
  }));
  return venuesWithRatings;
}

export const updateVenue = async(venueId: string, updateParams: Partial<Venue>) =>{
  return await prisma.venue.update({
      where: {
          id: venueId,
      },
      data: {
          ...updateParams,
      },
  });
}