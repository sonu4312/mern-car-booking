import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {

    const navigate = useNavigate();
  const search = useSearchContext();
  const [destination, setDestination] = useState<string>(search.destination);
  const [fromDate, setFromDate] = useState<Date>(search.fromDate);
  const [toDate, setToDate] = useState<Date>(search.toDate);
  const [passengerCount, setPassengerCount] = useState<number>(
    search.passengerCount
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(destination, fromDate, toDate, passengerCount);

    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-2 bg-amber-500 rounded shadow-md grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-2">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          placeholder="Enter your Destination"
          className="text-md w-full focus:outline-none"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <div className="flex bg-white px-2 py-1 gap-2">
        <label className="items-center flex">
          Passengers:
          <input
            className="w-full p-1 focus:outline-none font-bold"
            type="number"
            min={1}
            max={20}
            value={passengerCount}
            onChange={(event) =>
              setPassengerCount(parseInt(event.target.value))
            }
          />
        </label>
      </div>
      <div>
        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date as Date)}
          selectsStart
          startDate={fromDate}
          endDate={toDate}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="From Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div>
        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date as Date)}
          selectsStart
          startDate={fromDate}
          endDate={toDate}
          minDate={fromDate}
          maxDate={maxDate}
          placeholderText="To Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex gap-1">
        <button className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500">
          Search
        </button>
        <button className="w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500">
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
