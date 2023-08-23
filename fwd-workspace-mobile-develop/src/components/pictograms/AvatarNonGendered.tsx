import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgAvatarNonGendered(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 108 108"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54 107a52.997 52.997 0 0048.966-32.718 53.004 53.004 0 00-11.49-57.759A53 53 0 1054 107z"
        fill="#F3BB91"
      />
      <Path
        d="M60.511 51.842a13.837 13.837 0 01-13.023 0C30.624 53.546 27.577 61.8 27.577 70.771V78a2.27 2.27 0 001.04 1.893 29.093 29.093 0 004.979 2.499 2.31 2.31 0 003.161-2.158v-7.306l1.571 9.464a2.593 2.593 0 001.893 2.1 63.541 63.541 0 0027.409 0 2.593 2.593 0 001.892-2.1l1.572-9.464v7.42a2.308 2.308 0 003.312 2.044 29.098 29.098 0 004.978-2.518 2.271 2.271 0 001.041-1.892v-7.25c.076-8.934-3.047-17.187-19.913-18.89zM54 50.063a14.026 14.026 0 10-14.007-14.026A14.007 14.007 0 0054 50.063z"
        fill="#E87722"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M53.997 2C25.28 2 2 25.28 2 53.997v.006C2 82.72 25.28 106 53.997 106h.006C82.72 106 106 82.72 106 54.003v-.006C106 25.28 82.72 2 54.003 2h-.006zM0 53.997C0 24.175 24.175 0 53.997 0h.006C83.825 0 108 24.175 108 53.997v.006C108 83.825 83.825 108 54.003 108h-.006C24.175 108 0 83.825 0 54.003v-.006z"
        fill="#fff"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgAvatarNonGendered);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
