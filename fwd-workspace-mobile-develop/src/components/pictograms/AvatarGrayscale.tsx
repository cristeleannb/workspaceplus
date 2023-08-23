import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgAvatarGrayscale(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 56 56"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 56A28 28 0 1028-.001 28 28 0 0028 56z"
        fill="#DBDFE1"
      />
      <Path
        d="M31.44 26.86a7.31 7.31 0 01-6.88 0c-8.91.9-10.52 5.26-10.52 10v3.82a1.201 1.201 0 00.55 1c.832.523 1.713.965 2.63 1.32a1.22 1.22 0 001.67-1.14V38l.83 5a1.37 1.37 0 001 1.11 33.569 33.569 0 0014.48 0 1.37 1.37 0 001-1.11l.83-5v3.92A1.22 1.22 0 0038.78 43a15.366 15.366 0 002.63-1.33 1.2 1.2 0 00.55-1v-3.83c.04-4.72-1.61-9.08-10.52-9.98zM28 25.92a7.41 7.41 0 10-7.4-7.41 7.4 7.4 0 007.4 7.41z"
        fill="#B3B6B8"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgAvatarGrayscale);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
