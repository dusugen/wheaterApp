import { Box, Image, Text } from 'native-base';
import React, { FC, memo } from 'react';
import normalize from 'react-native-normalize';

interface FutureWeatherItemProps {
  icon: string;

  temp: number;
  time: string;
}

const FutureWeatherItem: FC<FutureWeatherItemProps> = ({
  icon,
  time,
  temp,
}) => (
  <Box display="flex" alignItems="center" justifyContent="space-between">
    <Image
      source={{
        uri: `https://openweathermap.org/img/wn/${icon}@4x.png`,
      }}
      size={normalize(70)}
      alt="weather"
    />
    <Text>{time}</Text>
    <Text>
      {Math.round(temp)}
      {' '}
      &#8451;
    </Text>
  </Box>
);

export default memo(FutureWeatherItem);
