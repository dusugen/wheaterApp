import { useColorMode } from "native-base";
import React, { FC, PropsWithChildren } from "react";
import { ImageBackground } from "react-native";
import normalize from "react-native-normalize";

const nightImage = require("../../assets/images/night.jpeg");
const lightImage = require("../../assets/images/morning.jpeg");

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { colorMode } = useColorMode();

  const bgImage = colorMode === "light" ? lightImage : nightImage;
  return (
    <ImageBackground
      source={bgImage}
      alt="bg"
      resizeMode="cover"
      style={{ flex: 1, padding: normalize(10) }}
    >
      {children}
    </ImageBackground>
  );
};
