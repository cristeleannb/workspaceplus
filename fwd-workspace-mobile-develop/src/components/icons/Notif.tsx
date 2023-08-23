import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgNotif(
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
        d="M13.268 17.78h-2.955a.529.529 0 00-.494.343 2.01 2.01 0 00-.126.708 2.102 2.102 0 104.201 0c.001-.242-.042-.481-.126-.707a.525.525 0 00-.5-.344zM11.795 6.155A1.577 1.577 0 1011.804 3a1.577 1.577 0 00-.01 3.154z"
        fill="currentColor"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.732 17.288l-.656-.681v-5.505c0-2.327-1.74-4.24-3.828-4.443m4.484 10.629H6.933l.66-.67v-5.735a4.246 4.246 0 014.655-4.224m-6.197 4.224a5.787 5.787 0 016.347-5.76c2.93.286 5.221 2.912 5.221 5.98v4.882l.577.598.081.085.002.002a1.552 1.552 0 01.389 1.016v.62a.519.519 0 01-.524.525H5.524A.52.52 0 015 18.306v-.62a1.55 1.55 0 01.461-1.103l.59-.598v-5.102zm12.226 5.785a1.585 1.585 0 00-.081-.085l.081.085z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgNotif);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
