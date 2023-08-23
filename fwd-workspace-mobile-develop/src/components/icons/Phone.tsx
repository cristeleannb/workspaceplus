import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgPhone(
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
        d="M18.377 20.165a2.828 2.828 0 01-1.283.735 2.828 2.828 0 01-1.49 0A18.56 18.56 0 013.1 8.376a2.83 2.83 0 010-1.481 2.83 2.83 0 01.735-1.283l2.198-2.197a1.433 1.433 0 011-.415c.374 0 .734.15.999.415l3.112 3.112a1.415 1.415 0 010 2L9.908 9.762a5.46 5.46 0 001.565 2.763 5.394 5.394 0 002.764 1.566l1.235-1.226a1.415 1.415 0 011.01-.415 1.387 1.387 0 01.999.415l3.103 3.103a1.415 1.415 0 010 2l-2.207 2.197zM5.305 6.8a1.405 1.405 0 00-.358 1.414 16.203 16.203 0 004.206 6.678 16.401 16.401 0 006.602 4.15c.25.065.514.065.764 0 .248-.07.475-.2.66-.378l1.707-1.716-2.452-2.443-1.028 1.018c-.155.164-.35.284-.566.35-.216.07-.445.09-.67.056a7.45 7.45 0 01-6.139-6.168 1.462 1.462 0 01.057-.67c.07-.213.19-.407.349-.565l1.018-1.019-2.47-2.443-1.68 1.736z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgPhone);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
