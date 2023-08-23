import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import PieChart from 'react-native-pie-chart';
import {SvgProps} from 'react-native-svg';

import {FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {Hub, PinLocationAlt, Wfo} from '@/components/pictograms';

export interface PieGraphProps {
  wfaCount: number;
  wfoCount: number;
  wfbCount: number;
}

export const PieGraph = (props: PieGraphProps) => {
  const [pieSeries, setPieSeries] = useState<number[]>([]);
  const [pieSeriesColors, setPieSeriesColors] = useState<string[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [pieOverlays, setPieOverlays] = useState<PieGraphOverlayData[]>([]);

  const pieWidth = 225;
  const baseRadius = pieWidth / 2 - ((pieWidth / 2) * 0.45) / 2;

  useEffect(() => {
    var series = [];
    var seriesColors = [];
    const overlays: PieGraphOverlayData[] = [];

    if (props.wfaCount > 0) {
      series.push(props.wfaCount);
      seriesColors.push(FWDColors.orange70);
      overlays.push({
        icon: <PinLocationAlt width={16} height={16} />,
        bgColor: FWDColors.orange70,
        count: props.wfaCount,
        anglePosition: 0,
        radius: baseRadius,
      });
    }

    if (props.wfbCount > 0) {
      series.push(props.wfbCount);
      seriesColors.push(FWDColors.yellow50);
      overlays.push({
        icon: <Hub width={16} height={16} />,
        bgColor: FWDColors.yellow50,
        count: props.wfbCount,
        anglePosition: 0,
        radius: baseRadius,
      });
    }

    if (props.wfoCount > 0) {
      series.push(props.wfoCount);
      seriesColors.push(FWDColors.greenLight50);
      overlays.push({
        icon: <Wfo width={16} height={16} />,
        bgColor: FWDColors.greenLight50,
        count: props.wfoCount,
        anglePosition: 0,
        radius: baseRadius,
      });
    }

    setPieSeries(series);
    setPieSeriesColors(seriesColors);
    calculateOverlayAngles(overlays);
  }, [baseRadius, props.wfaCount, props.wfbCount, props.wfoCount]);

  const calculateOverlayAngles = (items: PieGraphOverlayData[]) => {
    const totalEmployeeCount = items
      .map(item => item.count)
      .reduce((a, b) => a + b, 0);

    setTotalEmployees(totalEmployeeCount);

    let totalAngles = 0;
    items.map((item, index) => {
      let currentAngle = (item.count / totalEmployeeCount) * 360;

      if (index === 0) {
        items[index].anglePosition = -90;
      } else {
        items[index].anglePosition = totalAngles - 90;
      }

      totalAngles += currentAngle;
    });

    setPieOverlays(items);
  };

  return (
    <View style={[layoutStyles.centerCenter, layoutStyles.relative]}>
      <View
        style={[
          layoutStyles.centerCenter,
          layoutStyles.relative,
          {width: spacer(pieWidth)},
        ]}>
        <PieChart
          widthAndHeight={pieWidth}
          series={pieSeries}
          sliceColor={pieSeriesColors}
          doughnut={true}
          coverRadius={0.55}
          coverFill={FWDColors.white}
        />
        {pieOverlays.map((item, index) => (
          <PieGraphOverlay key={index} {...item} />
        ))}
      </View>

      <View style={[layoutStyles.absolute]}>
        <View>
          <Typography
            label={totalEmployees}
            variant="h5"
            color={FWDColors.greenDark}
            align="center"
          />
          <Typography
            label="Total Employees"
            variant="l3-m"
            color={FWDColors.grey4}
            align="center"
          />
        </View>
      </View>
    </View>
  );
};

export interface PieGraphOverlayData {
  icon: React.ReactElement<SvgProps>;
  bgColor: string;
  count: number;
  anglePosition: number;
  radius: number;
}

const PieGraphOverlay = (props: PieGraphOverlayData) => {
  const angleRad = (props.anglePosition * Math.PI) / 180;
  const x = props.radius * Math.cos(angleRad) + props.radius;
  const y = props.radius * Math.sin(angleRad) + props.radius;

  return (
    <View
      style={[
        layoutStyles.absolute,
        layoutStyles.centerCenter,
        {
          height: spacer(50),
          width: spacer(50),
          borderRadius: 100 / 2,
          zIndex: spacer(2),
          backgroundColor: props.bgColor,
          left: spacer(x),
          top: spacer(y),
        },
      ]}>
      <View
        style={[
          layoutStyles.centerCenter,
          {
            height: spacer(24),
            width: spacer(24),
            borderRadius: 100 / 2,
            backgroundColor: FWDColors.white,
          },
        ]}>
        {props.icon}
      </View>
    </View>
  );
};
