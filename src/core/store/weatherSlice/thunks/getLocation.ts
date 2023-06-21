import { createAsyncThunk } from '@reduxjs/toolkit';
import { LocationObject, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';

export const getLocation = createAsyncThunk<
LocationObject,
void,
{ rejectValue: string }
>('weather/getLocation', async (_, { rejectWithValue }) => {
  try {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return rejectWithValue('Permission to access location was denied');
    }
    const location = await getCurrentPositionAsync({});
    return location;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Unknown Error !');
  }
});
