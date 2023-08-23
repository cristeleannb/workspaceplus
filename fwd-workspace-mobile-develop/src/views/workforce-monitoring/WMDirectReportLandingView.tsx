import React, {useMemo, useState} from 'react';
import {View, TouchableOpacity, LayoutChangeEvent} from 'react-native';
import {useModal} from 'react-native-modalfy';
import {addMonths, format, subMonths} from 'date-fns';

import {ModalStackParamsList} from '@/modals';
import {layoutStyles, spacer} from '@/utils';
import {
  AngleLeftThin,
  AngleRightThin,
  Calendar,
  CaretDown,
  FWDColors,
  Typography,
} from '@/components';
import {useWMDirectReport} from '@/hooks/useWMDirectReport';
import WMDirectReportWeeklyView from './WMDirectReportWeeklyView';
import WMDirectReportMonthlyView from './WMDirectReportMonthlyView';

const WMDirectReportLandingView = () => {
  const {openModal, closeModal} = useModal<ModalStackParamsList>();
  const {
    initialDate,
    viewDate,
    updateViewDate,
    viewMode,
    updateViewMode,
    updateSelectedDate,
  } = useWMDirectReport();
  const [rootWidth, setRootWidth] = useState(0);

  const onSelectMode = () => {
    openModal('ManageTeamCalendarModeSelectionMdal', {
      currentMode: viewMode,
      onSelect: newMode => {
        updateViewMode(newMode);
        closeModal();
      },
    });
  };

  const onRootLayout = (event: LayoutChangeEvent) => {
    setRootWidth(event.nativeEvent.layout.width);
  };

  const onPrevCalendar = () => {
    let newViewDate = viewDate;

    if (viewMode === 'Monthly') {
      newViewDate = subMonths(newViewDate, 1);
    }

    updateViewDate(newViewDate);
    updateSelectedDate(newViewDate);
  };

  const onNextCalendar = () => {
    let newViewDate = viewDate;

    if (viewMode === 'Monthly') {
      newViewDate = addMonths(newViewDate, 1);
    }

    updateViewDate(newViewDate);
    updateSelectedDate(newViewDate);
  };

  const contentView = useMemo(() => {
    if (viewMode === 'Weekly') {
      return (
        <WMDirectReportWeeklyView
          currentDate={viewDate}
          containerWidth={rootWidth}
          onDateChange={updateViewDate}
        />
      );
    } else if (viewMode === 'Monthly') {
      return (
        <WMDirectReportMonthlyView
          initialDate={initialDate}
          currentDate={viewDate}
          containerWidth={rootWidth}
        />
      );
    } else {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate, viewMode, viewDate, rootWidth]);

  const allowCalendarNavigation = useMemo(() => {
    return viewMode !== 'Weekly';
  }, [viewMode]);

  return (
    <View style={layoutStyles.fullWidth} onLayout={onRootLayout}>
      <View style={[layoutStyles.row, layoutStyles.betweenCenter]}>
        <View style={[layoutStyles.row, layoutStyles.startCenter]}>
          {allowCalendarNavigation && (
            <TouchableOpacity
              key="left-arrow"
              activeOpacity={0.75}
              onPress={onPrevCalendar}
              style={{
                marginRight: spacer(4),
              }}>
              <AngleLeftThin
                width={24}
                height={20}
                color={FWDColors.greenDarker}
              />
            </TouchableOpacity>
          )}

          <Calendar width={24} height={24} color={FWDColors.orange} />
          <Typography
            label={format(viewDate, 'MMMM yyyy')}
            variant="h2"
            color={FWDColors.greenDarker}
            style={{
              marginLeft: spacer(4),
            }}
          />

          {allowCalendarNavigation && (
            <TouchableOpacity
              key="right-arrow"
              activeOpacity={0.75}
              onPress={onNextCalendar}
              style={{
                marginLeft: spacer(8),
              }}>
              <AngleRightThin
                width={20}
                height={20}
                color={FWDColors.greenDarker}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity activeOpacity={0.75} onPress={onSelectMode}>
          <View style={[layoutStyles.row, layoutStyles.startCenter]}>
            <Typography
              label={viewMode}
              variant="l2-m"
              style={{
                marginRight: spacer(4),
              }}
            />
            <CaretDown width={12} height={12} color={FWDColors.greenDarker} />
          </View>
        </TouchableOpacity>
      </View>

      {rootWidth > 0 && (
        <View
          style={{
            marginTop: spacer(24),
            marginBottom: spacer(24),
          }}>
          {contentView}
        </View>
      )}
    </View>
  );
};

export default WMDirectReportLandingView;
