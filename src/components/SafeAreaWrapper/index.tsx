import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { useColorMode } from 'native-base';
import BottomBar from '../BottomBar';

const SafeAreaWrapper = () => {
  const { colorMode } = useColorMode();
  return (
    <>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: colorMode === 'light' ? '#abe7f1' : '#6d7685',
        }}
      />
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          flex: 1,
        }}
      >
        <NavigationContainer>
          <BottomBar />
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default SafeAreaWrapper;
