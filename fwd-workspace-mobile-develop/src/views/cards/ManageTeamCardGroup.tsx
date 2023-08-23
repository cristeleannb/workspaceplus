import React, {useMemo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {format} from 'date-fns';
import {SvgProps} from 'react-native-svg';

import {Avatar, FWDColors, ShadowView, Typography} from '@/components';
import {Workspace, Office, Navigation} from '@/components/icons';
import {layoutStyles, spacer} from '@/utils';
import {ManageTeamWorkforceTypes} from '@/types';
import {useWMDirectReport} from '@/hooks/useWMDirectReport';

interface ScheduleTypeItem {
  key: ManageTeamWorkforceTypes;
  label: string;
  icon: React.ReactElement<SvgProps>;
  bgColor: string;
}

interface ManageTeamWorkforceProps {
  onPress: (key: ManageTeamWorkforceTypes) => void;
}

const scheduleTypeList: ScheduleTypeItem[] = [
  {
    key: ManageTeamWorkforceTypes.WFA,
    label: 'Working from Anywhere',
    icon: <Navigation width={18} height={18} color={FWDColors.greenDarker} />,
    bgColor: FWDColors.orange70,
  },
  {
    key: ManageTeamWorkforceTypes.WFB,
    label: 'Working from Branch',
    icon: <Office width={18} height={18} color={FWDColors.greenDarker} />,
    bgColor: FWDColors.yellow50,
  },
  {
    key: ManageTeamWorkforceTypes.WFO,
    label: 'Working from Office',
    icon: <Workspace width={18} height={18} color={FWDColors.greenDarker} />,
    bgColor: FWDColors.greenLight50,
  },
];

const ManageTeamCardGroup = ({onPress}: ManageTeamWorkforceProps) => {
  const {selectedDate, reportData} = useWMDirectReport();

  const dayReportData = useMemo(() => {
    const data = reportData[format(selectedDate, 'yyyy-MM-dd')];
    return data ? data : {};
  }, [reportData, selectedDate]);

  return (
    <View style={[layoutStyles.fullWidth]}>
      {scheduleTypeList.map((type, typeIndex) => (
        <TouchableOpacity
          key={type.key}
          activeOpacity={0.75}
          style={[
            layoutStyles.fullWidth,
            {
              marginTop: spacer(typeIndex > 0 ? 20 : 0),
            },
          ]}
          onPress={() => onPress(type.key)}>
          <ShadowView
            style={{
              backgroundColor: type.bgColor,
              paddingVertical: spacer(20),
              paddingHorizontal: spacer(16),
              borderRadius: spacer(8),
            }}>
            <View style={[layoutStyles.row]}>
              <View style={[layoutStyles.row, layoutStyles.cover]}>
                {type.icon}
                <Typography
                  label={type.label}
                  color={FWDColors.greenDarker}
                  variant="h2"
                  style={[layoutStyles.fullWidth, {marginLeft: spacer(10)}]}
                />
              </View>

              <View
                style={[
                  layoutStyles.row,
                  layoutStyles.cover,
                  layoutStyles.endCenter,
                ]}>
                {dayReportData[type.key]?.length > 3 ? (
                  <>
                    {dayReportData[type.key]
                      .slice(0, 3)
                      .map((member, index) => (
                        <View
                          key={index}
                          style={{
                            marginLeft: index > 0 ? spacer(-8) : spacer(0),
                          }}>
                          {/* TODO: update the avatar component to be supplied with gender */}
                          <Avatar
                            imageUrl={member.employeeImage}
                            gender={member.employeeGender}
                          />
                        </View>
                      ))}

                    <View
                      style={[
                        layoutStyles.centerCenter,
                        {
                          width: spacer(32),
                          height: spacer(32),
                          borderRadius: spacer(32),
                          borderWidth: spacer(1),
                          borderColor: FWDColors.white,
                          backgroundColor: FWDColors.greenDarker,
                          marginLeft: spacer(-8),
                        },
                      ]}>
                      <Typography
                        label={`+${dayReportData[type.key].length - 3}`}
                        variant="l3-b"
                        color={FWDColors.white}
                      />
                    </View>
                  </>
                ) : (
                  dayReportData[type.key]?.map((member, index) => (
                    <View
                      key={index}
                      style={{
                        marginLeft: index > 0 ? spacer(8) : spacer(0),
                      }}>
                      {/* TODO: update the avatar component to be supplied with gender */}
                      <Avatar
                        imageUrl={member.employeeImage}
                        gender={member.employeeGender}
                      />
                    </View>
                  ))
                )}
              </View>
            </View>
          </ShadowView>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ManageTeamCardGroup;
