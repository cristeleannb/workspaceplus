import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgProofOfId(
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
        d="M18.453 5.828c.352.39.547.82.547 1.328v12.969c0 .547-.195.977-.547 1.328-.39.39-.82.547-1.328.547H5.875c-.547 0-.977-.156-1.328-.547-.39-.351-.547-.781-.547-1.328V3.875c0-.508.156-.938.547-1.328A1.795 1.795 0 015.875 2h7.969c.508 0 .937.195 1.328.547l3.281 3.281zM16.97 7L14 4.031V7h2.969zM5.875 20.125h11.25V8.875h-4.063c-.273 0-.507-.078-.664-.273-.195-.157-.273-.391-.273-.665V3.875h-6.25v16.25zm1.25-1.875v-2.5l1.523-1.523A.495.495 0 019 14.07a.63.63 0 01.352.117l1.523 1.563 3.438-3.438c.078-.078.156-.117.312-.117a.63.63 0 01.352.117l.898.938v5h-8.75zM9 8.875c.508 0 .938.195 1.328.547.352.39.547.82.547 1.328 0 .547-.195.977-.547 1.328-.39.39-.82.547-1.328.547-.547 0-.977-.156-1.328-.547-.39-.351-.547-.781-.547-1.328 0-.508.156-.938.547-1.328A1.795 1.795 0 019 8.875z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgProofOfId);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
