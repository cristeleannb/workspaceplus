import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgParking(
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
        d="M13.113 21.402l-.016-4.715a7.376 7.376 0 10-1.943 0l-.016 4.715a.597.597 0 00.175.43.585.585 0 00.422.167h.749a.597.597 0 00.629-.597zm2.835-8.187a5.406 5.406 0 11-7.645-7.644 5.406 5.406 0 017.644 7.644z"
        fill="currentColor"
      />
      <Path d="M10.276 6.476h1.233v6.167h-1.233V6.476z" fill="currentColor" />
      <Path
        d="M10.276 6.476h3.7v1.233h-3.7V6.476zM13.976 7.71h1.234v1.233h-1.234V7.709zM13.976 6.476c.682 0 1.234.552 1.234 1.233h-1.234V6.476zM13.976 8.943h1.234c0 .681-.552 1.233-1.234 1.233V8.943zM11.51 8.943h2.466v1.233H11.51V8.943z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgParking);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
