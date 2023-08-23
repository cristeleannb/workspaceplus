import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgTransfer(
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
        d="M10.739 15.593h8.382c.387 0 .645.258.645.645v1.29c0 .387-.258.644-.645.644H10.74v-2.579zM10.738 13.207v7.158c0 .58-.709.838-1.096.451l-3.417-3.417a.623.623 0 010-.903l3.417-3.74c.387-.387 1.096-.129 1.096.451zM5.645 5.985h8.382v2.58H5.645C5.258 8.564 5 8.306 5 7.92V6.63c0-.322.258-.645.645-.645zM15.123 3.213l3.482 3.61a.623.623 0 010 .903l-3.482 3.676c-.386.451-1.096.129-1.096-.452V3.664c0-.58.71-.903 1.096-.451z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgTransfer);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
