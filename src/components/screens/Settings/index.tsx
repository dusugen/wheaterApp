import { Box, Input, Text } from "native-base";
import React, { useCallback, useRef, useState } from "react";
import { Button, Dimensions, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import { useSelector } from "react-redux";
import {
  getLocationByName,
  selectLocationByName,
} from "../../../core/store/slices/weaterSlice";
import { useThunkDispatch } from "../../../core/store/store";
import { StatusOfRequestEnum } from "../../../core/types/enums/statusOfRequestEnum";

export const Settings = () => {
  const [address, setAddress] = useState<string | undefined>("");
  const modalizeRef = useRef<Modalize>(null);

  const dispatch = useThunkDispatch();

  const handleGeocode = useCallback(() => {
    if (address && address.trim().length) {
      dispatch(getLocationByName(address));
    }
    if (status === StatusOfRequestEnum.SUCCESS) {
      setAddress("");
      modalizeRef.current?.open();
    }
  }, [address]);

  const { data, status } = useSelector(selectLocationByName);

  return (
    <Box style={styles.container}>
      <Input
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
        variant="outline"
        style={styles.input}
      />
      {data && (
        <>
          <Text>lat:{data.latitude}</Text>
          <Text>lon:{data.longitude}</Text>
        </>
      )}
      <Button title="search" onPress={handleGeocode} />
      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <Box height={Dimensions.get("window").height / 1.18}>
          <Text>Some content here</Text>
          {/* <ChangeThemeButton /> */}
        </Box>
      </Modalize>
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
