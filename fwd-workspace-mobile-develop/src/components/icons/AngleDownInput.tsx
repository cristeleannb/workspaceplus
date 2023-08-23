import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgAngleDownInput(
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
        d="M12.035 15a.66.66 0 00.465.19c.164 0 .328-.081.465-.19l3.719-3.72c.109-.136.191-.3.191-.464a.66.66 0 00-.191-.465l-.63-.601a.64.64 0 00-.464-.192c-.192 0-.356.055-.465.192L12.5 12.374 9.875 9.75a.64.64 0 00-.465-.192c-.191 0-.355.055-.465.192l-.629.601c-.136.11-.191.273-.191.465a.64.64 0 00.191.465l3.72 3.718z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgAngleDownInput);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
