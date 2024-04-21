import { CarType } from "../../../backend/src/shared/types";

type Props = {
  fromDate: Date;
  toDate: Date;
  passengerCount: number;
  car: CarType;
  numberOfDays: number;
};

const BookingDetailsSummary = ({
  fromDate,
  toDate,
  passengerCount,
  numberOfDays,
  car,
}: Props) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Rent Details</h2>
      <div className="border-b py-2">
        Name of Car:
        <div className="font-bold">{`${car.name}`}</div>
      </div>

      <div className="border-b py-2">
        Location:
        <div className="font-bold">{`${car.city},${car.country}`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          From Date:
          <div className="font-bold">{fromDate.toDateString()}</div>
        </div>
        <div>
          To Date:
          <div className="font-bold">{toDate.toDateString()}</div>
        </div>
      </div>
      <div className="border-t border-b py-2">
        Total days for rent:
        <div className="font-bold">{numberOfDays} days</div>
      </div>
      <div>
        Passengers: <div className="font-bold">{passengerCount} passengers</div>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;
