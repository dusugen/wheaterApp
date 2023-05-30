import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import SafeAreaWrapper from './src/components/SafeAreaWrapper';
import { store } from './src/core/store/store';

const App = () => {
  const theme = extendTheme({
    components: {
      Heading: {
        baseStyle: {
          _light: { color: 'black' },
          _dark: { color: 'white' },
        },
      },
      Input: {
        baseStyle: {
          _light: { borderColor: 'black', placeholderTextColor: 'black' },
          _dark: { borderColor: 'white', placeholderTextColor: 'white' },
        },
      },
      SafeAreaView: {
        baseStyle: {
          _light: { backgroundColor: '#abe7f1' },
          _dark: { backgroundColor: '#6d7685' },
        },
      },
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NativeBaseProvider theme={theme}>
          <SafeAreaWrapper />
        </NativeBaseProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
