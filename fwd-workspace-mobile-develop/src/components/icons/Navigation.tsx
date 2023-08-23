import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgNavigation(
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
        d="M13.661 21.28c-.606.96-1.97.96-2.576 0l-4.8-7.78c-1.06-1.515-1.465-3.334-1.212-5.203.455-3.335 3.233-5.962 6.567-6.265 4.345-.404 8.033 3.032 8.033 7.326a7.569 7.569 0 01-.859 3.485c-.101.253-.253.455-.404.657l-4.749 7.78zm3.385-9.396c.404-.758.657-1.668.657-2.526 0-2.981-2.375-5.355-5.305-5.355a5.326 5.326 0 00-5.355 5.355c0 1.06.303 2.121.96 3.03l.05.051 4.345 7.123 4.395-7.173c.101-.202.202-.354.253-.505z"
        fill="currentColor"
      />
      <Path
        d="M12.398 11.783a2.695 2.695 0 01-2.677-2.678 2.695 2.695 0 012.677-2.677 2.695 2.695 0 012.678 2.677c-.05 1.465-1.213 2.678-2.678 2.678z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgNavigation);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
