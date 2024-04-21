import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";

const Home = () => {
  const { data: cars } = useQuery("fetchQuery", () => apiClient.fetchMyCars());

  const topRowCars = cars?.slice(0, 2) || [];

  const bottomRowCars = cars?.slice(2) || [];

  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Latest Destinations</h2>
      <p>Most recent destinations added by our hosts</p>

      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {topRowCars.map((car) => (
            <LatestDestinationCard car={car} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
        {bottomRowCars.map((car) => (
            <LatestDestinationCard car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;