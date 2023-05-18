import { Radio, useColorMode } from "native-base";
import React from "react";

export const ChangeThemeButton = () => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Radio.Group
      name="myRadioGroup"
      accessibilityLabel="favorite number"
      value={colorMode ? colorMode : "light"}
      onChange={(nextValue) => {
        setColorMode(nextValue);
      }}
    >
      <Radio value="light" my={1}>
        light
      </Radio>
      <Radio value="dark" my={1}>
        dark
      </Radio>
    </Radio.Group>
  );
};
