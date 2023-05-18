import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, extendTheme } from "native-base";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import BottomBar from "./src/components/BottomBar";
import { store } from "./src/core/store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
  const theme = extendTheme({
    components: {
      Heading: {
        baseStyle: {
          _light: { color: "white" },
          _dark: { color: "white" },
        },
      },
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NativeBaseProvider theme={theme}>
          <SafeAreaView style={styles.safeArea}>
            <NavigationContainer>
              <BottomBar />
            </NavigationContainer>
          </SafeAreaView>
        </NativeBaseProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#2749787c",
  },
});

export default App;
