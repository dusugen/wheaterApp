import { Box, Stack, Text, View, useTheme } from "native-base";
import React, { FC } from "react";
import { WeatherData } from "../../core/types/WeatherData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import normalize from "react-native-normalize";

interface WeatherTableProps {
  weatherData: WeatherData;
}

export const WeatherTable: FC<WeatherTableProps> = ({ weatherData }) => {

  return (
    <Box>
      <Stack space={normalize(10)} style={styles.stack}>
        <View style={styles.view}>
          <FontAwesome
            name="thermometer-three-quarters"
            size={normalize(32)}
            color="black"
          />
          <Text style={styles.text}>{weatherData.main.pressure} mm</Text>
        </View>
        <View style={styles.view}>
          <FontAwesome5 name="wind" size={normalize(32)} color="black" />
          <Text style={styles.text}>{weatherData.wind.speed} m/s</Text>
        </View>
        <View style={styles.view}>
          <MaterialCommunityIcons
            name="water-percent"
            size={normalize(38)}
            color="black"
          />
          <Text style={styles.text}>{weatherData.main.humidity}%</Text>
        </View>
      </Stack>
    </Box>
  );
};

const styles = StyleSheet.create({
  stack: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  view: {
    display: "flex",
    flexShrink: 33,
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(10),
  },
  text: {
    fontSize: normalize(18),
    color: "whitesmoke",
  },
});
