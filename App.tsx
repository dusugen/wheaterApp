import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, extendTheme, useColorMode } from "native-base";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import BottomBar from "./src/components/BottomBar";
import { store } from "./src/core/store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaWrapper } from "./src/components/SafeAreaWrapper";

const App = () => {
  const { colorMode } = useColorMode();
  console.log(colorMode, "mode");
  const theme = extendTheme({
    components: {
      Heading: {
        baseStyle: {
          _light: { color: "black" },
          _dark: { color: "white" },
        },
      },
      Input: {
        baseStyle: {
          _light: { borderColor: "black", placeholderTextColor: "black" },
          _dark: { borderColor: "white", placeholderTextColor: "white" },
        },
      },
      SafeAreaView: {
        baseStyle: {
          _light: { backgroundColor: "#abe7f1" },
          _dark: { backgroundColor: "#6d7685" },
        },
      },
    },
  });

  console.log(theme, "theme");

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
