import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import {BsCarFront, BsPeopleFill } from "react-icons/bs";
import { BiDollar, BiLocationPlus, BiStar } from "react-icons/bi";

const MyCars = () => {
  const { data: carData } = useQuery("fetchMyCars", apiClient.fetchMyCars, {
    onError: () => {},
  });
  if (!carData) {
    return <span>No Hotels Found</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Cars</h1>
        <Link
          to="/add-car"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Car
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {carData?.map((car, i) => (
          <div
            key={i}
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{car.name}</h2>
            <div className="whitespace-pre-line">{car.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiLocationPlus className="mr-1"/>
                {car.city},{car.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsCarFront className="mr-1"/>
                {car.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiDollar className="mr-1"/>
                {car.pricePerDay} per day
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsPeopleFill className="mr-1"/>
                {car.passengerCount} passangers
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1"/>
                {car.starRating} Star Rating
              </div>
            </div>
            <span className="flex justify-end">
                <Link to={`/edit-hotel/${car._id}`} className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500">
                    View Details
                </Link>
            </span>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCars;
