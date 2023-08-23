import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';

function SvgBar(
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
      <Rect x={3} y={4} width={18} height={4.235} rx={1} fill="currentColor" />
      <Rect
        x={3}
        y={10.353}
        width={13.765}
        height={4.235}
        rx={1}
        fill="currentColor"
      />
      <Rect
        x={3}
        y={16.706}
        width={8.471}
        height={4.235}
        rx={1}
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgBar);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
