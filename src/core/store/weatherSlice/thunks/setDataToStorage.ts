import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherCoordsWithName } from '../../../types/WeatherCoords';

export const setDataToStorage = createAsyncThunk<void, WeatherCoordsWithName, { rejectValue: string }>(
  'weather/setDataToStorage',
  async ({ latitude, longitude, name }, { rejectWithValue }) => {
    try {
      const jsonData = JSON.stringify({ latitude, longitude });
      await AsyncStorage.setItem(name, jsonData);
    } catch (error) {
      if (error instanceof Error) rejectWithValue(error.message);
      return rejectWithValue('Unknown Error!');
    }
    return undefined;
  },
);
