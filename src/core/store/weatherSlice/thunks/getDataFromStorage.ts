import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getDataFromStorage = createAsyncThunk<
string[],
void,
{ rejectValue: string }
>('weather/setDataToStorage', async (_, { rejectWithValue }) => {
  try {
    const storageData = (await AsyncStorage.getAllKeys()) as string[];
    return storageData;
  } catch (error) {
    if (error instanceof Error) rejectWithValue(error.message);
    return rejectWithValue('Unknown Error!');
  }
});
