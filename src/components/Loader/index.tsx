import { HStack, Heading, Spinner } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import normalize from "react-native-normalize";

export const Loader = () => {
  return (
    <HStack style={styles.loader}>
      <Spinner accessibilityLabel="Loading posts" size="lg" />
      <Heading color="primary.500" fontSize="2xl">
        Loading
      </Heading>
    </HStack>
  );
};

const styles = StyleSheet.create({
  loader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: normalize(10),
  },
});
