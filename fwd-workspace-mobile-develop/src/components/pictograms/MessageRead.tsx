import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgMessageRead(
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
        d="M17.95 10H6.05C5.455 10 5 10.455 5 11.05v7.7c0 .595.455 1.05 1.05 1.05h11.9c.595 0 1.05-.455 1.05-1.05v-7.7c0-.595-.455-1.05-1.05-1.05zm-1.435 1.4L12 13.865 7.485 11.4h9.03zm1.085 7H6.4v-6.055l4.97 2.78c.385.28.91.28 1.26 0l4.97-2.78V18.4z"
        fill="#E87722"
      />
      <Path
        d="M5 12v-1.09a1 1 0 01.364-.772l5.984-4.928c.399-.28.942-.28 1.304 0l5.984 4.928a1 1 0 01.364.772V12h-.276L12 6.47 5.276 12H5z"
        fill="#E87722"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgMessageRead);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
