import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgAngleUpThin(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        d="M20 16l-8-8-8 8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgAngleUpThin);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
