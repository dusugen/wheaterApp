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
import React, { useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Modalize } from "react-native-modalize";
import normalize from "react-native-normalize";
import { useSelector } from "react-redux";
import {
  getLocation,
  getWeather,
  resetWeather,
  selectLocation,
  selectWeather,
} from "../../../core/store/slices/weaterSlice";
import { useThunkDispatch } from "../../../core/store/store";
import { StatusOfRequestEnum } from "../../../core/types/enums/statusOfRequestEnum";
import { ChangeThemeButton } from "../../ChangeThemeButton";
import { Layout } from "../../Layout";
import { Loader } from "../../Loader";
import { WeatherTable } from "../../WeatherTable";
import { WeatherView } from "../../WeatherView";
import { useIsFocused } from "@react-navigation/native";

export const HomePage = () => {
  const { colorMode } = useColorMode();
  const isFocused = useIsFocused();

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onChange = () => {
    modalizeRef.current?.close();
  };

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

  const { data: weatherData, status: weatherStatus } =
    useSelector(selectWeather);

  const onRefresh = useCallback(async () => {
    const location = data || (await dispatch(getLocation())).payload;
    if (typeof location === "object") {
      dispatch(getWeather(location.coords));
    }
  }, []);

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
          <RefreshControl
            refreshing={weatherStatus === StatusOfRequestEnum.LOADING}
            onRefresh={onRefresh}
          />
        }
      >
        <WeatherView weatherData={weatherData} />
        <TouchableOpacity style={{ marginTop: "auto" }}>
          <Button onPress={onOpen} style={styles.button}>
            change theme
          </Button>
        </TouchableOpacity>
      </ScrollView>
      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <Box
          height={Dimensions.get("window").height / 1.18}
          backgroundColor={colorMode === "light" ? "whitesmoke" : "black"}
        >
          <ChangeThemeButton onChange={onChange} />
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
    width: normalize(40),
    height: normalize(40),
  },
});
