import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgParkingP(
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
        d="M11.256 21.544V6.89c0-.334.249-.589.575-.589.326 0 1.175.255 1.175.589l.02 14.655h1.36c.346 0 .614.275.614.628a.613.613 0 01-.614.628H9.915a.613.613 0 01-.614-.628c0-.353.268-.628.614-.628h1.342z"
        fill="#183028"
      />
      <Path
        d="M19.2 8.55a7.35 7.35 0 11-14.7 0 7.35 7.35 0 0114.7 0z"
        fill="#FAE4D3"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.85 14.4a5.85 5.85 0 100-11.7 5.85 5.85 0 000 11.7zm0 1.5a7.35 7.35 0 100-14.7 7.35 7.35 0 000 14.7z"
        fill="#E87722"
      />
      <Path fill="#183028" d="M9.9 5.4h1.2v6H9.9z" />
      <Path fill="#183028" d="M9.9 5.4h3.6v1.2H9.9zM13.5 6.6h1.2v1.2h-1.2z" />
      <Path
        d="M13.5 5.4a1.2 1.2 0 011.2 1.2h-1.2V5.4zM13.5 7.8h1.2A1.2 1.2 0 0113.5 9V7.8zM11.1 7.8h2.4V9h-2.4z"
        fill="#183028"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgParkingP);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
