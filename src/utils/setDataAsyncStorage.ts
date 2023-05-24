import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeatherCoordsWithName } from "../core/types/WeatherCoords";

export const setCoordsToStorage = async ({
  latitude,
  longitude,
  name,
}: WeatherCoordsWithName) => {
  const setCoordsValue = JSON.stringify({ latitude, longitude });
  await AsyncStorage.setItem(name, setCoordsValue);
};
