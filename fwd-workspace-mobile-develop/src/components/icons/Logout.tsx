import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgLogout(
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
        d="M15.962 17.844a1.363 1.363 0 01-1.926 0l-.323-.323 4.811-4.834H8.444V10.87h10.08l-4.81-4.788.322-.323a1.363 1.363 0 011.926 0L22 11.779l-6.038 6.065z"
        fill="currentColor"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.321 4.845a.845.845 0 01-.845.845H3.69v13.098h7.786a.845.845 0 110 1.69H2V4h9.476c.467 0 .845.378.845.845z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgLogout);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
