import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgCheck(
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
      <Path d="M12 24a12 12 0 110-24 12 12 0 010 24z" fill="#E87722" />
      <Path
        d="M17.694 8.016l-.222-.216a1.326 1.326 0 00-1.872 0l-6.09 6.09-1.11-1.116a1.362 1.362 0 00-1.872 0l-.222.222a.396.396 0 000 .552l2.928 2.928a.389.389 0 00.276.114.379.379 0 00.276-.114l7.908-7.908a.396.396 0 000-.552z"
        fill="#fff"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgCheck);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
