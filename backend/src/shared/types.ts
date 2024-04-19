export type CarType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  passengerCount: number;
  facilities: string[];
  pricePerDay: number;
  starRating: number;
  lastUpdated: Date;
  imageUrls: string[];
};

export type CarSearchResponse = {
  data: CarType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
