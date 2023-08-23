import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgLock(
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
        d="M18.027 21H6.347A1.348 1.348 0 015 19.652v-8.984A1.348 1.348 0 016.348 9.32h11.68a1.348 1.348 0 011.347 1.348v8.984A1.348 1.348 0 0118.027 21zm-11.23-1.797h10.781v-8.086H6.797v8.086z"
        fill="currentColor"
      />
      <Path
        d="M13.149 14.85a.988.988 0 11-.961-.983.984.984 0 01.983.983"
        fill="currentColor"
      />
      <Path
        d="M12.188 16.733a1.882 1.882 0 110-3.765 1.882 1.882 0 010 3.765zm0-1.968a.085.085 0 00-.09.085c0 .095.175.095.175 0a.085.085 0 00-.085-.085zM16.68 10.192h-1.797V7.524c-.027-.364-.283-2.727-2.695-2.727-2.413 0-2.696 2.367-2.696 2.727v2.663H7.695V7.492C7.767 5.911 8.805 3 12.187 3c3.383 0 4.416 2.91 4.493 4.452v2.74z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgLock);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
