import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgCam(
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
        d="M19.65 20.2H4.35c-.765 0-1.35-.585-1.35-1.35V7.15c0-.765.585-1.35 1.35-1.35h2.79l1.665-1.665c.09-.09.18-.135.315-.135h5.76c.135 0 .225.045.315.135L16.86 5.8h2.79c.765 0 1.35.585 1.35 1.35v11.7c0 .765-.585 1.35-1.35 1.35zM4.8 18.4h14.4V7.6h-3.06l-1.8-1.8H9.66l-1.8 1.8H4.8v10.8z"
        fill="currentColor"
      />
      <Path
        d="M12 17.725a4.724 4.724 0 110-9.45 4.724 4.724 0 110 9.45zm0-7.65A2.92 2.92 0 009.075 13 2.92 2.92 0 0012 15.925 2.92 2.92 0 0014.925 13 2.92 2.92 0 0012 10.075z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgCam);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
