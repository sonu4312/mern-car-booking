import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
type Props = {
  carId: string;
  pricePerDay: number;
};

type PassengerInfoFormData = {
  fromDate: Date;
  toDate: Date;
  passengerCount: number;
};

const PassengerInfoForm = ({ carId, pricePerDay }: Props) => {
  const search = useSearchContext();

  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PassengerInfoFormData>({
    defaultValues: {
      fromDate: search.fromDate,
      toDate: search.toDate,
      passengerCount: search.passengerCount,
    },
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data: PassengerInfoFormData) => {
    search.saveSearchValues(
      "",
      data.fromDate,
      data.toDate,
      data.passengerCount
    );

    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (data: PassengerInfoFormData) => {
    search.saveSearchValues(
      "",
      data.fromDate,
      data.toDate,
      data.passengerCount
    );

    navigate(`/car/${carId}/booking`);
  };

  return (
    <div className="flex flex-col p-4 bg-blue-300 gap-4">
      <h3 className="text-md font-bold">${pricePerDay}</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              required
              selected={fromDate}
              onChange={(date) => setValue("fromDate", date as Date)}
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
              required
              selected={toDate}
              onChange={(date) => setValue("toDate", date as Date)}
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
          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Passengers:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={20}
                {...register("passengerCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one passenger",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.passengerCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.passengerCount.message}
              </span>
            )}
          </div>

          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PassengerInfoForm;
