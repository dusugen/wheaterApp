import { useIsFocused } from '@react-navigation/native';
import {
  Box, Button, ScrollView, Text, useColorMode,
} from 'native-base';
import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, RefreshControl } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useSelector } from 'react-redux';
import ChangeThemeButton from '../../components/ChangeThemeButton';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import WeatherView from '../../components/WeatherView';
import { useThunkDispatch } from '../../core/store/store';
import { resetWeather } from '../../core/store/weatherSlice/reducers';
import { selectLocation, selectWeather } from '../../core/store/weatherSlice/selectors';
import { getLocation } from '../../core/store/weatherSlice/thunks/getLocation';
import { getWeather } from '../../core/store/weatherSlice/thunks/getWeather';
import { StatusOfRequestEnum } from '../../core/types/enums/StatusOfRequestEnum';

const HomePage = () => {
  const { colorMode } = useColorMode();
  const isFocused = useIsFocused();

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = useCallback(() => {
    modalizeRef.current?.open();
  }, []);

  const onChange = useCallback(() => {
    modalizeRef.current?.close();
  }, []);

  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(getLocation());
  }, []);

  const { data } = useSelector(selectLocation);

  useEffect(() => {
    if (data && isFocused) {
      dispatch(getWeather(data.coords));
    }
    return () => {
      if (isFocused) dispatch(resetWeather());
    };
  }, [data, isFocused]);

  const { data: weatherData, status: weatherStatus, error: weatherError } = useSelector(selectWeather);

  const onRefresh = useCallback(async () => {
    const location = data || (await dispatch(getLocation())).payload;
    if (typeof location === 'object') {
      dispatch(getWeather(location.coords));
    }
  }, []);

  if (weatherError) {
    return (
      <Layout>
        <Text>{weatherError}</Text>
      </Layout>
    );
  }

  if (!weatherData) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={weatherStatus === StatusOfRequestEnum.LOADING} onRefresh={onRefresh} />
        }
      >
        <WeatherView weatherData={weatherData} />
        <Box style={{ marginTop: 'auto' }}>
          <Button onPress={onOpen}>change theme</Button>
        </Box>
      </ScrollView>
      <Modalize ref={modalizeRef} adjustToContentHeight>
        <Box
          height={Dimensions.get('window').height / 1.18}
          backgroundColor={colorMode === 'light' ? 'whitesmoke' : 'black'}
        >
          <ChangeThemeButton onChange={onChange} />
        </Box>
      </Modalize>
    </Layout>
  );
};

export default HomePage;
