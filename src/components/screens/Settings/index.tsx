import { Box, Input, Text } from "native-base";
import React, { useCallback, useRef, useState } from "react";
import { Button, Keyboard, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import { useSelector } from "react-redux";
import {
  getLocationByName,
  selectLocationByName,
} from "../../../core/store/slices/weaterSlice";
import { useThunkDispatch } from "../../../core/store/store";
import { WeatherModal } from "../../WeatherModal";
import { StatusOfRequestEnum } from "../../../core/types/enums/statusOfRequestEnum";

export const Settings = () => {
  const [address, setAddress] = useState<string | undefined>("");
  const modalizeRef = useRef<Modalize>(null);

  const dispatch = useThunkDispatch();

  const { data, status, error } = useSelector(selectLocationByName);

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
      {data && (
        <>
          <Text>lat:{data.latitude}</Text>
          <Text>lon:{data.longitude}</Text>
        </>
      )}
      <Button
        title="search"
        disabled={!address || !address?.trim().length}
        onPress={handleGeocode}
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
    height: "100%",
    gap: 30,
  },
  input: {
    maxWidth: "70%",
  },
});
