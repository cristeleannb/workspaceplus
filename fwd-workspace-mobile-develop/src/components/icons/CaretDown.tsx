import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgCaretDown(
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
        d="M19.813 6.782c.483 0 .846.242 1.088.726.181.484.12.967-.242 1.33l-7.8 7.8a1.193 1.193 0 01-.846.362c-.362 0-.604-.12-.846-.363l-7.8-7.8c-.362-.362-.483-.845-.241-1.33.181-.483.544-.725 1.088-.725h15.599z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgCaretDown);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
