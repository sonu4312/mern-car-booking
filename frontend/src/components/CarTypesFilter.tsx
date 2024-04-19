import { carTypes } from "../config/car-options-config";

type Props = {
    selectedCarTypes: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  const CarTypeFilter= ({ selectedCarTypes, onChange }: Props) => {
    return (
      <div className="border-b border-slate-300 pb-5">
        <h4 className="text-md font-semibold mb-2">Car Type</h4>
        {carTypes.map((carType) => (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded"
              value={carType}
              checked={selectedCarTypes.includes(carType)}
              onChange={onChange}
            />
            <span>{carType}</span>
          </label>
        ))}
      </div>
    );
  };
  
  export default CarTypeFilter;
  