import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Box, Input, Text } from "native-base";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Button, Keyboard, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { useSelector } from "react-redux";
import {
  getLocationByName,
  selectLocationByName,
  selectSearchedValue,
  selectWeather,
  setSearchedLocation,
} from "../../../core/store/slices/weaterSlice";
import { useThunkDispatch } from "../../../core/store/store";
import { WeatherCoordsWithName } from "../../../core/types/WeatherCoords";
import { StatusOfRequestEnum } from "../../../core/types/enums/statusOfRequestEnum";
import { setCoordsToStorage } from "../../../utils/setDataAsyncStorage";
import { WeatherModal } from "../../WeatherModal";

export const Settings: FC = () => {
  const isFocused = useIsFocused();
  const [address, setAddress] = useState<string | undefined>("");
  const modalizeRef = useRef<Modalize>(null);

  const dispatch = useThunkDispatch();

  const { data, status, error } = useSelector(selectLocationByName);

  const { data: weatherData } = useSelector(selectWeather);

  useEffect(() => {
    console.log("start");

    (async () => {
      const storageKeys = await AsyncStorage.getAllKeys();
      // await AsyncStorage.clear();
      const storageData = await AsyncStorage.multiGet(storageKeys);

      const validStorageData = storageData.map((item) => {
        if (item[1])
          return [item[0], JSON.parse(item[1])] as WeatherCoordsWithName[];
        return item;
      });
      console.log("process");

      dispatch(setSearchedLocation(validStorageData));
    })();
    console.log("end");
  }, [isFocused]);

  const handleClickOpen = () => {
    // const {
    //   meta: { requestStatus },
    // } = await dispatch(getLocationByName());
    // if (requestStatus === "rejected") return;
    modalizeRef.current?.open();
  };

  const handleGeocode = useCallback(async () => {
    if (address && address.trim().length) {
      Keyboard.dismiss();
      const {
        meta: { requestStatus },
      } = await dispatch(getLocationByName(address));
      if (requestStatus === "rejected") return;
    }
    modalizeRef.current?.open();
    setAddress("");
  }, [address]);

  useEffect(() => {
    if (data && weatherData) {
      setCoordsToStorage({
        ...data,
        name: weatherData.city.name,
      });
    }
  }, [data, weatherData]);

  const searchedLocation = useSelector(selectSearchedValue);
  console.log(searchedLocation, "searched");

  return (
    <Box style={styles.container}>
      <Input
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
        variant="outline"
        style={styles.input}
      />
      {status === StatusOfRequestEnum.ERROR && <Text>{error}</Text>}

      <Button
        title="search"
        disabled={!address || !address?.trim().length}
        onPress={handleGeocode}
      />
      <Text>Last results :</Text>
      {searchedLocation &&
        searchedLocation.map((item, index) => (
          <TouchableOpacity key={index}>
            <Text onPress={handleClickOpen}>{item[0]}</Text>
          </TouchableOpacity>
        ))}
      <WeatherModal data={data} ref={modalizeRef} />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 30,
  },
  input: {
    maxWidth: "70%",
  },
});
