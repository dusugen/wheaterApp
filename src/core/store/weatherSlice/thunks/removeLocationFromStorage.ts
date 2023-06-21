import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const removeLocationFromStorage = createAsyncThunk<
void,
string,
{ rejectValue: string }
>('weather/setDataToStorage', async (name, { rejectWithValue }) => {
  try {
    return await AsyncStorage.removeItem(name);
  } catch (error) {
    if (error instanceof Error) rejectWithValue(error.message);
    return rejectWithValue('Unknown Error!');
  }
});
