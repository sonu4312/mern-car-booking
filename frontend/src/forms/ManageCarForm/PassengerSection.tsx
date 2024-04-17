import { useFormContext } from "react-hook-form";
import { CarFormData } from "./ManageCarForm";

const PassengerSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CarFormData>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Passengers</h1>
      <div className="grid grid-cols-1 p-6 gap-5 bg-gray-300 max-w-[50%]">
        <label className="text-gray-700 text-sm font-semibold">
          Number of Passengers
          <input
            className="border rounded w-full py-2 px-3 font-normal"
            type="number"
            min={1}
            {...register("passengerCount", {
              required: "This field is required",
            })}
          />
          {errors.passengerCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.passengerCount?.message}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default PassengerSection;

