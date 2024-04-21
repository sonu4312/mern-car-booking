import React, { useContext, useState } from "react";

type SearchContext = {
  destination: string;
  //instead of checkIn and checkOut the fromDate , toDate is used
  fromDate: Date;
  toDate: Date;
  passengerCount: number;
  carId: string;
  saveSearchValues: (
    destination: string,
    fromDate: Date,
    toDate: Date,
    passengerCount: number
  ) => void;
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>(
    () => sessionStorage.getItem("destination") || ""
  );
  
  const [fromDate, setFromDate] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("fromDate") || new Date().toISOString())
  );

  const [toDate, setToDate] = useState<Date>(
    () => new Date(sessionStorage.getItem("toDate") || new Date().toISOString())
  );
  const [passengerCount, setPassenerCount] = useState<number>(() =>
    parseInt(sessionStorage.getItem("passengerCount") || "1")
  );

  const [carId, setCarId] = useState<string>(
    () => sessionStorage.getItem("carId") || ""
  );

  const saveSearchValues = (
    destination: string,
    fromDate: Date,
    toDate: Date,
    passengerCount: number,
    carId?: string
  ) => {
    setDestination(destination);
    setFromDate(fromDate);
    setToDate(toDate);
    setPassenerCount(passengerCount);
    if (carId) {
      setCarId(carId);
    }

    sessionStorage.setItem("destination", destination);
    sessionStorage.setItem("fromDate", fromDate.toISOString());
    sessionStorage.setItem("toDate", toDate.toISOString());
    sessionStorage.setItem("passengerCount", passengerCount.toString());

    if (carId) {
      sessionStorage.setItem("carId", carId);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        fromDate,
        toDate,
        passengerCount,
        saveSearchValues,
        carId,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context as SearchContext;
};
