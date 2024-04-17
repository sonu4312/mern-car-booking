import { useMutation } from "react-query";
import ManageCarForm from "../forms/ManageCarForm/ManageCarForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from '../api-client'

const AddCar = () => {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addMyCar, {
    onSuccess: () => {
      showToast({message:"Car saved",type:"SUCCESS"});
    },
    onError: () => {
      showToast({ message: "Error Saving Car ", type: "ERROR" });
    },
  });

  const handleSave = (carFormData:FormData) => {
    mutate(carFormData);
  };

  return <ManageCarForm  onSave={handleSave} isLoading={isLoading}/>;
};

export default AddCar;
