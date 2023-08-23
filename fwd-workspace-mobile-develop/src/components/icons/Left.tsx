import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgLeft(
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
        d="M21 10.927H6.744l6.148-6.149-.342-.347a1.465 1.465 0 00-2.077 0L3 11.904l7.473 7.473a1.466 1.466 0 002.077 0l.342-.342-6.148-6.154H21v-1.954z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgLeft);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
