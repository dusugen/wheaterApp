import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Box, FlatList, Heading, IconButton, Input, Text } from "native-base";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Button, Keyboard, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import normalize from "react-native-normalize";
import { useSelector } from "react-redux";
import {
  getDataFromStorage,
  getLocationByName,
  removeLocationFromStorage,
  selectLocationByName,
  selectMobileStorage,
  selectWeather,
  setDataToStorage,
} from "../../../core/store/slices/weaterSlice";
import { useThunkDispatch } from "../../../core/store/store";
import { StatusOfRequestEnum } from "../../../core/types/enums/statusOfRequestEnum";
import { WeatherModal } from "../../WeatherModal";

export const Settings: FC = () => {
  const isFocused = useIsFocused();
  const [address, setAddress] = useState<string | undefined>("");
  const modalizeRef = useRef<Modalize>(null);

  const dispatch = useThunkDispatch();

  const { data, status, error } = useSelector(selectLocationByName);

  const { data: weatherData } = useSelector(selectWeather);

  useEffect(() => {
    dispatch(getDataFromStorage());
  }, [isFocused, weatherData]);

  // Set data to storage
  useEffect(() => {
    if (data && weatherData) {
      dispatch(
        setDataToStorage({
          ...data,
          name: weatherData.city.name,
        })
      );
    }
  }, [data, weatherData]);

  //Delete data from Storage
  const handleDelete = (item: string) => {
    dispatch(removeLocationFromStorage(item));
    dispatch(getDataFromStorage());
  };

  // Display ModalView on CityName click
  const handleClickOpen = async (name: string) => {
    const {
      meta: { requestStatus },
    } = await dispatch(getLocationByName(name));
    if (requestStatus === "rejected") return;
    modalizeRef.current?.open();
  };

  // Open ModalView on Search button click
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

  const { data: storageData } = useSelector(selectMobileStorage);

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

      <FlatList
        style={{
          width: "100%",
        }}
        data={storageData}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            style={{
              padding: normalize(10),
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: normalize(10),
            }}
          >
            <Heading
              size="md"
              style={{ textAlign: "center", alignSelf: "center" }}
              onPress={() => handleClickOpen(item)}
            >
              {item}
            </Heading>

            <IconButton
              icon={<AntDesign name="delete" size={24} color="black" />}
              onPress={() => handleDelete(item)}
              title="delete"
            />
          </TouchableOpacity>
        )}
      />
      <WeatherModal data={data} ref={modalizeRef} />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: normalize(40),
    height: "100%",
    gap: normalize(30),
  },
  input: {
    maxWidth: "70%",
    alignSelf: "center",
  },
});
