import * as React from 'react';
import Svg, {SvgProps, G, Circle, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgParkingCheckInOut(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 147 147"
      fill="none"
      ref={svgRef}
      {...props}>
      <G filter="url(#parking-check-in-out_svg__filter0_d_6652_4855)">
        <Circle cx={72.5} cy={65.5} r={52.5} fill="#fff" />
      </G>
      <Path
        d="M93.827 71.67c0-.094.047-.187.047-.28.046-.234.046-.515.046-.795a6.633 6.633 0 00-6.638-6.638 6.633 6.633 0 00-6.638 6.638c0 .28 0 .514.047.794 0 .094.047.187.047.28 0 .094.047.235.047.328H61.058c.047-.093.047-.234.047-.327 0-.094.046-.187.046-.28.047-.234.047-.515.047-.795.047-4.114-3.787-7.386-8.087-6.451-3.085.654-5.142 3.365-5.142 6.497 0 .468.047.935.14 1.356H44.603c-1.262.047-2.29-.982-2.29-2.244V64.377c.093-.046.14-.093.233-.14.561.234 1.216.28 1.917.187 1.355-.28 2.43-1.356 2.664-2.664.187-1.029-.093-2.01-.654-2.712.374-.14.795-.28 1.215-.327h7.854S62.74 49.045 68.49 48.25h13.978c2.15 0 3.272.888 3.973 1.73 1.496 1.776 5.142 5.843 7.012 7.199 1.355.981 3.786 1.168 3.786 1.168.608 0 2.15.14 2.15 1.683v1.122h-1.916a.987.987 0 00-.982.982v1.309c0 .514.421.981.982.981h1.917v4.862a2.763 2.763 0 01-2.758 2.758h-2.806c-.046-.14 0-.234 0-.374z"
        fill="#E87722"
      />
      <Path
        d="M77.746 52.738v5.048c0 .701.468 1.262 1.029 1.262h8.741c1.87 0 1.45-1.495.748-2.337-1.496-1.916-2.945-3.973-3.46-4.675-.186-.233-.373-.56-1.215-.56h-4.814c-.561 0-1.029.56-1.029 1.262zM61.478 56.57c-1.683 1.684-.748 2.478.561 2.478h10.892c.56 0 1.028-.514 1.028-1.122v-5.282c0-.608-.467-1.122-1.028-1.122h-4.815c-.094 0-.14 0-.234.047-1.776.374-4.113 2.711-6.404 5.002z"
        fill="#fff"
      />
      <Path
        d="M46.426 59.048c-2.477.982-3.973 3.366-4.114 5.142.608.28 1.356.421 2.104.234a3.46 3.46 0 002.665-2.664c.187-1.029-.094-2.01-.655-2.712zM55.261 67.79a2.921 2.921 0 00-3.506 3.506 2.814 2.814 0 002.15 2.15c2.104.468 3.974-1.402 3.507-3.506a2.813 2.813 0 00-2.15-2.15zm5.984 2.805c0 .28 0 .514-.047.794 0 .094-.047.187-.047.28 0 .094-.046.235-.046.328a6.572 6.572 0 01-6.451 5.189c-3.179 0-5.844-2.244-6.451-5.189a7.133 7.133 0 01-.14-1.402 6.633 6.633 0 016.637-6.638c3.553.047 6.545 2.991 6.545 6.638z"
        fill="#F3BB91"
      />
      <Path
        d="M53.953 73.446c2.104.468 3.974-1.402 3.506-3.506-.234-1.075-1.122-1.916-2.15-2.15a2.921 2.921 0 00-3.506 3.506c.187 1.028 1.075 1.916 2.15 2.15z"
        fill="#fff"
      />
      <Path
        d="M87.937 67.79a2.921 2.921 0 00-3.506 3.506c.234 1.075 1.122 1.916 2.15 2.15 2.104.468 3.974-1.402 3.506-3.506-.187-1.075-1.075-1.916-2.15-2.15zm-.654 9.443c-3.18 0-5.844-2.244-6.451-5.19-.047-.093-.047-.233-.047-.327 0-.093-.047-.186-.047-.28-.047-.234-.047-.514-.047-.795a6.633 6.633 0 016.638-6.638 6.633 6.633 0 016.638 6.638c0 .28 0 .515-.046.795 0 .094-.047.187-.047.28 0 .094-.047.234-.047.328-.701 2.945-3.366 5.189-6.544 5.189z"
        fill="#F3BB91"
      />
      <Path
        d="M90.135 71.296a2.921 2.921 0 00-3.506-3.506 2.814 2.814 0 00-2.15 2.15c-.468 2.104 1.402 3.974 3.506 3.506 1.028-.233 1.916-1.122 2.15-2.15z"
        fill="#fff"
      />
      <Path
        d="M96.445 61.9v1.636c0 .468.374.795.795.795h2.057V61.059H97.24c-.42.046-.795.42-.795.841zM69.8 62.975h2.103c.327 0 .607-.28.607-.608a.619.619 0 00-.607-.607h-2.104a.619.619 0 00-.608.608c0 .327.28.607.608.607z"
        fill="#183028"
      />
      <Path
        d="M49.273 45.038a3.27 3.27 0 01-2.29-.958 3.2 3.2 0 01-.937-2.278.45.45 0 00-.134-.32.46.46 0 00-.78.32 3.2 3.2 0 01-.936 2.278 3.27 3.27 0 01-2.29.958.459.459 0 00-.323.132.45.45 0 000 .64.459.459 0 00.323.132 3.27 3.27 0 012.29.958 3.2 3.2 0 01.937 2.278c0 .12.048.235.133.32a.459.459 0 00.78-.32 3.2 3.2 0 01.937-2.278 3.27 3.27 0 012.29-.958.46.46 0 00.322-.133.45.45 0 00-.322-.771z"
        fill="#F3BB91"
      />
      <Path
        d="M103.12 37.908a3.066 3.066 0 01-2.147-.899 2.999 2.999 0 01-.878-2.136.42.42 0 00-.126-.299.43.43 0 00-.73.3 3 3 0 01-.88 2.135 3.066 3.066 0 01-2.146.899.43.43 0 00-.302.124.421.421 0 00.302.723c.808.006 1.58.33 2.147.898a3 3 0 01.878 2.136.43.43 0 00.857 0 2.999 2.999 0 01.878-2.136 3.066 3.066 0 012.147-.898.429.429 0 00.428-.424.43.43 0 00-.428-.424z"
        fill="#E9781C"
      />
      <Path
        d="M83.957 90.81c-1.166-.008-2.281-.44-3.1-1.198-.82-.758-1.276-1.782-1.269-2.847a.54.54 0 00-.181-.4.65.65 0 00-.437-.165.65.65 0 00-.438.165.54.54 0 00-.18.4c.006 1.065-.45 2.09-1.27 2.847-.819.759-1.934 1.19-3.1 1.198a.65.65 0 00-.438.166.541.541 0 00-.18.399c0 .15.064.293.18.4a.65.65 0 00.438.165c1.166.008 2.281.439 3.1 1.197.82.759 1.276 1.783 1.27 2.848 0 .15.064.294.18.4a.65.65 0 00.438.165.65.65 0 00.437-.165.54.54 0 00.181-.4c-.007-1.065.45-2.09 1.269-2.848s1.934-1.189 3.1-1.197a.65.65 0 00.438-.166.541.541 0 00.18-.4.541.541 0 00-.18-.398.65.65 0 00-.438-.166z"
        fill="#F3BB91"
      />
      <Defs />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgParkingCheckInOut);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
