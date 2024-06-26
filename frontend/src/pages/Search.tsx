import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import React, { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import CarTypeFilter from "../components/CarTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  //console.log(search)
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedCarTypes, setSelectedCarTypes] = useState<string[]>([]);
  const [selectedFacilites, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    fromDate: search.fromDate.toISOString(),
    toDate: search.toDate.toISOString(),
    passengerCount: search.passengerCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedCarTypes,
    facilities: selectedFacilites,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: carData } = useQuery(["searchCars", searchParams], () =>
    apiClient.searchCars(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleCarTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const carType = event.target.value;

    setSelectedCarTypes((prevCarTypes) =>
      event.target.checked
        ? [...prevCarTypes, carType]
        : prevCarTypes.filter((car) => car !== carType)
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;

    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  return (
    <div className="grid grid-cols-[1fr_2fr] lg:grid-cols-[250px_1fr] gap-5">
      <div className="sticky rounded-lg border-slate-300 p-5 h-fit top-10 sm:text-sm lg:text-lg">  {/*sticky removed*/}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter
            onChange={handleStarsChange}
            selectedStars={selectedStars}
          />
        </div>

        <CarTypeFilter
          selectedCarTypes={selectedCarTypes}
          onChange={handleCarTypeChange}
        />

        <FacilitiesFilter
          selectedFacilites={selectedFacilites}
          onChange={handleFacilityChange}
        />

        <PriceFilter
          selectedPrice={selectedPrice}
          onChange={(value?: number) => setSelectedPrice(value)}
        />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {carData?.pagination.total} Car found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerDayAsc">Price Per Day(low to high)</option>
            <option value="pricePerDayDsc">Price Per Day(high to low)</option>
          </select>
        </div>
        {carData?.data.map((car) => (
          <SearchResultCard car={car} />
        ))}
        <div>
          <Pagination
            page={carData?.pagination.page || 1}
            pages={carData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
