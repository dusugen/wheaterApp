import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  useColorMode,
} from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import normalize from "react-native-normalize";
import { useSelector } from "react-redux";
import {
  getLocation,
  getWeather,
  selectLocation,
  selectWeather,
} from "../../../core/store/slices/weaterSlice";
import { useThunkDispatch } from "../../../core/store/store";
import { StatusOfRequestEnum } from "../../../core/types/enums/statusOfRequestEnum";
import { Layout } from "../../Layout";
import { WeatherTable } from "../../WeatherTable";
import { Modalize } from "react-native-modalize";
import { ChangeThemeButton } from "../../ChangeThemeButton";

export const HomePage = () => {
  const { toggleColorMode } = useColorMode();

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(getLocation());
  }, []);

  const { data } = useSelector(selectLocation);

  useEffect(() => {
    if (data) {
      const lat = data.coords.latitude;
      const lon = data.coords.longitude;
      dispatch(getWeather({ lat, lon }));
    }
  }, [data]);

  const { data: weatherData, status: weatherStatus } =
    useSelector(selectWeather);

  const onRefresh = useCallback(async () => {
    const location = data || (await dispatch(getLocation())).payload;
    if (typeof location === "object") {
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
      dispatch(getWeather({ lat, lon }));
    }
  }, []);

  if (!weatherData) {
    return (
      <Layout>
        <Center>Loading...</Center>
      </Layout>
    );
  }
  const icon = weatherData.weather[0].icon;

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={weatherStatus === StatusOfRequestEnum.LOADING}
            onRefresh={onRefresh}
          />
        }
      >
        <WeatherTable weatherData={weatherData} />
        <Center mt={normalize(50)}>
          <Box display="flex" flexDirection="row">
            <Heading size="4xl">{Math.round(weatherData.main.temp)}</Heading>
            <Heading size="xl" alignSelf="flex-start">
              &#8451;
            </Heading>
          </Box>
        </Center>
        <Center mt={normalize(6)}>
          <Heading size="xl">
            {weatherData.name}, {weatherData.sys.country}
          </Heading>
          <Text>{weatherData.weather[0].description}</Text>
          <Image
            size={normalize(250, "height")}
            alt="icon"
            source={{
              uri: `https://openweathermap.org/img/wn/${icon}@4x.png`,
            }}
          />
        </Center>
        <TouchableOpacity>
          <Button onPress={onOpen} style={styles.button}>
            change theme
          </Button>
        </TouchableOpacity>
      </ScrollView>
      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <Box height={Dimensions.get("window").height / 1.18}>
          <ChangeThemeButton />
        </Box>
      </Modalize>
    </Layout>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: "auto",
  },
  icon: {
    width: 40,
    height: 40,
  },
});