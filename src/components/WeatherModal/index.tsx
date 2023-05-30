import { Box, Text } from 'native-base';
import React, { forwardRef, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useSelector } from 'react-redux';

import { useThunkDispatch } from '../../core/store/store';
import { WeatherCoords } from '../../core/types/WeatherCoords';
import { StatusOfRequestEnum } from '../../core/types/enums/StatusOfRequestEnum';
import Layout from '../Layout';
import Loader from '../Loader';
import WeatherView from '../WeatherView';
import { getWeather } from '../../core/store/weatherSlice/thunks/getWeather';
import { resetWeather } from '../../core/store/weatherSlice/reducers';
import { selectWeather } from '../../core/store/weatherSlice/selectors';

interface WeatherModalProps {
  data: WeatherCoords | null;
}
const WeatherModal = forwardRef<Modalize, WeatherModalProps>(
  ({ data }, ref) => {
    const dispatch = useThunkDispatch();
    useEffect(() => {
      if (data) dispatch(getWeather(data));
    }, [data]);

    const { data: weatherData, status } = useSelector(selectWeather);

    const onClose = () => {
      dispatch(resetWeather());
    };

    return (
      <Modalize ref={ref} adjustToContentHeight onClose={onClose}>
        <Box height={Dimensions.get('window').height / 1.15}>
          {status === StatusOfRequestEnum.LOADING
            || (status === StatusOfRequestEnum.IDLE && <Loader />)}

          {status === StatusOfRequestEnum.ERROR && <Text>Error</Text>}

          {status === StatusOfRequestEnum.SUCCESS && weatherData && (
            <Layout>
              <WeatherView weatherData={weatherData} />
            </Layout>
          )}
        </Box>
      </Modalize>
    );
  },
);

export default WeatherModal;
