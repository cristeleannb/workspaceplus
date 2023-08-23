import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgCheckOut(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 25 24"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.358 5.748c0 .414.335.749.748.749h6.897v11.602h-6.897a.748.748 0 100 1.497H21.5V5h-8.394a.748.748 0 00-.748.748z"
        fill="currentColor"
      />
      <Path
        d="M8.848 17.323a1.208 1.208 0 001.707 0l.285-.286-4.261-4.282h8.928v-1.61H6.579l4.261-4.241-.285-.286a1.207 1.207 0 00-1.707 0L3.5 11.95l5.348 5.373z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgCheckOut);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
