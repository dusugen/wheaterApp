import { Box, Text } from "native-base";
import React, { forwardRef } from "react";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import { Modalize } from "react-native-modalize";
import {
  getWeather,
  resetWeather,
  selectWeather,
} from "../../core/store/slices/weaterSlice";
import { LocationGeocodedLocation } from "expo-location";
import { useThunkDispatch } from "../../core/store/store";
import { WeatherCoords } from "../../core/types/WeatherCoords";
import { useSelector } from "react-redux";
import { WeatherView } from "../WeatherView";
import { StatusOfRequestEnum } from "../../core/types/enums/statusOfRequestEnum";
import { Loader } from "../Loader";

interface WeatherModalProps {
  data: WeatherCoords | null;
}

export const WeatherModal = forwardRef<Modalize, WeatherModalProps>(
  ({ data }, ref) => {
    const dispatch = useThunkDispatch();
    useEffect(() => {
      if (data) dispatch(getWeather(data));
    }, [data]);

    const { data: weatherData, status, error } = useSelector(selectWeather);

    const onClose = () => {
      dispatch(resetWeather());
    };

    return (
      <Modalize ref={ref} adjustToContentHeight={true} onClose={onClose}>
        <Box height={Dimensions.get("window").height / 1.18}>
          {status === StatusOfRequestEnum.LOADING ||
            (status === StatusOfRequestEnum.IDLE && <Loader />)}

          {status === StatusOfRequestEnum.ERROR && <Text>Error</Text>}

          {status === StatusOfRequestEnum.SUCCESS && weatherData && (
            <WeatherView weatherData={weatherData} />
          )}
        </Box>
      </Modalize>
    );
  }
);
