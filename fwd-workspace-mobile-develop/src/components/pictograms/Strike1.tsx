import * as React from 'react';
import Svg, {SvgProps, Circle, Path} from 'react-native-svg';

function SvgStrike1(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 34 34"
      fill="none"
      ref={svgRef}
      {...props}>
      <Circle cx={17} cy={17} r={16} fill="#183028" />
      <Path
        d="M2.6 17c0 7.953 6.448 14.4 14.4 14.4 3.877 0 7.395-1.531 9.984-4.022M2.6 17c0-5.83 3.465-10.851 8.447-13.116A14.348 14.348 0 0117.002 2.6"
        stroke="#FFF6D9"
        strokeWidth={4}
      />
      <Path
        d="M17.001 2.6c7.953 0 14.4 6.447 14.4 14.4 0 2.622-.701 5.082-1.927 7.2a14.46 14.46 0 01-2.49 3.177"
        stroke="#FED141"
        strokeWidth={4}
      />
      <Path
        d="M16.843 22v-6.076h-2.184v-1.302c.662-.01 1.208-.177 1.638-.504.438-.327.704-.728.798-1.204h1.666V22h-1.918z"
        fill="#fff"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgStrike1);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
