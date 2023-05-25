import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import {
  LocationGeocodedLocation,
  LocationObject,
  geocodeAsync,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import config from "../../../../config.json";
import {
  WeatherCoords,
  WeatherCoordsWithName,
} from "../../types/WeatherCoords";
import { WeatherData } from "../../types/WeatherData";
import { StatusOfRequestEnum } from "../../types/enums/statusOfRequestEnum";
import { RootState } from "./../store";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface InitialState {
  Location: {
    data: LocationObject | null;
    status: StatusOfRequestEnum;
    error: string | null;
  };
  fetchWeather: {
    data: WeatherData | null;
    status: StatusOfRequestEnum;
    error: string | null;
  };
  LocationByName: {
    data: LocationGeocodedLocation | null;
    status: StatusOfRequestEnum;
    error: string | null;
  };
  MobileStorage: {
    data: string[];
    status: StatusOfRequestEnum;
    error: string | null;
  };
  // SearchedLocation?: [string, WeatherCoords][];
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
  MobileStorage: {
    data: [],
    status: StatusOfRequestEnum.IDLE,
    error: null,
  },
};

export const setDataToStorage = createAsyncThunk<
  void,
  WeatherCoordsWithName,
  { rejectValue: string }
>(
  "weather/setDataToStorage",
  async ({ latitude, longitude, name }, { rejectWithValue }) => {
    try {
      const jsonData = JSON.stringify({ latitude, longitude });
      await AsyncStorage.setItem(name, jsonData);
    } catch (error) {
      if (error instanceof Error) rejectWithValue(error.message);
      return rejectWithValue("Unknown Error!");
    }
  }
);

export const getDataFromStorage = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>("weather/setDataToStorage", async (_, { rejectWithValue }) => {
  try {
    const storageData = (await AsyncStorage.getAllKeys()) as string[];
    return storageData;
  } catch (error) {
    if (error instanceof Error) rejectWithValue(error.message);
    return rejectWithValue("Unknown Error!");
  }
});

export const removeLocationFromStorage = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("weather/setDataToStorage", async (name, { rejectWithValue }) => {
  try {
    return AsyncStorage.removeItem(name);
  } catch (error) {
    if (error instanceof Error) rejectWithValue(error.message);
    return rejectWithValue("Unknown Error!");
  }
});

export const getLocation = createAsyncThunk<
  LocationObject,
  void,
  { rejectValue: string }
>("weather/getLocation", async (_, { rejectWithValue }) => {
  try {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return rejectWithValue("Permission to access location was denied");
    }
    const location = await getCurrentPositionAsync({});
    return location;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown Error !");
  }
});

export const getLocationByName = createAsyncThunk<
  LocationGeocodedLocation,
  string,
  { rejectValue: string }
>("weather/getLocationByName", async (name, { rejectWithValue }) => {
  try {
    const geocodeLocation = await geocodeAsync(name);
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
  WeatherCoords,
  { rejectValue: string }
>(
  "weather/fetchWeater",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams({
        lat: String(latitude),
        lon: String(longitude),
        appid: config.apiKey,
        units: "metric",
      }).toString();

      const response = await fetch(`${config.apiUrl}?${searchParams}`);
      const data: WeatherData = await response.json();

      if (data.cod !== 200) rejectWithValue("No data");
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown Error !");
    }
  }
);

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
        state.fetchWeather.error = null;
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

    builder
      .addCase(getDataFromStorage.fulfilled, (state, action) => {
        state.MobileStorage.data = action.payload;
        state.MobileStorage.status = StatusOfRequestEnum.SUCCESS;
      })
      .addCase(getDataFromStorage.pending, (state) => {
        state.MobileStorage.status = StatusOfRequestEnum.LOADING;
        state.MobileStorage.error = null;
      })
      .addCase(getDataFromStorage.rejected, (state, action) => {
        state.MobileStorage.status = StatusOfRequestEnum.ERROR;
        state.MobileStorage.error = action.payload || "Unknown Error !";
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

export const selectMobileStorage = createSelector(
  selfSelector,
  (state) => state.MobileStorage
);

export const selectFutureWeather = createSelector(selfSelector, (state) =>
  state.fetchWeather.data?.list.filter((item, index) => index >= 1 && index < 8)
);

export const selectLocationByName = createSelector(
  selfSelector,
  (state) => state.LocationByName
);

export const { resetWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
