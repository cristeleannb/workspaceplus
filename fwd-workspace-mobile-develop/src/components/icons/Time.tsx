import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgTime(
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
        d="M12.898 6.648v5.724L9.99 15.279a1.35 1.35 0 01-1.908 0l-.32-.315 3.335-3.34V7.999a1.35 1.35 0 011.35-1.35h.45zm8.055 4.432a9 9 0 11-17.907 1.84 9 9 0 0117.907-1.84zm-1.8 1.859a7.2 7.2 0 10-6.228 6.2 7.2 7.2 0 006.214-6.214l.014.014z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgTime);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
