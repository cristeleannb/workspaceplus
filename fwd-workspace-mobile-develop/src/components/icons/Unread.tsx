import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgUnread(
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
        d="M19.65 6H4.35C3.585 6 3 6.585 3 7.35v9.9c0 .765.585 1.35 1.35 1.35h15.3c.765 0 1.35-.585 1.35-1.35v-9.9C21 6.585 20.415 6 19.65 6zm-1.845 1.8L12 12.255 6.195 7.8h11.61zm1.395 9H4.8V9.015l6.39 4.86c.495.36 1.17.36 1.62 0l6.39-4.86V16.8z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgUnread);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
