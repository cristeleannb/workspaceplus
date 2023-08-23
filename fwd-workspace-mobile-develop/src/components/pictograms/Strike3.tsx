import * as React from 'react';
import Svg, {SvgProps, Circle, Path} from 'react-native-svg';

function SvgStrike3(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 34 34"
      fill="none"
      ref={svgRef}
      {...props}>
      <Circle cx={17} cy={17} r={16} fill="#183028" />
      <Path
        d="M2.6 17c0 7.953 6.448 14.4 14.4 14.4 3.877 0 7.395-1.531 9.984-4.022M2.6 17c0-5.83 3.465-10.85 8.447-13.116A14.348 14.348 0 0117.002 2.6"
        stroke="#B30909"
        strokeWidth={4}
      />
      <Path
        d="M17.001 2.6c7.953 0 14.4 6.447 14.4 14.4 0 2.623-.701 5.082-1.927 7.2a14.46 14.46 0 01-2.49 3.178"
        stroke="#B30909"
        strokeWidth={4}
      />
      <Path
        d="M15.3 16.624l2.38-2.044h-3.976v-1.666h6.426v1.554l-2.352 1.96c.346.019.677.093.994.224.318.13.598.317.84.56.243.233.434.518.574.854.15.336.224.714.224 1.134 0 .392-.08.77-.238 1.134a2.905 2.905 0 01-.686.966c-.299.27-.663.49-1.092.658-.43.168-.92.252-1.47.252-.532 0-1.008-.08-1.428-.238a3.494 3.494 0 01-1.078-.63 3.234 3.234 0 01-.714-.924 3.09 3.09 0 01-.294-1.106l1.862-.364c.019.467.178.85.476 1.148.308.299.7.448 1.176.448.486 0 .864-.13 1.134-.392.27-.27.406-.597.406-.98 0-.43-.14-.76-.42-.994-.27-.233-.625-.35-1.064-.35-.196 0-.36.014-.49.042-.121.028-.233.06-.336.098l-.854-1.344z"
        fill="#fff"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgStrike3);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
