import { AntDesign } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import {
  Box, Button, FlatList, Heading, IconButton, Input, Text, useColorMode,
} from 'native-base';
import React, {
  FC, useCallback, useEffect, useRef, useState,
} from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import normalize from 'react-native-normalize';
import { useSelector } from 'react-redux';
import ConfirmModal from '../../components/ConfirmModal';
import WeatherModal from '../../components/WeatherModal';
import { useThunkDispatch } from '../../core/store/store';
import { selectLocationByName, selectMobileStorage, selectWeather } from '../../core/store/weatherSlice/selectors';
import { getDataFromStorage } from '../../core/store/weatherSlice/thunks/getDataFromStorage';
import { getLocationByName } from '../../core/store/weatherSlice/thunks/getLocationByName';
import { removeLocationFromStorage } from '../../core/store/weatherSlice/thunks/removeLocationFromStorage';
import { setDataToStorage } from '../../core/store/weatherSlice/thunks/setDataToStorage';
import { StatusOfRequestEnum } from '../../core/types/enums/StatusOfRequestEnum';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: normalize(40),
    height: '100%',
    gap: normalize(30),
  },
  input: {
    fontSize: 20,
    maxWidth: '70%',
    alignSelf: 'center',
  },
});

const Settings: FC = () => {
  const isFocused = useIsFocused();
  const { colorMode } = useColorMode();

  const [showModal, setShowModal] = useState(false);
  const [touchedCity, setTouchedCity] = useState<string | null>(null);

  const [address, setAddress] = useState<string | undefined>('');
  const modalizeRef = useRef<Modalize>(null);

  const dispatch = useThunkDispatch();

  const { data, status, error } = useSelector(selectLocationByName);

  const { data: weatherData } = useSelector(selectWeather);

  useEffect(() => {
    dispatch(getDataFromStorage());
  }, [isFocused, weatherData]);

  // Set data to storage
  useEffect(() => {
    if (data && weatherData) {
      dispatch(
        setDataToStorage({
          ...data,
          name: weatherData.city.name,
        }),
      );
    }
  }, [data, weatherData]);

  // Delete data from Storage
  const handleDelete = (item: string) => {
    setShowModal(true);
    dispatch(removeLocationFromStorage(item));
    dispatch(getDataFromStorage());
  };

  // Display ModalView on CityName click
  const handleClickOpen = async (name: string) => {
    const {
      meta: { requestStatus },
    } = await dispatch(getLocationByName(name));

    if (requestStatus === 'rejected') return;
    modalizeRef.current?.open();
  };

  // Open ModalView on Search button click
  const handleGeocode = useCallback(async () => {
    if (address && address.trim().length) {
      Keyboard.dismiss();
      const {
        meta: { requestStatus },
      } = await dispatch(getLocationByName(address));
      if (requestStatus === 'rejected') return;
      modalizeRef.current?.open();
    }

    setAddress('');
  }, [address]);

  const { data: storageData } = useSelector(selectMobileStorage);

  return (
    <Box style={styles.container} bgColor={colorMode === 'dark' ? '#6d7685' : '#abe7f1'}>
      <Input
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
        variant="outline"
        style={styles.input}
      />
      {status === StatusOfRequestEnum.ERROR && <Text>{error}</Text>}

      <Button disabled={!address || !address?.trim().length} onPress={handleGeocode}>
        search
      </Button>
      <Text>Last results :</Text>

      <FlatList
        style={{
          width: '100%',
        }}
        data={storageData}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
            <TouchableOpacity
              key={index}
              onPress={() => handleClickOpen(item)}
              style={{
                padding: normalize(10),
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: normalize(10),
              }}
            >
              <Heading size="md" style={{ textAlign: 'center', alignSelf: 'center' }}>
                {item}
              </Heading>
            </TouchableOpacity>
            <IconButton
              icon={<AntDesign name="delete" size={24} color={colorMode === 'dark' ? 'white' : 'black'} />}
              onPress={() => {
                setShowModal(true);
                setTouchedCity(item);
              }}
              title="delete"
            />
          </Box>
        )}
      />
      {touchedCity && (
        <ConfirmModal
          name={touchedCity}
          showModal={showModal}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
        />
      )}
      <WeatherModal data={data} ref={modalizeRef} />
    </Box>
  );
};

export default Settings;
