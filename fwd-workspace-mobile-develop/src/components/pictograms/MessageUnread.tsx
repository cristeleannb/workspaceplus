import * as React from 'react';
import Svg, {SvgProps, Circle, Path} from 'react-native-svg';

function SvgMessageUnread(
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
      <Circle cx={12} cy={12} r={12} fill="#E87722" />
      <Path
        d="M16.958 7.833H7.042a.86.86 0 00-.875.875v6.417c0 .496.379.875.875.875h9.916a.86.86 0 00.875-.875V8.708a.86.86 0 00-.875-.875zM15.763 9L12 11.887 8.238 9h7.524zm.904 5.833H7.333V9.788l4.142 3.15c.32.233.758.233 1.05 0l4.142-3.15v5.045z"
        fill="#fff"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgMessageUnread);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
