import { FlatList, View } from 'native-base';
import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import FutureWeatherItem from '../FutureWeatherItem';
import { selectFutureWeather } from '../../core/store/weatherSlice/selectors';

const FutureWeatherList = () => {
  const weatherList = useSelector(selectFutureWeather);

  return (
    <View>
      <FlatList
        horizontal
        data={weatherList}
        keyExtractor={(item) => item.dt.toString()}
        renderItem={({ item }) => (
          <FutureWeatherItem
            time={moment(item.dt_txt).format('HH:mm')}
            key={item.dt}
            icon={item.weather[0].icon}
            temp={item.main.temp}
          />
        )}
      />
    </View>
  );
};

export default FutureWeatherList;
