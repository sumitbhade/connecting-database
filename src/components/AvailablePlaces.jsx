import { use } from "react";
import Places from "./Places.jsx";
import { useState, useEffect } from "react";
import ErrorPage from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  //useEffect avoids infinite loop
  //1) Using then
  // useEffect(() => {
  //   fetch("http://localhost:3000/places")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((resData) => {
  //       setAvailablePlaces(resData.places);
  //     });
  // }, []);

  //2) Better way --->> Using aync and await instead of using then

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );

          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({ message: error.message || "Could not fetch" });

        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);

  if (error) {
    return <ErrorPage title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
