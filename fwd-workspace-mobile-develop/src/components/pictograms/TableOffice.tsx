import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgTableOffice(
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
      <G clipPath="url(#table-office_svg__clip0)">
        <Path
          d="M16.468 1.8H7.52a.82.82 0 00-.816.823v4.6a.82.82 0 00.816.822h8.948a.82.82 0 00.816-.823v-4.6a.82.82 0 00-.816-.822zM21.6 11.65H2.4v3.484h19.2V11.65z"
          fill="#E87722"
        />
        <Path
          d="M3.242 15.134h2.1v6.226a.775.775 0 01-.297.594c-.19.157-.447.246-.716.246h-.075c-.268 0-.526-.088-.716-.246a.775.775 0 01-.296-.594v-6.226zM18.73 15.134h2.1v6.226a.775.775 0 01-.297.594c-.19.157-.447.246-.716.246h-.075c-.268 0-.526-.088-.716-.246a.775.775 0 01-.296-.594v-6.226z"
          fill="#F4BB8D"
        />
        <Path d="M13.2 5.4h-2.4v6.3h2.4V5.4z" fill="#232323" />
      </G>
      <Defs>
        <ClipPath id="table-office_svg__clip0">
          <Path
            fill="#fff"
            transform="translate(2.4 1.8)"
            d="M0 0h19.2v20.4H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgTableOffice);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
