import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';

import {Button, Close, FWDColors, Typography} from '@/components';
import {NoNotif, NotifSparkles} from '@/components/pictograms';
import {layoutStyles, spacer} from '@/utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NotificationItem} from '@/views';
import {
  useGetNotificationList,
  useGetNotificationStatus,
  useMarkAllAsReadNotification,
  useReadNotification,
} from '@/services/query/useNotification';
import {NotificationLoggerEntity} from '@/services/api/api.service';

const NotificationListScreen = () => {
  const navigation = useNavigation();

  const [notificationList, setNotificationList] = useState<
    NotificationLoggerEntity[] | undefined
  >();

  const {
    data,
    refetch,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetNotificationList({
    pageSize: 50,
  });
  const {data: notifStatusData} = useGetNotificationStatus();
  const {mutateAsync: setNotificationAsRead} = useReadNotification();
  const {mutateAsync: markAllNotificationAsRead} =
    useMarkAllAsReadNotification();

  const onRefresh = useCallback(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoadMore = useCallback(() => {
    fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNotificationPress = async (id: number) => {
    try {
      await setNotificationAsRead([id]);
    } catch (error) {
      // console.log('onNotificationPress error', error);
    }
  };

  const onMarkAllAsReadPress = async () => {
    try {
      await markAllNotificationAsRead();
    } catch (error) {
      // console.log('onMarkAllAsReadPress error', error);
    }
  };

  const notificationStatus = useMemo(() => {
    let unreadCount = 0;
    let hasUnread = false;
    let unreadMessage = '';

    if (notifStatusData && !!notifStatusData.totalUnreadNotifications) {
      unreadCount = notifStatusData.totalUnreadNotifications;

      if (unreadCount > 0) {
        hasUnread = true;
      }
    }

    unreadMessage = `You have ${
      hasUnread ? unreadCount : 'no'
    } unread messages`;

    return {
      unreadCount,
      hasUnread,
      unreadMessage,
    };
  }, [notifStatusData]);

  useEffect(() => {
    if (data) {
      const notifList: NotificationLoggerEntity[] = (data.pages || []).flatMap(
        p => p.data || [],
      );
      setNotificationList(notifList);
    }
  }, [data]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      <View
        style={[
          layoutStyles.cover,
          {
            backgroundColor: FWDColors.white,
          },
        ]}>
        <View
          style={[
            layoutStyles.row,
            {
              backgroundColor: FWDColors.orange,
              paddingHorizontal: spacer(16),
              paddingTop: spacer(12),
              borderBottomLeftRadius: spacer(24),
            },
          ]}>
          <View style={[layoutStyles.cover, layoutStyles.betweenStart]}>
            <Button
              iconOnly
              icon={<Close />}
              size="small"
              iconSize={20}
              color="light"
              onPress={() => navigation.goBack()}
            />

            <View
              style={[
                {
                  paddingBottom: spacer(24),
                },
              ]}>
              <Typography
                label="Notifications"
                color={FWDColors.white}
                variant="b1-b"
              />
              <Typography
                label={notificationStatus.unreadMessage}
                color={FWDColors.white}
                variant="b4-b"
              />
            </View>
          </View>

          <View
            style={[
              {
                paddingBottom: spacer(12),
              },
            ]}>
            <NotifSparkles width={110} height={110} />
          </View>
        </View>

        <View
          style={[
            layoutStyles.cover,
            {
              marginTop: spacer(24),
              backgroundColor: FWDColors.white,
            },
          ]}>
          {isLoading ? (
            <ActivityIndicator size={24} color={FWDColors.orange} />
          ) : (
            <>
              {!isLoading &&
                !!notificationList &&
                notificationList.length === 0 && (
                  <View style={[layoutStyles.startCenter]}>
                    <NoNotif width={84} height={82} />
                    <View
                      style={{
                        marginTop: spacer(8),
                      }}>
                      <Typography
                        label="No Notifications Yet"
                        variant="h2"
                        color={FWDColors.orange}
                        align="center"
                      />
                    </View>
                  </View>
                )}
            </>
          )}

          {notificationList && (
            <>
              {notificationList.length > 0 && (
                <View
                  style={{
                    paddingHorizontal: spacer(24),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={onMarkAllAsReadPress}>
                    <Typography
                      label="Mark all as read"
                      variant="l3-b"
                      color={FWDColors.orange}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <View
                style={[
                  layoutStyles.cover,
                  {
                    marginTop: spacer(16),
                  },
                ]}>
                <FlatList
                  data={notificationList}
                  keyExtractor={(item, index) =>
                    item.notificationLoggerId?.toString() || index.toString()
                  }
                  renderItem={({item}) => (
                    <NotificationItem
                      {...item}
                      onItemPress={onNotificationPress}
                    />
                  )}
                  style={{
                    paddingHorizontal: spacer(24),
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={isFetching}
                      onRefresh={onRefresh}
                    />
                  }
                  onEndReachedThreshold={0.01}
                  onEndReached={onLoadMore}
                />

                {isFetchingNextPage && (
                  <ActivityIndicator size={24} color={FWDColors.orange} />
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationListScreen;
