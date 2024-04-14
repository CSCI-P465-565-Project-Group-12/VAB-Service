// Purpose: Contains functions that interact with the database to perform CRUD operations on the venues table.
import {prisma} from '../db/index';
import { Activity } from '../models/activity';
import { calculateAverageActivityRating } from './reservation';

export const createActivity = async(activity: Activity) => {
  const {id, name, venueId, ageRange, cost, capacity, activityStatus, startTime, endTime, images, coverImg} = activity;
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
        coverImg
      },
  });
}

export const getActivity = async (activityId: string) => {
	const activity = await prisma.activity.findUnique({
		where: {
			id: String(activityId),
		},
	});
  const rating =  await calculateAverageActivityRating(activityId);
  return {...activity, rating: rating};
};

export const getAllActivities = async () => {
  const activities = await prisma.activity.findMany();
  const activitiesWithRatings = await Promise.all(activities.map(async (activity) => {
    const averageRating = await calculateAverageActivityRating(activity.id);
    return { ...activity, averageRating };
  }));
  return activitiesWithRatings;
}

export const updateActivity = async(activityId: string, updateParams: Partial<Activity>) =>{
  return await prisma.activity.update({
      where: {
          id: activityId,
      },
      data: {
          ...updateParams,
      },
  });
}

export const findConflictActivities = async (venueId: string, startTime: Date, endTime: Date) => {
  return await prisma.activity.findMany({
    where: {
      venueId,
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
  });
};

export const getActivitiesByVenue = async (venueId: string) => {
  const activity =  await prisma.activity.findMany({
    where: {
      venueId,
    },
  });
  const rating  =  await calculateAverageActivityRating(activity[0].id);
  return {...activity, rating: rating};
};