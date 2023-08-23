import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgClose(
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
        d="M14.08 12l6.764 6.763a.839.839 0 01.156.468c0 .208-.052.312-.156.416l-1.197 1.197a.59.59 0 01-.416.156c-.208 0-.364-.052-.468-.156L12 14.08l-6.763 6.763a.839.839 0 01-.468.156c-.208 0-.312-.052-.416-.156l-1.197-1.197C3.052 19.543 3 19.44 3 19.231c0-.156.052-.312.156-.468L9.92 12 3.156 5.237C3.052 5.133 3 4.977 3 4.769a.59.59 0 01.156-.416l1.197-1.197C4.457 3.052 4.56 3 4.769 3c.156 0 .312.052.468.156L12 9.92l6.763-6.763c.104-.104.26-.156.468-.156a.59.59 0 01.416.156l1.197 1.197a.59.59 0 01.156.416c0 .208-.052.364-.156.468L14.08 12z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgClose);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
