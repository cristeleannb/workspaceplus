import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgAngleRightThick(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 17 16"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        d="M6.34 4l4 4-4 4"
        stroke="#E87722"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgAngleRightThick);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
