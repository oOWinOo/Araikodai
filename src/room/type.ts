export class RoomCreateType {
  name: string;
  description?: string;
  imageURL?: string;
  price: number;
  occupancy: number;
  hotelId: any;
}

export class RoomUpdateType {
  name?: string;
  description?: string;
  imageURL?: string;
  price?: number;
  occupancy?: number;
}
