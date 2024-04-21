export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

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
  bookings: BookingType[];
};

export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  passengerCount: number;
  fromDate: Date;
  toDate: Date;
  totalCost: number;
};

export type CarSearchResponse = {
  data: CarType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};
