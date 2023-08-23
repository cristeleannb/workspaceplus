import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

function SvgMailSent(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 80 80"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        d="M71.706 66.463c0 3.092-2.517 5.537-5.537 5.537H14.537C11.517 72 9 69.555 9 66.463V33.816c0-3.092 2.517-5.537 5.537-3.812h51.56c3.092-1.725 5.537.791 5.537 3.812v32.647h.072z"
        fill="#E87722"
      />
      <Path
        d="M10.51 30.22L37.045 9.08S38.41 8 40.497 8c2.013 0 3.451 1.079 3.451 1.079l26.32 21.213s1.006.791-.073 1.726L44.02 53.016s-1.366 1.078-3.452 1.078c-2.013 0-3.451-1.078-3.451-1.078L9.575 31.37s.288-.503.935-1.15z"
        fill="#E87722"
      />
      <Path
        d="M58.977 26.625H21.728v27.47h37.25v-27.47z"
        fill="url(#mail-sent_svg__paint0_linear)"
      />
      <Path
        d="M49.126 35.973H31.58c-.647 0-1.223-.575-1.223-1.222v-.216c0-.647.576-1.222 1.223-1.222h17.546c.647 0 1.223.575 1.223 1.222v.216c0 .719-.576 1.222-1.223 1.222zM49.126 42.66H31.58c-.647 0-1.223-.575-1.223-1.222v-.216c0-.647.576-1.222 1.223-1.222h17.546c.647 0 1.223.575 1.223 1.222v.216c0 .647-.576 1.223-1.223 1.223z"
        fill="#183028"
      />
      <Path
        d="M37.013 52.673L12.037 68.497c-.609.485-.88.862-.88.862l57.059.484c1.015-.7.068-1.292.068-1.292L43.51 52.673s-1.354-.808-3.25-.808c-1.962 0-3.248.808-3.248.808z"
        fill="#E87722"
      />
      <Path
        d="M9 66.463c0 1.366.503 2.589 1.294 3.595l27.254-17.474L9.575 31.371A5.562 5.562 0 009 33.816v32.647zM71.706 66.463c0 1.366-.504 2.589-1.295 3.595L43.085 52.584l27.973-21.213c.36.719.576 1.582.576 2.445v32.647h.072z"
        fill="#F3BB91"
      />
      <Defs>
        <LinearGradient
          id="mail-sent_svg__paint0_linear"
          x1={21.712}
          y1={40.361}
          x2={58.959}
          y2={40.361}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#EBEBEB" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgMailSent);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
