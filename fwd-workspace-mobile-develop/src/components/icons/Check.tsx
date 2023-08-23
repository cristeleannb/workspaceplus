import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgCheck(
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
        d="M19.782 5.28a.974.974 0 00-1.377.011l-4.762 4.846a.702.702 0 00-.155.143l-3.933 3.933-3.933-3.933a.96.96 0 00-.696-.286c-.287 0-.533.082-.697.286l-.942.902c-.205.163-.287.41-.287.696a.96.96 0 00.287.697l5.571 5.571c.164.164.41.287.697.287.246 0 .492-.123.696-.287l5.572-5.572c.025-.03.05-.063.072-.097l4.826-4.91a.974.974 0 00-.012-1.377l-.927-.91z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgCheck);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
