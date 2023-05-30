import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Box, Stack, Text, View,
} from 'native-base';
import React, { FC, memo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import normalize from 'react-native-normalize';
import { WeatherData } from '../../core/types/WeatherData';

const styles = StyleSheet.create({
  stack: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  view: {
    marginTop: Platform.OS === 'android' ? normalize(25) : 0,
    display: 'flex',
    flexShrink: 33,
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(10),
  },
  text: {
    fontSize: normalize(18),
    color: 'whitesmoke',
  },
});

interface WeatherTableProps {
  weatherData: WeatherData;
}

const WeatherTable: FC<WeatherTableProps> = ({ weatherData }) => (
  <Box>
    <Stack space={normalize(10)} style={styles.stack}>
      <View style={styles.view}>
        <FontAwesome name="thermometer-three-quarters" size={normalize(32)} color="white" />
        <Text
          style={{
            fontSize: normalize(18),
            color: 'white',
          }}
        >
          {weatherData.list[0].main.pressure}
          {' '}
          mm
        </Text>
      </View>
      <View style={styles.view}>
        <FontAwesome5 name="wind" size={normalize(32)} color="white" />
        <Text
          style={{
            fontSize: normalize(18),
            color: 'white',
          }}
        >
          {weatherData.list[0].wind.speed}
          {' '}
          m/s
        </Text>
      </View>
      <View style={styles.view}>
        <MaterialCommunityIcons name="water-percent" size={normalize(38)} color="white" />
        <Text
          style={{
            fontSize: normalize(18),
            color: 'white',
          }}
        >
          {weatherData.list[0].main.humidity}
          %
        </Text>
      </View>
    </Stack>
  </Box>
);

export default memo(WeatherTable);
