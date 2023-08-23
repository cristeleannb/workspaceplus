import React, {useState, useCallback, useRef, useMemo, useEffect} from 'react';
import {View, TouchableOpacity, ScrollView, BackHandler} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/core';
import {useModal} from 'react-native-modalfy';
import _ from 'lodash';
import {
  differenceInHours,
  differenceInMonths,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  parse,
  setHours,
  setMilliseconds,
  setSeconds,
} from 'date-fns';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';
import {observer} from 'mobx-react';

import {
  ApprovedScheduleNote,
  ChangeScheduleCalendar,
  HolidayListBottomSheet,
  HolidayListNote,
  NavigationHeader,
  PastDeadlineScheduleNote,
  PastScheduleApprovalNote,
  PendingApprovalNote,
  PeopleManagerMessageAccordion,
  PlanScheduleCalendar,
  PlotScheduleCardGroup,
  PlotScheduleInstructionAccordion,
  PlotScheduleInstructionBottomSheet,
  ScheduleKey,
  ViewScheduleCalendar,
} from '@/views';
import {
  Button,
  Close,
  DynamicBottomSheet,
  FWDColors,
  InfoCircle,
  QuestionMark,
  Typography,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {ModalStackParamsList} from '@/modals';
import {
  useGetHoliday,
  useGetPlanSchedule,
  useGetWorkingCredits,
  useSavePlanSchedule,
  useSaveChangeSchedule,
} from '@/services/query/useSchedule';
import {NavigationKey, SchedulePlanRouteProp} from '@/navigations';
import {useStores} from '@/stores';
import {
  EmployeePlanScheduleValidityModel,
  HolidayModel,
  PlanScheduleDatesModel,
} from '@/services/api/api.service';
import {useTimeframe} from '@/hooks/useTimeframe';
import {DateUtil} from '@/utils/date.util';
import {useContainer} from '@/hooks/useContainer';

const PlanScheduleScreen = observer(() => {
  const {params} = useRoute<SchedulePlanRouteProp>();

  const sheetRef = useRef<BottomSheet>(null);
  const holidaySheetRef = useRef<BottomSheet>(null);
  const accordionRef = useRef<TransitioningView>(null);
  const cardGroupRef = useRef<TransitioningView>(null);

  const cardGroupTransition = <Transition.Change interpolation="easeInOut" />;

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {appSettingStore, authStore} = useStores();
  const {containerWidth, onContainerLayout} = useContainer();

  const {openModal, closeModal} = useModal<ModalStackParamsList>();
  const {
    currentDate,
    isPlanScheduleCurrentMonth,
    minCalendarDate,
    maxcalendarDate,
    planScheduleDate,
    planScheduleTimeframeStatus,
  } = useTimeframe();

  const [calendarHasChanged, setCalendarHasChanged] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(
    params && params.date ? new Date(params.date) : planScheduleDate,
  );
  const [selectedSchedKey, setSelectedSchedKey] = useState<ScheduleKey>();
  const [draftScheduleList, setDraftScheduleList] = useState<
    PlanScheduleDatesModel[]
  >([]);
  const [savedScheduleList, setSavedScheduleList] = useState<
    PlanScheduleDatesModel[]
  >([]);
  const [clearScheduleList, setClearScheduleList] = useState<
    PlanScheduleDatesModel[]
  >([]);
  const [holidayScheduleList, setHolidayScheduleList] = useState<
    HolidayModel[]
  >([]);

  const {data: workingCredits} = useGetWorkingCredits(
    DateUtil.getSchedulePeriod(scheduleDate),
  );
  const {mutateAsync: submitPlanSchedule, isLoading: isSubmitPlanLoading} =
    useSavePlanSchedule();
  const {mutateAsync: submitChangeSchedule, isLoading: isSubmitChangeLoading} =
    useSaveChangeSchedule();

  const {data: planScheduleView} = useGetPlanSchedule(
    DateUtil.getSchedulePeriod(scheduleDate),
  );

  const {data: holiday, isError: isHolidayError} = useGetHoliday(
    DateUtil.getSchedulePeriod(scheduleDate),
  );

  const onAccordionPress = () => {
    accordionRef.current?.animateNextTransition();
  };

  const onTipsPress = useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  const onSheetClose = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const onClose = () => {
    navigation.navigate(NavigationKey.DRAWER_MAIN, {
      screen: NavigationKey.STACK_LANDING,
      params: {
        screen: NavigationKey.SCREEN_LANDING,
      },
    });
  };

  const scheduleType = useMemo(() => {
    let type: 'plan' | 'change' | null = null;

    const newScheduleDate = setSeconds(setMilliseconds(scheduleDate, 0), 0);
    const newPlanScheduleDate = setSeconds(
      setMilliseconds(planScheduleDate, 0),
      0,
    );

    const isCurrentMonth = isSameMonth(scheduleDate, currentDate);

    if (isPlanScheduleCurrentMonth) {
      if (isCurrentMonth) {
        type = 'change';
      }
    } else {
      if (isEqual(newScheduleDate, newPlanScheduleDate)) {
        if (planScheduleTimeframeStatus === 'within') {
          if (planScheduleView) {
            switch (planScheduleView.recordStatus) {
              case 0:
              case 3:
                type = 'plan';
                break;

              case 2:
              case 4:
                type = 'change';
            }
          }
        } else {
          if (planScheduleView?.recordStatus === 3) {
            type = 'plan';
          } else {
            type = 'change';
          }
        }
      } else if (isBefore(newScheduleDate, newPlanScheduleDate)) {
        const monthDiff = differenceInMonths(
          newPlanScheduleDate,
          newScheduleDate,
        );

        if (monthDiff <= 1) {
          type = 'change';
        }
      }
    }

    return type;
  }, [
    currentDate,
    isPlanScheduleCurrentMonth,
    scheduleDate,
    planScheduleDate,
    planScheduleTimeframeStatus,
    planScheduleView,
  ]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        onClose();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const clearSelection = (clearAll?: boolean) => {
    if (clearAll) {
      setDraftScheduleList([]);
      setSavedScheduleList([]);
    } else {
      const newScheduleList = _.filter(draftScheduleList, schedule => {
        return !_.find(clearScheduleList, clearSchedule => {
          return schedule.scheduleDate && clearSchedule.scheduleDate
            ? isSameDay(
                new Date(schedule.scheduleDate),
                new Date(clearSchedule.scheduleDate),
              )
            : false;
        });
      });

      const newSavedScheduleList = _.filter(savedScheduleList, schedule => {
        return !_.find(clearScheduleList, clearSchedule => {
          return schedule.scheduleDate && clearSchedule.scheduleDate
            ? isSameDay(
                new Date(schedule.scheduleDate),
                new Date(clearSchedule.scheduleDate),
              )
            : false;
        });
      });

      setDraftScheduleList(newScheduleList);
      setSavedScheduleList(newSavedScheduleList);
    }

    setClearScheduleList([]);
  };

  const onClearAllsDate = () => {
    openModal('ClearDateSelectionModal', {
      selectionType: 'all',
      onYesPress: () => {
        clearSelection(true);
        closeModal('ClearDateSelectionModal');
      },
      onNoPress: () => closeModal('ClearDateSelectionModal'),
    });
  };

  const onClearDateSelection = () => {
    openModal('ClearDateSelectionModal', {
      selectionType: 'selected',
      onYesPress: () => {
        clearSelection();
        closeModal('ClearDateSelectionModal');
      },
      onNoPress: () => closeModal('ClearDateSelectionModal'),
    });
  };

  const onOutOfCredits = () => {
    openModal('OutOfCreditsModal', {
      onYesPress: () => closeModal('OutOfCreditsModal'),
    });
  };

  const onLockDates = () => {
    openModal('LockedDateModal', {
      onOkayPress: () => closeModal('LockedDateModal'),
    });
  };

  const onDraftSchedule = () => {
    const scheduleDatePeriod = DateUtil.getSchedulePeriod(scheduleDate);
    openModal('DraftScheduleModal', {
      draftSchedule: {
        employeeHasPlanScheduleId: planScheduleView?.employeeHasPlanScheduleId,
        month: scheduleDatePeriod.month,
        year: scheduleDatePeriod.year,
        planScheduleDates: [...draftScheduleList, ...savedScheduleList],
        recordStatus: planScheduleView?.recordStatus,
        approvalMessage: planScheduleView?.approvalMessage,
        approveByEmployee: planScheduleView?.approveByEmployee,
        approvedByEmployeeKeyId: planScheduleView?.approvedByEmployeeKeyId,
      },
      onYesPress: () => {
        setDraftScheduleList([]);
        onClose();
        closeModal('DraftScheduleModal');
      },
      onNoPress: () => closeModal('DraftScheduleModal'),
    });
  };

  const onSubmitSchedule = () => {
    if (scheduleType === 'plan') {
      openModal('SubmitScheduleModal', {
        onYesPress: () => {
          closeModal('SubmitScheduleModal');
          submitSchedule();
        },
        onNoPress: () => closeModal('SubmitScheduleModal'),
      });
    } else if (scheduleType === 'change') {
      submitSchedule();
    }
  };

  const submitSchedule = async () => {
    const scheduleDatePeriod = DateUtil.getSchedulePeriod(scheduleDate);

    try {
      if (scheduleType === null) {
        return;
      }

      if (scheduleType === 'plan') {
        await submitPlanSchedule({
          employeeHasPlanScheduleId:
            planScheduleView?.employeeHasPlanScheduleId,
          month: scheduleDatePeriod.month,
          year: scheduleDatePeriod.year,
          planScheduleDates: [...draftScheduleList, ...savedScheduleList],
          recordStatus: 1,
        });

        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_SUBMIT_SCHEDULE_SUCCESS,
            params: {
              name: authStore.fullName,
            },
          },
        });
      } else if (scheduleType === 'change') {
        await submitChangeSchedule({
          employeeHasPlanScheduleId:
            planScheduleView?.employeeHasPlanScheduleId,
          month: scheduleDatePeriod.month,
          year: scheduleDatePeriod.year,
          planScheduleDates: draftScheduleList,
          recordStatus: planScheduleView?.recordStatus,
        });

        navigation.navigate(NavigationKey.DRAWER_MAIN, {
          screen: NavigationKey.STACK_LANDING,
          params: {
            screen: NavigationKey.SCREEN_VIEW_SCHEDULE,
            params: {
              success: true,
            },
          },
        });
      }
    } catch (error: any) {
      if (error && error.status === 404) {
        if (error.data) {
          const errorData: EmployeePlanScheduleValidityModel = error.data;
          if (errorData.errorList) {
            const maxWfoDates = _.chain(errorData.errorList)
              .map(d => parse(d, 'mm/dd/yyyy', new Date()))
              .sortBy(d => d)
              .value();
            showMaxWFOModal(maxWfoDates);
          }
        }
      }
    }
  };

  const showMaxWFOModal = (dates: Date[]) => {
    openModal('PlanScheduleMaxWFOModal', {
      dates: dates,
    });
  };

  useEffect(() => {
    setSavedScheduleList(planScheduleView?.planScheduleDates || []);
  }, [planScheduleView?.planScheduleDates]);

  const scheduleCounter = useMemo(() => {
    const savedOfficeSchedules = _.filter(savedScheduleList, savedSchedule => {
      return savedSchedule.workTypeId === 3;
    });
    const draftOfficeSchedules = _.filter(draftScheduleList, savedSchedule => {
      return savedSchedule.workTypeId === 3;
    });

    const savedRemoteSchedules = _.filter(savedScheduleList, savedSchedule => {
      return savedSchedule.workTypeId === 1 || savedSchedule.workTypeId === 2;
    });
    const draftRemoteSchedules = _.filter(draftScheduleList, savedSchedule => {
      return savedSchedule.workTypeId === 1 || savedSchedule.workTypeId === 2;
    });

    const totalOffice =
      savedOfficeSchedules.length + draftOfficeSchedules.length;
    const totalRemote =
      savedRemoteSchedules.length + draftRemoteSchedules.length;
    const total = totalOffice + totalRemote;

    return {
      office: totalOffice,
      remote: totalRemote,
      total: total,
    };
  }, [savedScheduleList, draftScheduleList]);

  const allowDraft = useMemo(() => {
    if (planScheduleView) {
      if (planScheduleTimeframeStatus === 'within') {
        if (
          planScheduleView.recordStatus === 0 ||
          planScheduleView.recordStatus === 3
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }, [planScheduleView, planScheduleTimeframeStatus]);

  const clearable = useMemo(() => {
    if (planScheduleTimeframeStatus === 'within') {
      if (planScheduleView) {
        if (
          planScheduleView.recordStatus === 0 ||
          planScheduleView.recordStatus === 3
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }, [planScheduleView, planScheduleTimeframeStatus]);

  const displayNote = useMemo(() => {
    let note = null;

    if (isPlanScheduleCurrentMonth) {
      note = <PastScheduleApprovalNote currentDate={scheduleDate} />;
    } else {
      if (planScheduleView) {
        switch (planScheduleView.recordStatus) {
          case 0:
          case 3:
            if (planScheduleTimeframeStatus === 'within') {
              note = (
                <PlotScheduleInstructionAccordion
                  remoteCredits={workingCredits?.totalRemoteCredits}
                  officeCredits={workingCredits?.totalOfficeCredits}
                  onPress={onAccordionPress}
                />
              );
            } else {
              note = <PastScheduleApprovalNote currentDate={scheduleDate} />;
            }
            break;

          case 1:
            if (planScheduleTimeframeStatus === 'within') {
              note = <PendingApprovalNote currentDate={scheduleDate} />;
            } else {
              note = <PastScheduleApprovalNote currentDate={scheduleDate} />;
            }
            break;

          case 2:
            note = <ApprovedScheduleNote currentDate={planScheduleDate} />;
            break;

          case 4:
            note = <PastDeadlineScheduleNote currentDate={planScheduleDate} />;
            break;
        }
      }

      if (!isSameMonth(scheduleDate, planScheduleDate)) {
        note = <PastScheduleApprovalNote currentDate={scheduleDate} />;
      }
    }

    return note;
  }, [
    isPlanScheduleCurrentMonth,
    planScheduleView,
    planScheduleDate,
    scheduleDate,
    workingCredits,
    planScheduleTimeframeStatus,
  ]);

  const subNote = useMemo(() => {
    let note = null;

    if (
      !isPlanScheduleCurrentMonth &&
      planScheduleView &&
      isSameMonth(scheduleDate, planScheduleDate)
    ) {
      switch (planScheduleView.recordStatus) {
        case 2:
        case 4:
          note = (
            <View
              style={[
                layoutStyles.row,
                layoutStyles.centerCenter,
                {
                  marginTop: spacer(16),
                  paddingHorizontal: spacer(24),
                },
              ]}>
              <InfoCircle
                width={18}
                height={18}
                color={FWDColors.dark}
                style={{
                  marginRight: spacer(4),
                }}
              />
              <Typography
                label="You can no longer change approved WFO dates."
                color={FWDColors.dark}
                variant="l3-b"
              />
            </View>
          );
          break;
      }
    }

    return note;
  }, [
    isPlanScheduleCurrentMonth,
    planScheduleView,
    planScheduleDate,
    scheduleDate,
  ]);

  const declinedMessage = useMemo(() => {
    let message = null;

    if (planScheduleView?.recordStatus === 3) {
      message = (
        <PeopleManagerMessageAccordion
          managerName={planScheduleView.approveByEmployee || ''}
          message={planScheduleView.approvalMessage || ''}
        />
      );
    }

    return message;
  }, [planScheduleView]);

  const updateClearDateList = useCallback(
    (workTypeId: ScheduleKey, date: Date) => {
      const newDateList = [...clearScheduleList];

      const schedule = _.find(newDateList, dateItem => {
        return dateItem.scheduleDate
          ? isSameDay(new Date(dateItem.scheduleDate), new Date(date))
          : false;
      });

      if (!schedule) {
        const newScheduleDate: PlanScheduleDatesModel = {
          workTypeId: workTypeId,
          scheduleDate: new Date(date),
        };

        newDateList.push(newScheduleDate);
        setClearScheduleList(newDateList);
      }
    },
    [clearScheduleList],
  );

  const updatePlanDateList = useCallback(
    (date: Date) => {
      const dateList = [...draftScheduleList, ...savedScheduleList];
      const scheduleIndex = _.findIndex(dateList, dateItem => {
        return dateItem.scheduleDate
          ? isSameDay(new Date(dateItem.scheduleDate), new Date(date))
          : false;
      });
      const schedule = dateList[scheduleIndex];

      if (clearScheduleList.length > 0) {
        if (schedule) {
          updateClearDateList(schedule.workTypeId, date);
        }
      } else {
        if (selectedSchedKey && selectedSchedKey !== schedule?.workTypeId) {
          const totalOfficeLimit = workingCredits?.totalOfficeCredits || 0;
          const totalRemoteLimit = workingCredits?.totalRemoteCredits || 0;
          const totalCredits = totalOfficeLimit + totalRemoteLimit;

          const newScheduleDate: PlanScheduleDatesModel = {
            employeeHasPlanScheduleId:
              planScheduleView?.employeeHasPlanScheduleId,
            workTypeId: selectedSchedKey,
            scheduleDate: date,
          };

          const newDateList = [...draftScheduleList];
          const dateIndex = _.findIndex(draftScheduleList, dateItem => {
            return dateItem.scheduleDate
              ? isSameDay(new Date(dateItem.scheduleDate), new Date(date))
              : false;
          });

          if (schedule) {
            if (schedule.workTypeId === 3 && selectedSchedKey !== 3) {
              if (scheduleCounter.remote >= totalRemoteLimit) {
                onOutOfCredits();
                return;
              }
            }

            if (dateIndex < 0) {
              const savedScheduleIndex = _.findIndex(
                savedScheduleList,
                dateItem => {
                  return dateItem.scheduleDate
                    ? isSameDay(new Date(dateItem.scheduleDate), new Date(date))
                    : false;
                },
              );

              if (savedScheduleIndex >= 0) {
                const newSavedScheduleList = [...savedScheduleList];
                newSavedScheduleList.splice(savedScheduleIndex, 1);
                setSavedScheduleList(newSavedScheduleList);
              }

              newDateList.push(newScheduleDate);
            } else {
              const oldSchedule = newDateList[dateIndex];
              newDateList[dateIndex] = {
                ...oldSchedule,
                ...newScheduleDate,
              };
            }
          } else {
            if (scheduleCounter.total >= totalCredits) {
              return;
            }

            if (selectedSchedKey !== 3) {
              if (scheduleCounter.remote >= totalRemoteLimit) {
                onOutOfCredits();
                return;
              }
            }

            newDateList.push(newScheduleDate);
          }

          setDraftScheduleList(newDateList);
          setCalendarHasChanged(true);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedSchedKey,
      planScheduleView,
      workingCredits,
      draftScheduleList,
      scheduleCounter,
      savedScheduleList,
      updateClearDateList,
    ],
  );

  const updateChangeDateList = useCallback(
    (date: Date) => {
      const hoursDiff = differenceInHours(
        DateUtil.asUTCDateTime(setHours(date, 9)),
        DateUtil.asUTCDateTime(new Date()),
      );

      if (hoursDiff < appSettingStore.changeScheduleLimit) {
        return true;
      }

      const dateList = [...savedScheduleList, ...draftScheduleList];
      const schedule = _.find(dateList, dateItem => {
        return dateItem.scheduleDate
          ? isSameDay(new Date(dateItem.scheduleDate), new Date(date))
          : false;
      });

      if (
        selectedSchedKey &&
        schedule &&
        selectedSchedKey !== schedule.workTypeId
      ) {
        if (schedule.isLock) {
          onLockDates();
        } else {
          const totalRemoteLimit = workingCredits?.totalRemoteCredits || 0;

          const newScheduleDate: PlanScheduleDatesModel = {
            employeeHasPlanScheduleId:
              planScheduleView?.employeeHasPlanScheduleId,
            workTypeId: selectedSchedKey,
            scheduleDate: date,
          };

          const newDraftDateList = [...draftScheduleList];
          const dateIndex = _.findIndex(draftScheduleList, dateItem => {
            return dateItem.scheduleDate
              ? isSameDay(new Date(dateItem.scheduleDate), new Date(date))
              : false;
          });

          if (dateIndex < 0) {
            const savedScheduleIndex = _.findIndex(
              savedScheduleList,
              dateItem => {
                return dateItem.scheduleDate
                  ? isSameDay(new Date(dateItem.scheduleDate), new Date(date))
                  : false;
              },
            );

            let oldSavedSchedule: PlanScheduleDatesModel = {};

            if (savedScheduleIndex >= 0) {
              oldSavedSchedule = savedScheduleList[savedScheduleIndex];
              const newSavedScheduleList = [...savedScheduleList];
              newSavedScheduleList.splice(savedScheduleIndex, 1);
              setSavedScheduleList(newSavedScheduleList);
            }

            newDraftDateList.push({
              ...oldSavedSchedule,
              ...newScheduleDate,
            });
          } else {
            const oldSchedule = newDraftDateList[dateIndex];

            if (oldSchedule.workTypeId === 3 && selectedSchedKey !== 3) {
              if (scheduleCounter.remote >= totalRemoteLimit) {
                onOutOfCredits();
                return;
              }
            }

            newDraftDateList[dateIndex] = {
              ...oldSchedule,
              ...newScheduleDate,
            };
          }

          setDraftScheduleList(newDraftDateList);
          setCalendarHasChanged(true);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      appSettingStore.changeScheduleLimit,
      selectedSchedKey,
      planScheduleView,
      workingCredits,
      draftScheduleList,
      scheduleCounter,
      savedScheduleList,
    ],
  );

  const updateDateList = useCallback(
    (date: Date) => {
      if (scheduleType === null) {
        return;
      }

      if (scheduleType === 'plan') {
        updatePlanDateList(date);
      } else if (scheduleType === 'change') {
        updateChangeDateList(date);
      }
    },
    [scheduleType, updatePlanDateList, updateChangeDateList],
  );

  const onCancelClearDate = useCallback(
    (date: Date) => {
      const newDateList = [...clearScheduleList];

      const dateIndex = _.findIndex(clearScheduleList, dateItem => {
        return dateItem.scheduleDate
          ? isSameDay(new Date(dateItem.scheduleDate), new Date(date))
          : false;
      });

      newDateList.splice(dateIndex, 1);
      setClearScheduleList(newDateList);
    },
    [clearScheduleList],
  );

  const calendarView = useMemo(() => {
    let calendar = null;

    if (isSameMonth(planScheduleDate, scheduleDate)) {
      if (planScheduleView) {
        switch (planScheduleView.recordStatus) {
          case 0:
          case 1:
          case 3:
            calendar = (
              <PlanScheduleCalendar
                initialDate={scheduleDate}
                schedules={[...savedScheduleList, ...draftScheduleList]}
                allowClear={clearable}
                clearSchedules={clearScheduleList}
                holidaySchedules={holidayScheduleList}
                onDayPress={updateDateList}
                onDayLongPress={updateClearDateList}
                onCancelClearDate={onCancelClearDate}
                onMonthChange={setScheduleDate}
                minDate={minCalendarDate}
                maxDate={maxcalendarDate}
                containerWidth={containerWidth}
              />
            );
            break;

          case 2:
          case 4:
            calendar = (
              <ChangeScheduleCalendar
                savedSchedules={savedScheduleList}
                draftSchedules={draftScheduleList}
                holidaySchedules={holidayScheduleList}
                onDayPress={updateDateList}
                initialDate={scheduleDate}
                onMonthChange={setScheduleDate}
                minDate={minCalendarDate}
                maxDate={maxcalendarDate}
                containerWidth={containerWidth}
              />
            );
            break;

          default:
            break;
        }
      }
    } else {
      const newScheduleDate = setSeconds(setMilliseconds(scheduleDate, 0), 0);
      const newPlanScheduleDate = setSeconds(
        setMilliseconds(planScheduleDate, 0),
        0,
      );

      const monthDiff = differenceInMonths(
        newPlanScheduleDate,
        newScheduleDate,
      );

      if (monthDiff <= 1) {
        calendar = (
          <ChangeScheduleCalendar
            savedSchedules={savedScheduleList}
            draftSchedules={draftScheduleList}
            holidaySchedules={holidayScheduleList}
            onDayPress={updateDateList}
            initialDate={scheduleDate}
            onMonthChange={setScheduleDate}
            minDate={minCalendarDate}
            maxDate={maxcalendarDate}
            containerWidth={containerWidth}
          />
        );
      } else {
        calendar = (
          <ViewScheduleCalendar
            initialDate={scheduleDate}
            schedules={planScheduleView?.planScheduleDates || []}
            onMonthChange={setScheduleDate}
            minDate={minCalendarDate}
            maxDate={maxcalendarDate}
            containerWidth={containerWidth}
          />
        );
      }
    }

    return calendar;
  }, [
    scheduleDate,
    planScheduleView,
    planScheduleDate,
    draftScheduleList,
    clearable,
    clearScheduleList,
    updateDateList,
    updateClearDateList,
    onCancelClearDate,
    savedScheduleList,
    holidayScheduleList,
    minCalendarDate,
    maxcalendarDate,
    containerWidth,
  ]);

  const showFooter = useMemo(() => {
    const newScheduleDate = setSeconds(setMilliseconds(scheduleDate, 0), 0);
    const newPlanScheduleDate = setSeconds(
      setMilliseconds(planScheduleDate, 0),
      0,
    );

    const isCurrentMonth = isSameMonth(scheduleDate, currentDate);

    if (isPlanScheduleCurrentMonth) {
      if (isCurrentMonth) {
        return true;
      } else {
        return false;
      }
    }

    if (isEqual(newScheduleDate, newPlanScheduleDate)) {
      if (planScheduleTimeframeStatus === 'within') {
        if (planScheduleView?.recordStatus === 1) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }

    if (isBefore(newScheduleDate, newPlanScheduleDate)) {
      const monthDiff = differenceInMonths(
        newPlanScheduleDate,
        newScheduleDate,
      );

      if (monthDiff <= 1) {
        return true;
      } else {
        return false;
      }
    } else {
      if (isAfter(newScheduleDate, newPlanScheduleDate)) {
        const monthDiff = differenceInMonths(
          newScheduleDate,
          newPlanScheduleDate,
        );

        if (monthDiff > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }, [
    currentDate,
    isPlanScheduleCurrentMonth,
    scheduleDate,
    planScheduleDate,
    planScheduleTimeframeStatus,
    planScheduleView,
  ]);

  const disableSubmit = useMemo(() => {
    let shouldDisableBySchedule = true;

    if (isSameMonth(scheduleDate, planScheduleDate)) {
      if (planScheduleView) {
        switch (planScheduleView.recordStatus) {
          case 0:
          case 1:
            shouldDisableBySchedule = false;
            break;
        }
      }
    }

    const calendarChanged = !calendarHasChanged && shouldDisableBySchedule;
    const incompleteCredits =
      scheduleCounter.total <
      (workingCredits?.totalOfficeCredits || 0) +
        (workingCredits?.totalRemoteCredits || 0);

    return calendarChanged || incompleteCredits;
  }, [
    calendarHasChanged,
    scheduleDate,
    scheduleCounter,
    planScheduleDate,
    planScheduleView,
    workingCredits,
  ]);

  useEffect(() => {
    if (!isHolidayError) {
      setHolidayScheduleList(holiday?.holidays || []);
    } else {
      setHolidayScheduleList([]);
    }
  }, [holiday, isHolidayError]);

  useEffect(() => {
    setClearScheduleList([]);
    setDraftScheduleList([]);
    setSelectedSchedKey(undefined);
    setCalendarHasChanged(false);
  }, [scheduleDate]);

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
            paddingBottom: spacer(insets.bottom),
          },
        ]}>
        <View style={[layoutStyles.cover]}>
          <NavigationHeader
            title={
              <Typography
                label="Plan your schedule"
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
            rightAction={
              <Button
                iconOnly
                icon={<QuestionMark />}
                size="small"
                color="light"
                onPress={onTipsPress}
              />
            }
          />

          {displayNote && (
            <View
              style={[
                layoutStyles.fullWidth,
                {
                  paddingHorizontal: spacer(16),
                  marginTop: spacer(-36),
                },
              ]}>
              {displayNote}
            </View>
          )}
          {subNote && subNote}

          {declinedMessage && (
            <View
              style={[
                layoutStyles.row,
                layoutStyles.centerCenter,
                {
                  marginTop: spacer(16),
                  paddingHorizontal: spacer(24),
                },
              ]}>
              {declinedMessage}
            </View>
          )}

          {scheduleType !== null && (
            <Transitioning.View
              ref={cardGroupRef}
              transition={cardGroupTransition}
              style={[
                layoutStyles.row,
                layoutStyles.fullWidth,
                {
                  paddingHorizontal: spacer(16),
                  marginTop: spacer(24),
                },
              ]}>
              {
                <PlotScheduleCardGroup
                  selectedKey={selectedSchedKey}
                  onCardPress={setSelectedSchedKey}
                  remoteCredits={workingCredits?.totalRemoteCredits}
                  officeCredits={workingCredits?.totalOfficeCredits}
                  usedCredits={scheduleCounter.remote}
                />
              }
            </Transitioning.View>
          )}

          <ScrollView style={[layoutStyles.cover]}>
            <View
              style={[
                {
                  paddingBottom: spacer(24),
                },
              ]}>
              <View
                style={{
                  marginTop: spacer(24),
                  paddingHorizontal: spacer(24),
                }}>
                <View onLayout={onContainerLayout}>{calendarView}</View>
              </View>

              {clearable &&
                (savedScheduleList.length > 0 ||
                  draftScheduleList.length > 0) && (
                  <View
                    style={[
                      layoutStyles.row,
                      layoutStyles.endCenter,
                      {
                        marginTop: spacer(20),
                        paddingRight: spacer(20),
                      },
                    ]}>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => onClearAllsDate()}>
                      <Typography
                        label="Clear All"
                        color={FWDColors.greenDarker}
                        variant="l3-m"
                      />
                    </TouchableOpacity>
                  </View>
                )}

              {holidayScheduleList?.length > 0 && (
                <View
                  style={{
                    marginTop: spacer(24),
                    paddingHorizontal: spacer(16),
                  }}>
                  <HolidayListNote
                    holidays={holidayScheduleList}
                    onPress={() => holidaySheetRef?.current?.expand()}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {showFooter && (
          <View
            style={[
              layoutStyles.row,
              {
                paddingVertical: spacer(16),
                paddingHorizontal: spacer(24),
                borderTopWidth: spacer(1),
                borderTopColor: FWDColors.grey1,
                backgroundColor: FWDColors.white,
              },
            ]}>
            {clearScheduleList.length > 0 ? (
              <View
                style={[
                  layoutStyles.cover,
                  layoutStyles.row,
                  layoutStyles.startCenter,
                ]}>
                <View style={[layoutStyles.row, layoutStyles.startCenter]}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => {
                      setClearScheduleList([]);
                    }}>
                    <Close
                      width={18}
                      height={18}
                      color={FWDColors.greenDarker}
                    />
                  </TouchableOpacity>
                  <Typography
                    style={{
                      marginLeft: spacer(16),
                      marginRight: spacer(8),
                      color: FWDColors.greenDarker,
                    }}
                    label={clearScheduleList.length}
                    variant="h2"
                  />
                  <Typography
                    style={{
                      marginHorizontal: spacer(8),
                      color: FWDColors.greenDarker,
                    }}
                    label={
                      clearScheduleList.length === 1
                        ? 'Selected Date'
                        : 'Selected Dates'
                    }
                    variant="b3-b"
                  />
                </View>
                <Button
                  label="Clear Selection"
                  mode="outlined"
                  onPress={onClearDateSelection}
                />
              </View>
            ) : (
              <>
                {allowDraft && (
                  <Button
                    label="Save for later"
                    mode="outlined"
                    style={[
                      layoutStyles.cover,
                      {
                        marginRight: spacer(24),
                      },
                    ]}
                    onPress={onDraftSchedule}
                  />
                )}
                <Button
                  label="Submit"
                  style={[layoutStyles.cover]}
                  disabled={disableSubmit}
                  onPress={onSubmitSchedule}
                  loading={isSubmitPlanLoading || isSubmitChangeLoading}
                />
              </>
            )}
          </View>
        )}
      </View>

      <DynamicBottomSheet ref={sheetRef}>
        <PlotScheduleInstructionBottomSheet onClose={onSheetClose} />
      </DynamicBottomSheet>

      <DynamicBottomSheet ref={holidaySheetRef}>
        <HolidayListBottomSheet holidays={holidayScheduleList} />
      </DynamicBottomSheet>
    </SafeAreaView>
  );
});

export default PlanScheduleScreen;
