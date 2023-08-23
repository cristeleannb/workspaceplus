import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgCheckIn(
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
        d="M10.159 17.323a1.207 1.207 0 01-1.707 0l-.286-.285 4.262-4.282H3.5v-1.61h8.928L8.166 6.904l.286-.285a1.207 1.207 0 011.707 0l5.348 5.332-5.348 5.372z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgCheckIn);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
