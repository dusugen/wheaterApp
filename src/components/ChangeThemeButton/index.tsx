import { Box, Heading, Radio, useColorMode } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import normalize from "react-native-normalize";

interface ChangeThemeButtonProps {
  onChange: () => void;
}

export const ChangeThemeButton: FC<ChangeThemeButtonProps> = ({ onChange }) => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Box style={styles.container}>
      <Heading size="md">Choose theme</Heading>
      <Radio.Group
        name="myRadioGroup"
        accessibilityLabel="favorite number"
        value={colorMode ? colorMode : "light"}
        onChange={(nextValue) => {
          setColorMode(nextValue);
          onChange();
        }}
      >
        <Radio value="light" my={3} size="lg">
          light
        </Radio>
        <Radio value="dark" my={1} size="lg">
          dark
        </Radio>
      </Radio.Group>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: normalize(50),
  },
});
