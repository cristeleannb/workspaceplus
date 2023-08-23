import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgNoWorking(
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
      <G clipPath="url(#no-working_svg__clip0_4256_5770)">
        <Path
          d="M51.222 18.23v2.116h2.136V18.23c0-3.028-2.41-5.537-5.361-5.825l-.05 2.15c1.764.274 3.275 1.827 3.275 3.675z"
          fill="#183028"
        />
        <Path
          d="M10.783 43.485l1.356 19.38c.21 2.994 2.375 5.298 4.968 5.298h45.78c2.599 0 4.763-2.304 4.967-5.298l1.356-19.38c-.204.281-58.217.281-58.427 0z"
          fill="#F3BB91"
        />
        <Path
          d="M33.922 15.771h12.15a2.04 2.04 0 001.868-1.215c.021 0 .05-2.2.05-2.2A2.016 2.016 0 0046.077 11H33.922a2.04 2.04 0 00-1.911 1.328s.028 2.228.042 2.22a2.06 2.06 0 001.869 1.223z"
          fill="#E87722"
        />
        <Path
          d="M28.778 20.345V18.23c0-1.855 1.497-3.408 3.282-3.675l-.043-2.136c-2.972.274-5.368 2.768-5.368 5.811v2.115h2.129z"
          fill="#183028"
        />
        <Path
          d="M64.369 20.227H15.63c-4.44 0-7.947 3.78-7.61 8.207l1.012 13.309a7.252 7.252 0 007.23 6.703h47.488a7.257 7.257 0 007.23-6.703l1.012-13.31c.323-4.426-3.183-8.206-7.624-8.206z"
          fill="#E87722"
        />
        <Path
          d="M44.293 50.778c.731 0 1.314-.73 1.314-1.63V46.76c0-.9-.59-1.63-1.314-1.63h-8.587c-.73 0-1.32.73-1.32 1.63v2.39c0 .899.59 1.63 1.32 1.63h8.587z"
          fill="#183028"
        />
      </G>
      <Path d="M65 75a12 12 0 110-24 12 12 0 010 24z" fill="#183028" />
      <Path
        d="M66 57.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h1a.5.5 0 01.5.5zm-.5 3.5h-1a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-7a.5.5 0 00-.53-.53l.03.03z"
        fill="#fff"
      />
      <Defs>
        <ClipPath id="no-working_svg__clip0_4256_5770">
          <Path fill="#fff" transform="translate(8 11)" d="M0 0h64v57.163H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgNoWorking);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
