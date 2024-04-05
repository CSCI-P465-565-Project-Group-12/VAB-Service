// Purpose: Contains functions that interact with the database to perform CRUD operations on the venues table.
import {prisma} from '../db/index';
import { Activity } from '../models/activity';

export const createActivity = async(activity: Activity) => {
  const {id, name, venueId, ageRange, cost, capacity, activityStatus, startTime, endTime, images} = activity;
  return await prisma.activity.create({
      data: {
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
      },
  });
}

export const getActivity = async (activityId: string) => {
	return await prisma.activity.findUnique({
		where: {
			id: String(activityId),
		},
	});
};

export const getAllVenues = async () => {
  return await prisma.activity.findMany();
}

export const updateVenue = async(activityId: string, updateParams: Partial<Activity>) =>{
  return await prisma.activity.update({
      where: {
          id: activityId,
      },
      data: {
          ...updateParams,
      },
  });
}