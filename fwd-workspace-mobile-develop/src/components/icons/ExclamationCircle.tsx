import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgExclamationCircle(
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
        d="M11.098 16.927v-.9a.45.45 0 01.45-.45h.9a.45.45 0 01.45.45v.9a.45.45 0 01-.45.45h-.9a.45.45 0 01-.45-.45zm.45-3.15h.9a.45.45 0 00.45-.45v-6.3a.45.45 0 00-.45-.45h-.9a.45.45 0 00-.45.45v6.3a.45.45 0 00.477.477l-.027-.027zm-8.505-.9a9 9 0 118.055 8.078 9 9 0 01-8.028-8.033l-.027-.045zm1.8-1.858a7.2 7.2 0 106.255-6.156 7.2 7.2 0 00-6.215 6.214l-.04-.058z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgExclamationCircle);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
