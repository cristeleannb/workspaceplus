import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgCalendar(
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
        d="M17.469 5.25c.438 0 .808.176 1.145.492.303.352.471.738.471 1.196v12.375c0 .492-.168.878-.471 1.195a1.493 1.493 0 01-1.145.492H5.616c-.471 0-.842-.14-1.145-.492C4.135 20.19 4 19.805 4 19.313V6.938c0-.458.135-.844.471-1.196a1.516 1.516 0 011.145-.492h1.617V3.422A.41.41 0 017.637 3h1.347c.1 0 .202.07.269.14s.135.176.135.282V5.25h4.31V3.422A.41.41 0 0114.102 3h1.347c.1 0 .202.07.269.14s.135.176.135.282V5.25h1.616zm-.202 14.063c.034 0 .067 0 .135-.07.033-.036.067-.071.067-.141V8.625H5.616v10.477c0 .07 0 .105.068.14.033.07.067.07.134.07h11.449z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgCalendar);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
