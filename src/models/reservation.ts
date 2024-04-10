export interface Reservation {
  id: string;
  userId: string;
  activityId: string;
  venueId: string;
  status: "Booked" | "Confirmed" | "Cancelled";
  paymentStatus: "Pending" | "Completed" | "Refunded";
  bookingTimeStamp: Date;
  venueRating?: number;
  activityRating?: number;
}