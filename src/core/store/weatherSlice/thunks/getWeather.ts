import { createAsyncThunk } from '@reduxjs/toolkit';
import { WeatherData } from '../../../types/WeatherData';
import { WeatherCoords } from '../../../types/WeatherCoords';
import config from '../../../../../config.json';

export const getWeather = createAsyncThunk<
WeatherData,
WeatherCoords,
{ rejectValue: string }
>(
  'weather/fetchWeater',
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams({
        lat: String(latitude),
        lon: String(longitude),
        appid: config.apiKey,
        units: 'metric',
      }).toString();

      const response = await fetch(`${config.apiUrl}?${searchParams}`);
      const data: WeatherData = await response.json();

      if (data.cod !== 200) rejectWithValue('No data');
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown Error !');
    }
  },
);
