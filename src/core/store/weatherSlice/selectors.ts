import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selfSelector = (state: RootState) => state.weather;

export const selectLocation = createSelector(selfSelector, (state) => state.location);

export const selectWeather = createSelector(selfSelector, (state) => state.fetchWeather);

export const selectMobileStorage = createSelector(selfSelector, (state) => state.mobileStorage);

export const selectFutureWeather = createSelector(selfSelector, (state) => {
  state.fetchWeather.data?.list.filter((_, index) => index >= 1 && index < 8);
});

export const selectLocationByName = createSelector(selfSelector, (state) => state.locationByName);
