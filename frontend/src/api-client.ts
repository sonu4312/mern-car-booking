import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  CarSearchResponse,
  CarType,
  PaymentIntentResponse,
  UserType,
} from "../../backend/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || "Failed to sign in.");
  }

  const body = await response.json();
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyCar = async (carFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-cars`, {
    method: "POST",
    credentials: "include",
    body: carFormData,
  });

  if (!response.ok) {
    throw new Error("failed to add car");
  }
  return response.json();
};

export const fetchMyCars = async (): Promise<CarType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-cars`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching cars");
  }

  return response.json();
};

export const fetchMyCarById = async (carId: string): Promise<CarType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-cars/${carId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error Fetching Cars");
  }

  return response.json();
};

export const updateMyCarById = async (carFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-cars/${carFormData.get("carId")}`,
    {
      method: "PUT",
      body: carFormData,
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to updated Car");
  }
  return response.json();
};

export type SearchParams = {
  destination?: string;
  fromDate?: string;
  toDate?: string;
  passengerCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchCars = async (
  searchParams: SearchParams
): Promise<CarSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("fromDate", searchParams.fromDate || "");
  queryParams.append("toDate", searchParams.toDate || "");
  queryParams.append("passengerCount", searchParams.passengerCount || "");
  queryParams.append("page", searchParams.page || "");

  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/cars/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching cars");
  }

  return response.json();
};

export const fetchCars = async (): Promise<CarType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/cars`);
  if (!response.ok) {
    throw new Error("Error");
  }
  return response.json();
};

export const fetchCarById = async (carId: string): Promise<CarType> => {
  const response = await fetch(`${API_BASE_URL}/api/cars/${carId}`);

  if (!response.ok) {
    throw new Error("Error fetching cars");
  }
  return response.json();
};

export const createPaymentIntent = async (
  carId: string,
  numberOfDays: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/cars/${carId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfDays }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};

export const createCarBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/cars/${formData.carId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking car");
  }
};

export const fetchMyBookings = async (): Promise<CarType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch Bookings");
  }

  return response.json();
};
