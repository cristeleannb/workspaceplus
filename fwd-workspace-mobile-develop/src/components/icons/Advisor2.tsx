import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgAdvisor2(
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
        d="M19.65 20.1H4.35c-.765 0-1.35-.585-1.35-1.35V7.95c0-.765.585-1.35 1.35-1.35h15.3c.765 0 1.35.585 1.35 1.35v10.8c0 .765-.585 1.35-1.35 1.35zM4.8 18.3h14.4V8.4H4.8v9.9z"
        fill="currentColor"
      />
      <Path
        d="M15.343 8.4h-7.2V4.35c0-.765.585-1.35 1.35-1.35h4.5c.765 0 1.35.585 1.35 1.35V8.4zm-5.4-1.8h3.6V4.8h-3.6v1.8zM9.429 16.365v-6.03c0-.36.36-.54.675-.405l5.4 3.015c.315.18.315.63 0 .765l-5.4 3.015c-.315.18-.675 0-.675-.36z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgAdvisor2);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
