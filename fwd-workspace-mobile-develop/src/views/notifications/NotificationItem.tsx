import {format} from 'date-fns';
import React, {useCallback, useMemo} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import _ from 'lodash';

import {FWDColors, Typography} from '@/components';
import {MessageRead, MessageUnread} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';
import {NotificationLoggerEntity} from '@/services/api/api.service';
import {NotificationCategoryEnum} from '@/types/notification.types';
import {NavigationKey} from '@/navigations';

interface NotificationItemProps extends NotificationLoggerEntity {
  onItemPress?: (id: number) => void;
}

const NotificationItem = (props: NotificationItemProps) => {
  const {
    notificationLoggerId,
    isRead,
    notificationMessage = '',
    notificationParam,
    callToActionText,
    notificationCategory,
    notificationDate = new Date(),
    onItemPress,
  } = props;

  const navigation = useNavigation();

  const onCallToActionPress = useCallback(() => {
    if (notificationLoggerId && !isRead) {
      onItemPress?.(notificationLoggerId);
    }

    switch (notificationCategory) {
      case NotificationCategoryEnum.MANAGE_TEAM_SCHEDULE:
        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_MANAGE_TEAM,
          },
        });
        break;

      case NotificationCategoryEnum.PLAN_SCHEDULE:
        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_PLAN_SCHEDULE_LOADER,
          },
        });
        break;

      case NotificationCategoryEnum.WORKSTATION:
        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_BOOK_WORKSTATION,
          },
        });
        break;

      case NotificationCategoryEnum.PARKING:
        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_RESERVE_PARKING,
          },
        });
        break;

      case NotificationCategoryEnum.CHECK_IN:
        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_QR_SCAN,
          },
        });
        break;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRead, notificationCategory, notificationLoggerId, onItemPress]);

  const header = useMemo(() => {
    let params: any = {};

    try {
      if (notificationParam) {
        params = JSON.parse(notificationParam);

        if (typeof params === 'string') {
          params = JSON.parse(params);
        }
      }
    } catch (error) {
      // console.log('error', error);
    }

    let notifMessage = notificationMessage;

    Object.keys(params).map(key => {
      notifMessage = notifMessage.replace(key, ` ${key} `);
    });

    const splittedMessages = notifMessage.split(' ');
    const variant = isRead ? 'l2-m' : 'h1';

    const msgComponent = _.map(splittedMessages, (msg, index) => {
      const key = msg;
      const label = params[key] ? params[key] : msg;
      const color = params[key] ? FWDColors.orange : FWDColors.greenDarker;
      const separator = index > 0 ? ' ' : '';

      return (
        <Typography
          label={`${separator}${label}`}
          variant={variant}
          color={color}
        />
      );
    });

    return (
      <Text
        style={{
          lineHeight: spacer(21),
        }}>
        {msgComponent}
      </Text>
    );
  }, [isRead, notificationMessage, notificationParam]);

  return (
    <View>
      <View
        style={[
          layoutStyles.row,
          {
            paddingVertical: spacer(12),
          },
        ]}>
        <View>
          {isRead ? (
            <MessageRead width={24} height={24} />
          ) : (
            <MessageUnread width={24} height={24} />
          )}
        </View>

        <View
          style={[
            layoutStyles.cover,
            {
              marginLeft: spacer(16),
            },
          ]}>
          <View
            style={[
              layoutStyles.cover,
              {
                marginBottom: spacer(8),
              },
            ]}>
            {header}
          </View>

          {callToActionText && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onCallToActionPress}>
              <View
                style={[
                  layoutStyles.cover,
                  layoutStyles.row,
                  layoutStyles.startCenter,
                  {
                    marginBottom: spacer(8),
                  },
                ]}>
                <Typography
                  label={callToActionText}
                  color={FWDColors.orange}
                  variant="b4-b"
                />
              </View>
            </TouchableOpacity>
          )}

          <View style={[layoutStyles.cover]}>
            <Typography
              label={format(new Date(notificationDate), 'MMM dd, yyy, h:mm aa')}
              variant="l3-b"
              color={FWDColors.grey4}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: spacer(4),
          marginBottom: spacer(16),
          height: spacer(1),
          backgroundColor: FWDColors.lightblue,
        }}
      />
    </View>
  );
};

export default NotificationItem;
