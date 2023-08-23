import React, {useEffect, useMemo, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {format, startOfDay, endOfDay} from 'date-fns';

import {NavigationHeader, PieGraph, RequestWorkforceReport} from '@/views';
import {
  Button,
  CaretDown,
  Close,
  FWDColors,
  ShadowView,
  Typography,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import WMTypeTab, {WMTabs} from '@/views/tabs/WMTypeTab';
import WMGraphTypeTab, {WMGraphs} from '@/views/tabs/WMGraphTypeTab';
import WMEmployeeCountView from '@/views/workforce-monitoring/WMEmployeeCountView';
import WMByBranchView from '@/views/workforce-monitoring/WMByBranchView';
import WMByDivisionView from '@/views/workforce-monitoring/WMByDivisionView';
import WMDivisionBarGraphView from '@/views/workforce-monitoring/WMDivisionBarGraphView';
import {NavigationKey} from '@/navigations';
import {useGetSummaryReport, useGetWorkforceAllReports} from '@/services/query';
import {DateUtil} from '@/utils/date.util';
import {useScroll} from '@/hooks/useScroll';
import {EmployeePlanScheduleBranchWorkstationSummaryModel} from '@/services/api/api.service';
import {NoWorking} from '@/components/pictograms';

const WorkforceMonitoringScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<WMTabs>(WMTabs.DIVISION);
  const [selectedGraph, setSelectedGraph] = useState<WMGraphs>(WMGraphs.PIE);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const {AnimatedScrollView, collapsedHeader} = useScroll();

  const [currentDate] = useState(new Date());

  const {data: workforceReport} = useGetWorkforceAllReports({
    dateStart: DateUtil.asUTCDate(startOfDay(currentDate)).toISOString(),
    dateEnd: DateUtil.asUTCDate(endOfDay(currentDate)).toISOString(),
  });

  const {data: summary} = useGetSummaryReport({
    dateStart: DateUtil.asUTCDate(startOfDay(currentDate)).toISOString(),
    dateEnd: endOfDay(DateUtil.asUTCDate(currentDate)).toISOString(),
  });

  const onClose = () => {
    navigation.goBack();
  };

  const onTabChange = (tab: WMTabs) => {
    setSelectedTab(tab);
  };

  const onGraphChange = (graph: WMGraphs) => {
    setSelectedGraph(graph);
  };

  const summaryData = useMemo(() => {
    let data: {
      wfa?: EmployeePlanScheduleBranchWorkstationSummaryModel;
      wfb?: EmployeePlanScheduleBranchWorkstationSummaryModel;
      wfo?: EmployeePlanScheduleBranchWorkstationSummaryModel;
    } = {
      wfa: undefined,
      wfb: undefined,
      wfo: undefined,
    };
    if (summary) {
      const collectionData =
        summary?.employeePlanScheduleBranchWorkstationSummaryCollection || [];
      data.wfa = collectionData.find(type => type.workTypeId === 1);
      data.wfb = collectionData.find(type => type.workTypeId === 2);
      data.wfo = collectionData.find(type => type.workTypeId === 3);
    }
    return data;
  }, [summary]);

  useEffect(() => {
    const wfa = summaryData?.wfa?.totalCount || 0;
    const wfo = summaryData?.wfo?.totalCount || 0;
    const wfb = summaryData?.wfb?.totalCount || 0;

    if (wfa === 0 && wfo === 0 && wfb === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [summaryData]);

  const onRequestReportPress = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_REQUEST_REPORT,
      },
    });
  };

  const detailView = useMemo(() => {
    return selectedTab === WMTabs.DIVISION ? (
      <WMByDivisionView
        workforceRecordList={
          workforceReport?.employeePlanScheduleWorkstationCollection || []
        }
      />
    ) : (
      <WMByBranchView
        workforceRecordList={
          workforceReport?.employeePlanScheduleWorkstationCollection || []
        }
      />
    );
  }, [selectedTab, workforceReport]);

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
        <View style={[layoutStyles.cover]}>
          <NavigationHeader
            collapsedHeight={72}
            collapsed={collapsedHeader}
            title={
              <Typography
                label="Workforce Monitoring"
                variant="h2"
                color={FWDColors.white}
              />
            }
            leftAction={
              <Button
                iconOnly
                icon={<Close />}
                size="small"
                color="light"
                onPress={onClose}
              />
            }
          />
          <AnimatedScrollView>
            <View>
              <View
                style={{
                  paddingHorizontal: spacer(16),
                  paddingBottom: spacer(8),
                  paddingTop: spacer(24),
                }}>
                <ShadowView
                  level={6}
                  style={{
                    borderRadius: spacer(8),
                    padding: spacer(16),
                  }}>
                  <View>
                    <WMTypeTab
                      selectedTab={selectedTab}
                      onTabChange={onTabChange}
                    />
                  </View>
                  {selectedTab === WMTabs.DIVISION && (
                    <View>
                      <View
                        style={[
                          layoutStyles.row,
                          layoutStyles.betweenCenter,
                          {
                            paddingVertical: spacer(16),
                          },
                        ]}>
                        <TouchableOpacity
                          activeOpacity={0.75}
                          style={[layoutStyles.row, layoutStyles.centerCenter]}>
                          <Typography
                            style={{marginRight: spacer(8)}}
                            label="Today"
                            variant="l2-m"
                            color={FWDColors.greenDark}
                          />
                          <CaretDown
                            width={10}
                            height={10}
                            color={FWDColors.greenDark}
                          />
                        </TouchableOpacity>
                        <WMGraphTypeTab
                          selectedGraph={selectedGraph}
                          onGraphChange={onGraphChange}
                        />
                      </View>

                      <View>
                        <Typography
                          style={{marginBottom: spacer(16)}}
                          label={`${format(new Date(), 'eeee')} • ${format(
                            new Date(),
                            'MMMM d, yyyy',
                          )}`}
                          variant="l2-m"
                          color={FWDColors.greenDark}
                          align="center"
                        />
                      </View>

                      {isEmpty && (
                        <View style={layoutStyles.centerCenter}>
                          <NoWorking width={64} height={64} />
                          <Typography
                            label="No Employees Scheduled"
                            variant="h2"
                            color={FWDColors.orange}
                            style={{
                              marginTop: spacer(8),
                              marginBottom: spacer(12),
                            }}
                          />
                        </View>
                      )}

                      {selectedGraph === WMGraphs.PIE && !isEmpty && (
                        <View>
                          <View style={{marginBottom: spacer(16)}}>
                            <PieGraph
                              wfaCount={summaryData.wfa?.totalCount || 0}
                              wfoCount={summaryData.wfo?.totalCount || 0}
                              wfbCount={summaryData.wfb?.totalCount || 0}
                            />
                          </View>

                          <WMEmployeeCountView
                            wfaCount={summaryData.wfa?.totalCount || 0}
                            wfoCount={summaryData.wfo?.totalCount || 0}
                            wfbCount={summaryData.wfb?.totalCount || 0}
                          />
                        </View>
                      )}

                      {selectedGraph === WMGraphs.BAR && !isEmpty && (
                        <View>
                          <WMDivisionBarGraphView
                            wfaCount={summaryData.wfa?.totalCount || 0}
                            wfoCount={summaryData.wfo?.totalCount || 0}
                            wfbCount={summaryData.wfb?.totalCount || 0}
                          />
                        </View>
                      )}
                    </View>
                  )}
                </ShadowView>
              </View>

              {detailView}

              <View
                style={{
                  paddingHorizontal: spacer(16),
                  paddingTop: spacer(8),
                  paddingBottom: spacer(40),
                }}>
                <RequestWorkforceReport onPress={onRequestReportPress} />
              </View>
            </View>
          </AnimatedScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WorkforceMonitoringScreen;
