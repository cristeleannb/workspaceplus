import * as React from 'react';
import Svg, {SvgProps, Ellipse, Path, Circle} from 'react-native-svg';

function SvgPinLocationAlt(
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
      <Ellipse cx={12} cy={21} rx={4.5} ry={0.9} fill="#FAE4D3" />
      <Path
        d="M6.063 3.007A8.511 8.511 0 0112 .6a8.511 8.511 0 015.937 2.407 8.123 8.123 0 012.463 5.8c0 5.623-7.516 11.598-7.837 11.946A.754.754 0 0112 21a.77.77 0 01-.563-.247C11.118 20.405 3.6 14.425 3.6 8.807a8.123 8.123 0 012.463-5.8z"
        fill="#fff"
      />
      <Path
        d="M6.47 3.465A7.755 7.755 0 0111.938 1.2a7.755 7.755 0 015.469 2.265 7.726 7.726 0 012.27 5.46c0 5.291-6.925 10.915-7.22 11.243a.694.694 0 01-1.038 0c-.293-.328-7.22-5.956-7.22-11.244a7.727 7.727 0 012.27-5.459z"
        fill="#E87722"
      />
      <Circle cx={12} cy={8.7} fill="#fff" r={3.6} />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgPinLocationAlt);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
