import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgMore(
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
        d="M5.25 10a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zM12 10a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zM18.75 10a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgMore);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
