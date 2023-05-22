import { Box, Center, Heading, Image, Text } from "native-base";
import React, { FC } from "react";
import normalize from "react-native-normalize";
import { WeatherData } from "../../core/types/WeatherData";
import { WeatherTable } from "../WeatherTable";
import moment from "moment";
import { FutureWeatherList } from "../FutureWeatherList";

interface WeatherViewProps {
  weatherData: WeatherData;
}

export const WeatherView: FC<WeatherViewProps> = ({ weatherData }) => {
  return (
    <Box>
      <WeatherTable weatherData={weatherData} />

      <Center mt={normalize(60)}>
        <Text>
          Weather on {moment(weatherData.list[0].dt_txt).format("DD-MM-YYYY")}
        </Text>
        <Box display="flex" flexDirection="row" marginTop={normalize(20)}>
          <Heading size="4xl">
            {Math.round(weatherData.list[0].main.temp)}
          </Heading>
          <Heading size="xl" alignSelf="flex-start">
            &#8451;
          </Heading>
        </Box>
      </Center>
      <Center mt={normalize(6)}>
        <Heading size="xl">
          {weatherData.city.name}, {weatherData.city.country}
        </Heading>
        <Text>{weatherData.list[0].weather[0].description}</Text>
        <Image
          size={normalize(150, "height")}
          alt="icon"
          source={{
            uri: `https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@4x.png`,
          }}
        />
      </Center>
      <FutureWeatherList />
    </Box>
  );
};
