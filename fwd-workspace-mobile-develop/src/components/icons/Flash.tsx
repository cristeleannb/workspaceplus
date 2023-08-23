import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgFlash(
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
        d="M14.54 3.412a1.412 1.412 0 00-1.994 0l-.76.76c-.329.33-.582.728-.74 1.166L9.572 9.416 3.67 15.318a2.295 2.295 0 000 3.242l1.77 1.77a2.294 2.294 0 003.242 0l5.897-5.897 4.092-1.49a3.195 3.195 0 001.153-.731l.76-.756a1.41 1.41 0 00.005-1.994l-.003-.003-6.046-6.047zM7.936 19.583a1.237 1.237 0 01-1.748 0l-1.77-1.77a1.237 1.237 0 010-1.748l5.59-5.592 3.529 3.508-5.601 5.602zm11.903-8.876l-.76.756a2.14 2.14 0 01-.77.488l-3.892 1.417-3.789-3.767 1.41-3.905c.107-.292.276-.558.495-.778l.76-.759a.354.354 0 01.5 0h0l6.047 6.047a.354.354 0 010 .5l-.001.001h0z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0.5}
      />
      <Path
        d="M10.98 13.02a.528.528 0 00-.747 0L8.95 14.304a.528.528 0 00.747.747l1.284-1.284a.528.528 0 000-.747z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0.5}
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgFlash);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
