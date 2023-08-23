import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgRadioUnselected(
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
        d="M3 12c0-4.948 4.052-9 9-9s9 4.052 9 9-4.052 9-9 9-9-4.052-9-9z"
        stroke="currentColor"
        strokeWidth={2}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgRadioUnselected);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
