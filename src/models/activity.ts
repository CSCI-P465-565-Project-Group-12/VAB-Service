export interface Activity {
  id: string;
  name: string;
  venueId: string;
  ageRange: string;
  cost: number;
  capacity: number;
  activityStatus: 'open' | 'sold out' | 'cancelled';
  startTime: Date;
  endTime: Date;
  images: string[];
  coverImg: string;
}