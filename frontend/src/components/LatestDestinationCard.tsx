import { Link } from "react-router-dom";
import { CarType } from "../../../backend/src/shared/types";

type Props = {
  car: CarType;
};

const LatestDestinationCard = ({ car }: Props) => {
  return (
    <Link
      to={`/detail/${car._id}`}
      className="relative cursor pointer overflow-hidden rounded-md"
    >
      <div className="h-[300px]">
        <img
          src={car.imageUrls[0]}
          className="w-full h-full object-cover object-center"
          alt="car.img"
        />
      </div>

      <div className="absolute bottom-0 p4-4 bg-black bg-opacity-50 w-full rounded-b-md">
        <span className="text-white font-bold tracking-tight text-3xl">
          {car.name}
        </span>
      </div>
    </Link>
  );
};

export default LatestDestinationCard;
