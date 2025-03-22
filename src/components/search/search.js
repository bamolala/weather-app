import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../../api";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);

  const loadOptions = async (inputValue) => {
    try {
        const response = await fetch(
            `${GEO_API_URL}/v1/geo/cities?minPopulation=1000000&namePrefix=${inputValue}`,
            geoApiOptions // Using the predefined `geoApiOptions` from api.js
        );

        const data = await response.json();

        if (!data.data) {
            return { options: [] }; // Return an empty array if no data is available
        }

        return {
            options: data.data.map((city) => ({
                value: `${city.latitude}, ${city.longitude}`, // Unique value for each option
                label: `${city.name}, ${city.countryCode}, ${city.country}`, // Display format
            })),
        };
    } catch (err) {
        console.error("Error fetching cities:", err);
        return { options: [] }; // Return empty array in case of an error
    }
};


  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;