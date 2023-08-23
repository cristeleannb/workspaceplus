import * as React from 'react';
import Svg, {SvgProps, G, Path, Circle, Defs, ClipPath} from 'react-native-svg';

function SvgTableOfficeFull(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 81 80"
      fill="none"
      ref={svgRef}
      {...props}>
      <G clipPath="url(#table-office-full_svg__clip0_6501_50264)">
        <Path
          d="M53.532 10H27.434a2.39 2.39 0 00-2.38 2.4v13.415a2.39 2.39 0 002.38 2.4h26.098a2.39 2.39 0 002.38-2.4V12.4a2.39 2.39 0 00-2.38-2.4zM68.5 38.73h-56v10.162h56V38.73z"
          fill="#E87722"
        />
        <Path
          d="M14.955 48.892h6.125V67.05c0 .65-.311 1.273-.865 1.732-.554.46-1.305.718-2.088.718h-.219c-.783 0-1.534-.258-2.088-.718-.554-.46-.865-1.082-.865-1.732V48.892zM60.129 48.892h6.125V67.05c0 .65-.311 1.273-.865 1.732-.554.46-1.305.718-2.088.718h-.219c-.783 0-1.534-.258-2.088-.718-.554-.46-.865-1.082-.865-1.732V48.892z"
          fill="#F4BB8D"
        />
        <Path d="M44 20.5h-7v18.375h7V20.5z" fill="#232323" />
      </G>
      <Circle cx={66.5} cy={58} r={14} fill="#183028" />
      <Path
        d="M67.656 58.25l4.57 4.57c.07.106.106.211.106.317 0 .14-.035.21-.105.281l-.809.809a.4.4 0 01-.281.105c-.14 0-.246-.035-.317-.105l-4.57-4.57-4.57 4.57a.567.567 0 01-.317.105c-.14 0-.21-.035-.281-.105l-.809-.809c-.07-.07-.105-.14-.105-.281 0-.106.035-.211.105-.317l4.57-4.57-4.57-4.57c-.07-.07-.105-.176-.105-.317a.4.4 0 01.105-.281l.809-.809c.07-.07.14-.105.281-.105.106 0 .211.035.317.105l4.57 4.57 4.57-4.57c.07-.07.176-.105.317-.105a.4.4 0 01.281.105l.809.809a.4.4 0 01.105.281c0 .14-.035.246-.105.317l-4.57 4.57z"
        fill="#fff"
      />
      <Defs>
        <ClipPath id="table-office-full_svg__clip0_6501_50264">
          <Path
            fill="#fff"
            transform="translate(12.5 10)"
            d="M0 0h56v59.5H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgTableOfficeFull);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
