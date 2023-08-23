import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgInfoCircle(
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
        d="M12.902 7.073v.9a.45.45 0 01-.45.45h-.9a.45.45 0 01-.45-.45v-.9a.45.45 0 01.45-.45h.9a.45.45 0 01.45.45zm-.45 3.15h-.9a.45.45 0 00-.45.45v6.3a.45.45 0 00.45.45h.9a.45.45 0 00.45-.45v-6.3a.449.449 0 00-.477-.477l.027.027zm8.505.9a9 9 0 11-8.055-8.078 9 9 0 018.028 8.033l.027.045zm-1.8 1.858a7.2 7.2 0 10-6.255 6.156 7.2 7.2 0 006.215-6.214l.04.058z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgInfoCircle);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
