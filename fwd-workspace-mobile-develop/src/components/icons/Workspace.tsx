import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgWorkspace(
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
        d="M3 10.493v8.936h1.8v-8.486h14.4v8.486H21v-8.936c0-.765-.585-1.35-1.35-1.35H4.35c-.765 0-1.35.585-1.35 1.35z"
        fill="currentColor"
      />
      <Path
        d="M4.286 13h15.428v2.571H4.286V13zM8.143 5.286c0-.71.575-1.286 1.286-1.286h5.142c.71 0 1.286.576 1.286 1.286v3.857c0 .71-.575 1.286-1.286 1.286H9.43c-.71 0-1.286-.576-1.286-1.286V5.286z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgWorkspace);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
