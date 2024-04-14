// Purpose: Contains functions that interact with the database to perform CRUD operations on the venues table.
import {prisma} from '../db/index';
import { Reservation } from '../models/reservation';

export const createReservation = async(reservation: Reservation) => {
  const {id, userId, activityId, venueId, status, paymentStatus, bookingTimeStamp} = reservation;
  return await prisma.reservation.create({
      data: {
        id,
        userId,
        venueId,
        activityId,
        status,
        paymentStatus,
        bookingTimeStamp,
      },
  });
}

export const getReservation = async (reservationId: string) => {
	return await prisma.reservation.findUnique({
		where: {
			id: String(reservationId),
		},
	});
};

export const getAllReservations = async () => {
  return await prisma.reservation.findMany();
}

export const updateReservation = async(reservationId: string, updateParams: Partial<Reservation>) =>{
  return await prisma.reservation.update({
      where: {
          id: reservationId,
      },
      data: {
          ...updateParams,
      },
  });
}

export const getReservationsByUser = async (userId: string) => {
  return await prisma.reservation.findMany({
    where: {
      userId,
    },
  });
};

export const getReservationsByActivity = async (activityId: string) => {
  return await prisma.reservation.findMany({
    where: {
      activityId,
    },
  });
};

export const getReservationsByVenue = async (venueId: string) => {
  return await prisma.reservation.findMany({
    where: {
      venueId,
    },
  });
};


export const calculateAverageActivityRating =async (activityId: string) => {
  const aggregate = await prisma.reservation.aggregate({
    _avg: {
      activityRating: true,
    },
    where: {
      activityId: activityId,
      NOT: {
        activityRating: null,
      },
    },
  });

  return aggregate._avg.activityRating ?? 0; // Return the average rating or 0 if there are no ratings
}

export const calculateAverageVenueRating = async (venueId: string) => {
  const aggregate = await prisma.reservation.aggregate({
    _avg: {
      venueRating: true,
    },
    where: {
      venueId: venueId,
      NOT: {
        venueRating: null,
      },
    },
  });

  return aggregate._avg.venueRating ?? 0; // Return the average rating or 0 if there are no ratings
}