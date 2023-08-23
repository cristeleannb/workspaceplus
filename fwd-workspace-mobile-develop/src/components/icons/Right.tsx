import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgRight(
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
        d="M11.45 4.431l-.342.347 6.148 6.149H3v1.954h14.256l-6.148 6.154.342.342a1.465 1.465 0 002.077 0L21 11.904l-7.473-7.473a1.466 1.466 0 00-2.077 0z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgRight);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
