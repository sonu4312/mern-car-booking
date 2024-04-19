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
  const [destination, setDestination] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [passengerCount, setPassenerCount] = useState<number>(1);
  const [carId, setCarId] = useState<string>("");

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
