import { HStack, Heading, Spinner } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import normalize from 'react-native-normalize';

const styles = StyleSheet.create({
  loader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: normalize(10),
  },
});

const Loader = () => (
  <HStack style={styles.loader}>
    <Spinner accessibilityLabel="Loading posts" size="lg" />
    <Heading color="primary.500" fontSize="2xl">
      Loading
    </Heading>
  </HStack>
);

export default Loader;
