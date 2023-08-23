import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

function SvgWarningExclamation(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 80 80"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M59.456 59.856c7.417-5.825 12.18-14.875 12.18-25.038C71.637 17.247 57.392 3 39.82 3 22.245 3 8 17.246 8 34.819c0 17.178 13.613 31.177 30.64 31.796v9.575c0 .863 1.021 1.32 1.666.746l19.15-17.08z"
        fill="#E87722"
      />
      <Circle cx={39.819} cy={34.819} r={24.748} fill="#fff" />
      <Path
        d="M38.587 33.619c-.366-2.854-.732-5.27-.952-7.245-.22-1.976-.365-3.366-.365-4.245 0-.878.292-1.683.878-2.268.585-.66 1.39-.952 2.415-.952 1.024 0 1.83.293 2.415.952.585.658.878 1.39.878 2.268 0 .878-.146 2.342-.366 4.245-.22 1.976-.585 4.39-.951 7.245a912.914 912.914 0 00-.879 7.026h-2.268c-.147-1.83-.44-4.172-.805-7.026zM37.825 46.103c0 .801.246 1.418.801 1.973.555.555 1.172.802 1.974.802.801 0 1.418-.247 1.973-.802.555-.555.801-1.233.801-1.973 0-.802-.246-1.418-.801-1.973-.555-.555-1.233-.802-1.973-.802-.802 0-1.419.247-1.974.802-.555.555-.801 1.233-.801 1.973z"
        fill="#183028"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgWarningExclamation);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
