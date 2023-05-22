import { LocationGeocodedLocation } from "expo-location";

export type WeatherCoords = Pick<
  LocationGeocodedLocation,
  "latitude" | "longitude"
>;
