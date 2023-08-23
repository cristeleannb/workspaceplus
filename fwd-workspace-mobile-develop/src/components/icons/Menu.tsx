import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgMenu(
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
        d="M3 7.286v-.857C3 6.17 3.18 6 3.45 6h13.5c.27 0 .45.171.45.429v.857c0 .257-.18.428-.45.428H3.45c-.27 0-.45-.171-.45-.428zm17.55 3.857H3.45c-.27 0-.45.171-.45.428v.858c0 .257.18.428.45.428h17.1c.27 0 .45-.171.45-.428v-.858c0-.257-.18-.428-.45-.428zM3 16.714v.857c0 .258.18.429.45.429h9c.765 0 1.35-.557 1.35-1.286v-.428H3.45c-.27 0-.45.171-.45.428z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgMenu);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
