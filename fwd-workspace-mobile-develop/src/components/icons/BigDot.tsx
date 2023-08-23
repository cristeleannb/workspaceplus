import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';

function SvgBigDot(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 10 10"
      fill="none"
      ref={svgRef}
      {...props}>
      <Rect width={10} height={10} rx={5} fill="currentColor" />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgBigDot);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
