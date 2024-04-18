import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageCarForm from "../forms/ManageCarForm/ManageCarForm";
import { useAppContext } from "../contexts/AppContext";

const EditCar = () => {
    const {showToast} = useAppContext();
  const { carId } = useParams();

  const { data: car } = useQuery(
    "fetchMyCarById",
    () => apiClient.fetchMyCarById(carId || ""),
    {
      enabled: !!carId,
    }
  );

  const {mutate,isLoading} = useMutation(apiClient.updateMyCarById,{
    onSuccess:()=>{
        showToast({message:"Car Saved!",type:"SUCCESS"}) 
    },
    onError:()=>{
        showToast({message:"Error saving car",type:"ERROR"})
    },
  })
const handleSave = (carFormData:FormData)=>{
    mutate(carFormData);
}
  return <ManageCarForm car={car} onSave={handleSave} isLoading={isLoading} />;
};

export default EditCar;
