import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import PassengerInfoForm from "../forms/PassengerInfoForm/PassengerInfoForm";

const Detail = () => {
  const { carId } = useParams();

  const { data: car } = useQuery(
    "fetchCarById",
    () => apiClient.fetchCarById(carId || ""),
    {
      enabled: !!carId,
    }
  );

  if (!car) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: car.starRating }).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{car.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {car.imageUrls.map((image) => (
          <div className="h-[300px]">
            <img
              src={image}
              alt={car.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {car.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm">{facility}</div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2">
        <div className="whitespace-pre-line text-justify">{car.description}</div>
        <div className="h-fit">
            <PassengerInfoForm pricePerDay={car.pricePerDay} carId={car._id}/>
        </div>
      </div>
    </div>
  );
};

export default Detail;
