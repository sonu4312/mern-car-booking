import { useQuery } from "react-query";
import * as apiClient from "../api-client";

// const MyBookings = () => {
//   const { data: cars } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);

//   if (!cars || cars.length === 0) {
//   }
// };

const MyBookings = () => {
  const { data: cars } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);

  if (!cars || cars.length === 0) {
    return <span>No bookings found</span>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {cars.map((car) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={car.imageUrls[0]}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {car.name}
              <div className="text-xs font-normal">
                {car.city},{car.country}
              </div>
            </div>
            {car.bookings.map((booking) => (
            <div>
              <div>
                <span className="font-bold mr-2">Dates:</span>
                <span>
                  {new Date(booking.fromDate).toDateString()} -{" "}
                  {new Date(booking.toDate).toDateString()}
                </span>
              </div>
              <div>
                <span className="font-bold mr-2">Passengers: </span>
                <span>{booking.passengerCount}</span>
              </div>
            </div>
          ))}
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
