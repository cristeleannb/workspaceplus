import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgOffice(
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.077 3c-.765 0-1.385.62-1.385 1.385V21h1.385v-2.77h5.538V21H21V4.385C21 3.62 20.38 3 19.615 3h-5.538zm5.538 6.923h-5.538v1.385h5.538V9.923zm-5.538-2.77h5.538v1.385h-5.538V7.154zm5.538 5.54h-5.538v1.384h5.538v-1.385zm-5.538 2.768h5.538v1.385h-5.538v-1.385zM4.385 8.538C3.62 8.538 3 9.158 3 9.923V21h1.385v-2.77h5.538V21h1.385V9.923c0-.765-.62-1.385-1.385-1.385H4.385zm5.538 4.154H4.385v1.385h5.538v-1.385zm-5.538 2.77h5.538v1.384H4.385v-1.385z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgOffice);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
