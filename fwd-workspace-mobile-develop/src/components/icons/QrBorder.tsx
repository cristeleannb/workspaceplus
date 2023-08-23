import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgQrBorder(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 28 28"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        d="M2 26V6a4 4 0 014-4h20"
        stroke="#E87722"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgQrBorder);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
