import { RootState } from "./../store";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import * as Location from "expo-location";
import { StatusOfRequestEnum } from "../../types/enums/statusOfRequestEnum";
import config from "../../../../config.json";
import { WeatherData } from "../../types/WeatherData";

interface InitialState {
  getLocation: {
    data: Location.LocationObject | null;
    status: StatusOfRequestEnum;
    error: string | null;
  };
  fetchWeather: {
    data: WeatherData | null;
    status: StatusOfRequestEnum;
    error: string | null;
  };
}

const initialState: InitialState = {
  getLocation: {
    data: null,
    status: StatusOfRequestEnum.IDLE,
    error: null,
  },
  fetchWeather: {
    data: null,
    status: StatusOfRequestEnum.IDLE,
    error: null,
  },
};

export const getLocation = createAsyncThunk<
  Location.LocationObject,
  void,
  { rejectValue: string }
>("weather/getLocation", async (_, { rejectWithValue }) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return rejectWithValue("Permission to access location was denied");
    }
    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error: any) {
    if (error?.message) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown Error !");
  }
});

export const getWeather = createAsyncThunk<
  WeatherData,
  { lat: number; lon: number },
  { rejectValue: string }
>("weather/fetchWeater", async ({ lat, lon }, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      appid: config.apiKey,
      units: "metric",
    }).toString();

    const response = await fetch(`${config.apiUrl}?${searchParams}`);
    const data: WeatherData = await response.json();
    return data;
  } catch (error: any) {
    if (error.message) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown Error !");
  }
});

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    resetWeather: (state) => {
      state.fetchWeather.data = null;
      state.fetchWeather.status = StatusOfRequestEnum.IDLE;
      state.fetchWeather.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocation.pending, (state) => {
        state.getLocation.status = StatusOfRequestEnum.LOADING;
        state.getLocation.error = null;
      })
      .addCase(getLocation.fulfilled, (state, action) => {
        state.getLocation.status = StatusOfRequestEnum.SUCCESS;
        state.getLocation.data = action.payload;
      })
      .addCase(getLocation.rejected, (state, action) => {
        state.getLocation.status = StatusOfRequestEnum.ERROR;
        state.getLocation.error = action.payload || "Unknown Error !";
      })
      .addCase(getWeather.pending, (state) => {
        state.fetchWeather.status = StatusOfRequestEnum.LOADING;
        state.fetchWeather.error = null;
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        state.fetchWeather.status = StatusOfRequestEnum.SUCCESS;
        state.fetchWeather.data = action.payload;
      })
      .addCase(getWeather.rejected, (state, action) => {
        state.fetchWeather.status = StatusOfRequestEnum.ERROR;
        state.fetchWeather.error = action.payload || "Unknown Error !";
      });
  },
});

const selfSelector = (state: RootState) => state.weather;

export const selectLocation = createSelector(
  selfSelector,
  (state) => state.getLocation
);

export const selectWeather = createSelector(
  selfSelector,
  (state) => state.fetchWeather
);

export const { resetWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
