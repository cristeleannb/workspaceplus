import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgQr(props: SvgProps, svgRef?: React.Ref<React.Component<SvgProps>>) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        d="M4.825 3h4.07v1.438h-4.07a.387.387 0 00-.387.387v4.07H3v-4.07C3 3.817 3.817 3 4.825 3zM3 15.105v4.07C3 20.183 3.817 21 4.825 21h4.07v-1.438h-4.07a.387.387 0 01-.387-.387v-4.07H3zM19.562 15.105v4.07a.387.387 0 01-.387.387h-4.07V21h4.07A1.825 1.825 0 0021 19.175v-4.07h-1.438zM21 8.895v-4.07A1.825 1.825 0 0019.175 3h-4.07v1.438h4.07c.213 0 .387.174.387.387v4.07H21zM3.11 11.408h17.701v1.327h-17.7v-1.327z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgQr);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
