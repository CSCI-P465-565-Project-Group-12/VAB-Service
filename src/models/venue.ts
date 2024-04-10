

export interface Venue{
  id: string; 
  userId: string;
  name: string; 
  state: string; 
  city: string; 
  street: string; 
  zipcode: string; 
  venueStatus: 'active' | 'inactive';
  details: string; 
  venueType: string; 
  images: string[]; 
}