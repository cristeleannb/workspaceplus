import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgId(props: SvgProps, svgRef?: React.Ref<React.Component<SvgProps>>) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        d="M19.5 21h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5zM5 19h14V5H5v14z"
        fill="currentColor"
      />
      <Path
        d="M11.97 12a3 3 0 110-5.999 3 3 0 010 5.999zm0-4a1 1 0 100 2 1 1 0 000-2zM16.97 17a1 1 0 01-.625-.22c-4.79-3.85-8.5-.23-8.66-.075A1 1 0 116.26 15.3c1.74-1.77 6.36-4.08 11.34-.075A1 1 0 0116.97 17z"
        fill="currentColor"
      />
      <Path
        d="M17.47 18h-11a.5.5 0 01-.5-.5V16h12v1.5a.5.5 0 01-.5.5z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgId);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
