import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { carId } = useParams();

  const [numberOfDays, setNumberOfDays] = useState<number>(0);

  useEffect(() => {
    if (search.fromDate && search.toDate) {
      const days =
        Math.abs(search.fromDate.getTime() - search.toDate.getTime()) /
        (1000 * 60 * 60 * 24); //total miliseconds from the jan1,1970/ms*min*hour*day
      setNumberOfDays(Math.ceil(days));
    }
  }, [search.fromDate, search.toDate]);

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(carId as string, numberOfDays.toString()),
    {
      enabled: !!carId && numberOfDays > 0,
    }
  );

  const { data: car } = useQuery(
    "fetchCarByID",
    () => apiClient.fetchCarById(carId as string),
    {
      enabled: !!carId,
    }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  if (!car) {
    return <></>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-2 ">
      <BookingDetailsSummary
        fromDate={search.fromDate}
        toDate={search.toDate}
        passengerCount={search.passengerCount}
        numberOfDays={numberOfDays}
        car={car}
      />
      {currentUser && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentData.clientSecret,
          }}
        >
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
