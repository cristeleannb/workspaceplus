import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgRead(
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
        d="M19.65 8.429H4.35c-.765 0-1.35.585-1.35 1.35v9.9c0 .765.585 1.35 1.35 1.35h15.3c.765 0 1.35-.585 1.35-1.35v-9.9c0-.765-.585-1.35-1.35-1.35zm-1.845 1.8L12 13.398l-5.805-3.17h11.61zm1.395 9H4.8v-7.785l6.39 3.574c.495.36 1.17.36 1.62 0l6.39-3.574v7.785z"
        fill="currentColor"
      />
      <Path
        d="M3 11V9.464a1 1 0 01.364-.772l7.798-6.422c.512-.36 1.21-.36 1.676 0l7.798 6.422a1 1 0 01.364.772V11h-.355L12 3.89 3.355 11H3z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgRead);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
