import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgEdit(
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
        d="M15.667 3.754a2.634 2.634 0 013.69 0l.005.006.848.847a2.634 2.634 0 010 3.69l-.003.002-1.437 1.453a.871.871 0 01-1.235.004l-3.327-3.327a.87.87 0 01.003-1.235l1.456-1.44zm1.221 1.242l-.829.82 2.089 2.089.819-.828v-.001a.892.892 0 00.002-1.246l-.835-.835a.892.892 0 00-1.246.001zM13.115 6.703c.23 0 .452.092.616.255l3.31 3.311a.87.87 0 010 1.232l-7.987 7.98a1.579 1.579 0 01-.766.443l-3.835 1.04a1.165 1.165 0 01-1.417-1.417l.003-.012 1.037-3.823c.072-.293.226-.558.443-.766l7.98-7.988a.871.871 0 01.616-.255zm0 2.103l-7.359 7.366-.77 2.843 2.842-.771 7.366-7.36-2.079-2.078z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgEdit);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
