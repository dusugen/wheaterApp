import {
  Box, Heading, Radio, useColorMode,
} from 'native-base';
import React, { FC, memo } from 'react';
import { StyleSheet } from 'react-native';
import normalize from 'react-native-normalize';

interface ChangeThemeButtonProps {
  onChange: () => void;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '85%',
    gap: normalize(50),
  },
});

const ChangeThemeButton: FC<ChangeThemeButtonProps> = ({ onChange }) => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Box style={styles.container}>
      <Heading size="md">Choose theme</Heading>
      <Radio.Group
        name="myRadioGroup"
        accessibilityLabel="favorite number"
        value={colorMode || 'light'}
        onChange={(nextValue) => {
          setColorMode(nextValue);
          onChange();
        }}
      >
        <Radio value="light" my={3} size="lg">
          light
        </Radio>
        <Radio value="dark" my={1} size="lg">
          dark
        </Radio>
      </Radio.Group>
    </Box>
  );
};

export default memo(ChangeThemeButton);
