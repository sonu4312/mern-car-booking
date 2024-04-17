import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import PassengerSection from "./PassengerSection";
import ImagesSection from "./ImagesSection";

export type CarFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerDay: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  passengerCount: number;
};

type Props = {
  onSave: (carFormData: FormData) => void;
  isLoading: boolean;
};

const ManageCarForm = ({ onSave, isLoading }: Props) => {
  const formMethods = useForm<CarFormData>();
  const { handleSubmit } = formMethods;

  const onSubmit = handleSubmit((formDataJson: CarFormData) => {
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerDay", formDataJson.pricePerDay.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("passengerCount", formDataJson.passengerCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append("imageFiles", imageFile);
    });

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <PassengerSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};
export default ManageCarForm;
