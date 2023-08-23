import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgCheckCircle(
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
        d="M20.957 11.123a9 9 0 11-8.055-8.078 9 9 0 018.028 8.033l.027.045zm-1.8 1.858a7.2 7.2 0 10-6.255 6.156 7.2 7.2 0 006.215-6.214l.04.058z"
        fill="currentColor"
      />
      <Path
        d="M15.891 8.765a.485.485 0 00-.689.006l-2.38 2.435a.348.348 0 00-.078.072l-1.966 1.977-1.967-1.977a.479.479 0 00-.348-.144c-.144 0-.267.041-.348.144l-.472.453c-.102.083-.143.206-.143.35 0 .124.041.247.143.35l2.786 2.8a.493.493 0 00.348.144.58.58 0 00.349-.144l2.786-2.8a.917.917 0 00.036-.049l2.412-2.467a.491.491 0 00-.006-.692l-.463-.458z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgCheckCircle);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
