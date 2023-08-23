import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgAdd(
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
        d="M21.464 10.75c.134 0 .268.09.357.179.09.089.179.223.179.357v1.428c0 .179-.09.313-.179.402a.507.507 0 01-.357.134H13.25v8.214c0 .179-.09.313-.179.402a.507.507 0 01-.357.134h-1.428c-.179 0-.313-.045-.402-.134-.09-.09-.134-.223-.134-.402V13.25H2.536c-.179 0-.313-.045-.402-.134-.09-.09-.134-.223-.134-.402v-1.428c0-.134.045-.268.134-.357a.566.566 0 01.402-.179h8.214V2.536c0-.134.045-.268.134-.357A.566.566 0 0111.286 2h1.428c.134 0 .268.09.357.179.09.089.179.223.179.357v8.214h8.214z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgAdd);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
