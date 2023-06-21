import { createAsyncThunk } from '@reduxjs/toolkit';
import { LocationGeocodedLocation, geocodeAsync } from 'expo-location';

export const getLocationByName = createAsyncThunk<
LocationGeocodedLocation,
string,
{ rejectValue: string }
>('weather/getLocationByName', async (name, { rejectWithValue }) => {
  try {
    const geocodeLocation = await geocodeAsync(name);
    if (!geocodeLocation.length) {
      return rejectWithValue('Wrong name of location !');
    }
    return geocodeLocation[0];
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Unknown Error !');
  }
});
