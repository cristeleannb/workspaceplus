import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  FlatList,
} from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';
import {
  eachHourOfInterval,
  format,
  isToday,
  isFuture,
  getHours,
} from 'date-fns';
import _ from 'lodash';

import {layoutStyles, spacer} from '@/utils';
import {Button, FWDColors, IconButton, Typography} from '@/components';
import {Close} from '@/components/icons';

import {BaseModal} from './BaseModal';
import {ModalStackParamsList} from '../CustomModalProvider';
import {setHours} from 'date-fns/esm';

interface HourlyInterval {
  id: string;
  date: Date;
  hour?: string;
  period?: string;
}

const itemHeight = 62;

interface TimeItemProps extends Omit<HourlyInterval, 'date' | 'id'> {
  selected?: boolean;
}

const TimeItem = memo(({hour, period, selected}: TimeItemProps) => {
  const color = useMemo(() => {
    return selected ? FWDColors.orange : FWDColors.greenDarker;
  }, [selected]);

  const variant = useMemo(() => {
    return selected ? 'h4' : 'b1-b';
  }, [selected]);

  if (!hour || !period) {
    return <View style={{height: spacer(itemHeight)}} />;
  }

  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.betweenCenter,
        {
          paddingVertical: spacer(16),
          paddingHorizontal: spacer(24),
          height: spacer(itemHeight),
        },
      ]}>
      <Typography
        label={hour}
        variant={variant}
        color={color}
        style={{width: spacer(40)}}
      />

      <Typography label=":" variant={variant} align="center" color={color} />

      <Typography
        label="00"
        variant={variant}
        align="right"
        color={color}
        style={{width: spacer(40)}}
      />

      <Typography
        label={period}
        variant={variant}
        align="right"
        color={color}
        style={{width: spacer(50)}}
      />
    </View>
  );
});

const hourlyInterval = (data: Date) => {
  let intervals = eachHourOfInterval({
    start: setHours(data, 1),
    end: setHours(data, 23),
  }).map(date => {
    const d: HourlyInterval = {
      id: `${Math.floor(Math.random() * 10000) + 1}`,
      date,
      hour: format(date, 'hh'),
      period: format(date, 'aa'),
    };

    return d;
  });

  /**
   * filter out the the previous time if the date is today
   */
  if (isToday(data)) {
    intervals = _.filter(intervals, t => isFuture(t.date));
  }

  return intervals;
};

const getIndexOfDate = (date: Date) => {
  const array = [...hourlyInterval(date)];
  for (let i = 0; i < 1; i++) {
    array.unshift({id: 'first-empty', date: new Date()});
    array.push({id: 'last-empty', date: new Date()});
  }

  return array.findIndex(d => getHours(d.date) === getHours(date)) - 1;
};

export const TimePickerModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParamsList, void, 'TimePickerModal'>
> = ({modal: {closeModal, getParam}}) => {
  const label = getParam('label');
  const date = getParam('date');

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    isToday(date) && getHours(new Date()) >= 9 ? 0 : getIndexOfDate(date),
  );
  const [canSave, setCanSave] = useState(true);

  // add empty items on first and last so that the highlighted item will always be on the center
  const paddedOptions: HourlyInterval[] = useMemo(() => {
    const array = [...hourlyInterval(date)];
    for (let i = 0; i < 1; i++) {
      array.unshift({id: 'first-empty', date: new Date()});
      array.push({id: 'last-empty', date: new Date()});
    }
    return array;
  }, [date]);

  const offsets = useMemo(
    () =>
      [...Array(paddedOptions.length)].map((x, i) => i * spacer(itemHeight)),
    [paddedOptions],
  );

  const handleOnScrollBeginDrag = useCallback(() => {
    setCanSave(false);
    setSelectedIndex(undefined);
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      let index = Math.floor(Math.floor(offsetY) / itemHeight);
      const last = Math.floor(offsetY % itemHeight);
      if (last > itemHeight / 2) {
        index++;
      }

      setSelectedIndex(index);
      setCanSave(true);
    },
    [],
  );

  const getItemLayout = useCallback(
    (__, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [],
  );

  const close = () => {
    closeModal();
  };

  const onPressSave = () => {
    if (selectedIndex !== undefined) {
      const selectedDate = hourlyInterval(date)[selectedIndex].date;
      getParam('onPressSave')(selectedDate);
    }
  };

  return (
    <BaseModal>
      <View style={[{padding: spacer(24)}]}>
        <View
          style={[
            layoutStyles.row,
            layoutStyles.startCenter,
            {marginBottom: spacer(24)},
          ]}>
          <View
            style={[
              layoutStyles.absolute,
              layoutStyles.row,
              layoutStyles.centerCenter,
              {
                left: spacer(0),
                right: spacer(0),
              },
            ]}>
            <Typography
              align="center"
              label={label}
              variant="h2"
              color={FWDColors.greenDarker}
              style={[layoutStyles.cover]}
            />
          </View>

          <IconButton
            size={24}
            iconSize={16}
            icon={<Close width={16} height={16} color={FWDColors.grey4} />}
            onPress={close}
          />
        </View>

        <View
          style={[
            layoutStyles.relative,
            {
              height: spacer(186),
            },
          ]}>
          <View
            style={[
              layoutStyles.absolute,
              layoutStyles.fullWidth,
              {
                top: spacer(itemHeight),
                backgroundColor: FWDColors.orange5,
                borderRadius: spacer(8),
                height: spacer(itemHeight),
              },
            ]}
          />

          <FlatList
            data={paddedOptions}
            renderItem={({item, index}) => (
              <TimeItem
                hour={item.hour}
                period={item.period}
                selected={selectedIndex === index - 1}
              />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            snapToOffsets={offsets}
            decelerationRate="fast"
            onMomentumScrollEnd={handleMomentumScrollEnd}
            onScrollBeginDrag={handleOnScrollBeginDrag}
            getItemLayout={getItemLayout}
            initialScrollIndex={selectedIndex}
          />
        </View>

        <View style={{marginTop: spacer(24)}}>
          <Button
            disabled={!canSave}
            label="Save"
            mode="contained"
            onPress={onPressSave}
          />
        </View>
      </View>
    </BaseModal>
  );
};
