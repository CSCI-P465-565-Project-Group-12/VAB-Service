// Purpose: Contains functions that interact with the database to perform CRUD operations on the venues table.
import {prisma} from '../db/index';
import { Venue } from '../models/venue';

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
	return await prisma.venue.findUnique({
		where: {
			id: String(venueId),
		},
	});
};

export const getAllVenues = async () => {
  return await prisma.venue.findMany();
}

export const updateVenue = async(venueId: string, updateParams: Venue) =>{
  return await prisma.venue.update({
      where: {
          id: venueId,
      },
      data: {
          ...updateParams,
      },
  });
}