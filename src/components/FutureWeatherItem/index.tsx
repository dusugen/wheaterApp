import { Box, Image, Text } from "native-base";
import React, { FC } from "react";
import normalize from "react-native-normalize";

interface FutureWeatherItemProps {
  icon: string;

  temp: number;
  time: string;
}

export const FutureWeatherItem: FC<FutureWeatherItemProps> = ({
  icon,
  time,
  temp,
}) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${icon}@4x.png`,
        }}
        size={normalize(70)}
        alt="weather"
      />
      <Text>{time}</Text>
      <Text>{Math.round(temp)} &#8451;</Text>
    </Box>
  );
};
