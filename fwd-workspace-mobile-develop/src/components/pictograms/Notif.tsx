import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgNotif(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 140 140"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        d="M70.068 99.273l-14.18-3.123a2.598 2.598 0 00-2.733 1.127 9.88 9.88 0 00-1.353 3.26 10.33 10.33 0 007.788 12.632 10.346 10.346 0 007.922-1.474 10.325 10.325 0 004.452-6.716 9.882 9.882 0 00.142-3.527 2.58 2.58 0 00-2.038-2.179zm5.22-57.345a7.752 7.752 0 103.376-15.132 7.752 7.752 0 00-3.377 15.132z"
        fill="#FAE4D3"
      />
      <Path
        d="M75.287 41.928a7.75 7.75 0 103.377-15.13 7.75 7.75 0 00-3.377 15.13z"
        fill="#183028"
      />
      <Path
        d="M94.982 98.74l-2.134-3.481 5.16-23.43c3.244-14.722-4.975-29.747-18.738-34.213a28.44 28.44 0 00-36.545 20.93L37.33 83.03l-3.462 2.248a7.623 7.623 0 00-3.38 4.806l-.655 2.976a2.555 2.555 0 001.962 3.07l60.56 13.34a2.55 2.55 0 001.946-.337 2.558 2.558 0 001.124-1.625l.656-2.975a7.624 7.624 0 00-1.1-5.793z"
        fill="#F3BB90"
      />
      <Path
        fill="#FAE4D3"
        d="M39.004 75.507l55.454 12.316-1.627 7.327-55.454-12.315z"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgNotif);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
