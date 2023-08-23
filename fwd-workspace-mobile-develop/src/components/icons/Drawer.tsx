import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgDrawer(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 40 40"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.621 16.41a1.5 1.5 0 011.97-.789L20 21.368l13.41-5.747a1.5 1.5 0 011.18 2.758L20 24.632 5.41 18.379a1.5 1.5 0 01-.789-1.97z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgDrawer);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
