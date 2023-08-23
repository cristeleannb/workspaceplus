import React, {useEffect, useMemo, useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {format} from 'date-fns';

import {ManageTeamWorkforceTypes} from '@/types';
import {DynamicBottomSheet} from '@/components';
import {ManageTeamWorkforceBottomSheet} from '..';
import {useWMDirectReport} from '@/hooks/useWMDirectReport';

const WMDirectReportBottomSheet = () => {
  const sheetRef = useRef<BottomSheet>(null);

  const {selectedDate, reportData, bottomSheetTab, updateBottomSheetTab} =
    useWMDirectReport();

  const employeeData = useMemo(() => {
    const data = reportData[format(selectedDate, 'yyyy-MM-dd')] || {};

    if (bottomSheetTab) {
      return data[bottomSheetTab] || [];
    } else {
      return [];
    }
  }, [bottomSheetTab, selectedDate, reportData]);

  const tabCount = useMemo(() => {
    const data = reportData[format(selectedDate, 'yyyy-MM-dd')] || {};

    return {
      [ManageTeamWorkforceTypes.WFA]: (data[ManageTeamWorkforceTypes.WFA] || [])
        .length,
      [ManageTeamWorkforceTypes.WFB]: (data[ManageTeamWorkforceTypes.WFB] || [])
        .length,
      [ManageTeamWorkforceTypes.WFO]: (data[ManageTeamWorkforceTypes.WFO] || [])
        .length,
    };
  }, [selectedDate, reportData]);

  const openWSDirectReports = async () => {
    sheetRef.current?.expand();
  };

  const closeWSDirectReports = () => {
    sheetRef.current?.close();
  };

  const updateWorkforceData = async (key: ManageTeamWorkforceTypes) => {
    updateBottomSheetTab(key);
  };

  const onTabChange = (key: ManageTeamWorkforceTypes) => {
    updateWorkforceData(key);
  };

  useEffect(() => {
    if (bottomSheetTab) {
      openWSDirectReports();
    } else {
      closeWSDirectReports();
    }
  }, [bottomSheetTab]);

  return (
    <DynamicBottomSheet
      ref={sheetRef}
      onClose={() => updateBottomSheetTab(null)}>
      <ManageTeamWorkforceBottomSheet
        date={selectedDate}
        data={employeeData}
        tabCount={tabCount}
        selectedTab={bottomSheetTab || ManageTeamWorkforceTypes.WFA}
        onTabChange={onTabChange}
      />
    </DynamicBottomSheet>
  );
};

export default WMDirectReportBottomSheet;
