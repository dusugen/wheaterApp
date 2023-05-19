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
  Location: {
    data: Location.LocationObject | null;
    status: StatusOfRequestEnum;
    error: string | null;
  };
  fetchWeather: {
    data: WeatherData | null;
    status: StatusOfRequestEnum;
    error: string | null;
  };
  LocationByName: {
    data: Location.LocationGeocodedLocation | null;
    status: StatusOfRequestEnum;
    error: string | null;
  };
}

const initialState: InitialState = {
  Location: {
    data: null,
    status: StatusOfRequestEnum.IDLE,
    error: null,
  },
  fetchWeather: {
    data: null,
    status: StatusOfRequestEnum.IDLE,
    error: null,
  },
  LocationByName: {
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
    if (error.message) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown Error !");
  }
});

export const getLocationByName = createAsyncThunk<
  Location.LocationGeocodedLocation,
  string,
  { rejectValue: string }
>("weather/getLocationByName", async (name, { rejectWithValue }) => {
  try {
    const geocodeLocation = await Location.geocodeAsync(name);
    if (!geocodeLocation.length) {
      return rejectWithValue("Wrong name of location !");
    }
    return geocodeLocation[0];
  } catch (error) {
    if (error instanceof Error) {
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
        state.Location.status = StatusOfRequestEnum.LOADING;
        state.Location.error = null;
      })
      .addCase(getLocation.fulfilled, (state, action) => {
        state.Location.status = StatusOfRequestEnum.SUCCESS;
        state.Location.data = action.payload;
        state.Location.error = null;
      })
      .addCase(getLocation.rejected, (state, action) => {
        state.Location.status = StatusOfRequestEnum.ERROR;
        state.Location.error = action.payload || "Unknown Error !";
        state.Location.data = null;
      });

    builder
      .addCase(getWeather.pending, (state) => {
        state.fetchWeather.status = StatusOfRequestEnum.LOADING;
        state.fetchWeather.error = null;
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        state.fetchWeather.status = StatusOfRequestEnum.SUCCESS;
        state.fetchWeather.data = action.payload;
        state.Location.error = null;
      })
      .addCase(getWeather.rejected, (state, action) => {
        state.fetchWeather.status = StatusOfRequestEnum.ERROR;
        state.fetchWeather.error = action.payload || "Unknown Error !";
        state.fetchWeather.data = null;
      });

    builder
      .addCase(getLocationByName.pending, (state) => {
        state.LocationByName.status = StatusOfRequestEnum.LOADING;
      })
      .addCase(getLocationByName.fulfilled, (state, action) => {
        state.LocationByName.status = StatusOfRequestEnum.SUCCESS;
        state.LocationByName.data = action.payload;
      })
      .addCase(getLocationByName.rejected, (state, action) => {
        state.LocationByName.status = StatusOfRequestEnum.ERROR;
        state.LocationByName.error = action.payload || "Unknown Error !";
      });
  },
});

const selfSelector = (state: RootState) => state.weather;

export const selectLocation = createSelector(
  selfSelector,
  (state) => state.Location
);

export const selectWeather = createSelector(
  selfSelector,
  (state) => state.fetchWeather
);

export const selectLocationByName = createSelector(
  selfSelector,
  (state) => state.LocationByName
);

export const { resetWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
