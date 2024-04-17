import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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
    method:"POST",
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

  if(!response.ok){
    throw new Error("failed to add car");
  }
  return response.json();
};
