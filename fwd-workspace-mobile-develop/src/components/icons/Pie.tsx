import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgPie(
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 10.875A7.875 7.875 0 0013.125 3v7.875H21z"
        fill="currentColor"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3a9 9 0 109 9h-9V3z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgPie);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
