import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgBranch(
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
        d="M15.242 18.716H9.375a.31.31 0 01-.308-.309V6.309A.31.31 0 019.375 6h5.558a.31.31 0 01.31.309v12.407zm-4.94-2.835h3.705V7.235h-3.705v8.646z"
        fill="currentColor"
      />
      <Path
        d="M14.625 8.47h-4.94v1.235h4.94V8.47zM14.625 10.94h-4.94v1.235h4.94V10.94zM14.625 13.41h-4.94v1.236h4.94V13.41z"
        fill="currentColor"
      />
      <Path
        d="M12.772 6.618h-1.235v9.88h1.235v-9.88zM19.691 18.716h-5.684V10.07h5.684a.31.31 0 01.309.309v8.028a.31.31 0 01-.309.309zm-4.449-1.235h3.523v-6.176h-3.523v6.176z"
        fill="currentColor"
      />
      <Path
        d="M15.769 13.775h-.926V12.54h.926a.31.31 0 01.309.31v.617a.31.31 0 01-.309.308zM15.769 16.246h-.926V15.01h.926a.31.31 0 01.309.308v.618a.31.31 0 01-.309.309zM17.841 13.775h-.618a.31.31 0 01-.308-.308v-.618a.31.31 0 01.308-.309h.618a.31.31 0 01.309.31v.617a.31.31 0 01-.309.308zM17.841 16.246h-.618a.31.31 0 01-.308-.31v-.617a.31.31 0 01.308-.309h.618a.31.31 0 01.309.31v.617a.31.31 0 01-.309.309zM4.309 18.716h5.684V10.07H4.309a.31.31 0 00-.31.309v8.028c0 .17.14.309.31.309zm4.449-1.235H5.235v-6.176h3.523v6.176z"
        fill="currentColor"
      />
      <Path
        d="M8.231 13.775h.926V12.54h-.926a.31.31 0 00-.309.31v.617c0 .17.14.308.309.308zM8.231 16.246h.926V15.01h-.926a.31.31 0 00-.309.308v.618c0 .17.14.309.309.309zM6.159 13.775h.618a.31.31 0 00.308-.308v-.618a.31.31 0 00-.308-.309h-.618a.31.31 0 00-.309.31v.617c0 .17.14.308.309.308zM6.159 16.246h.618a.31.31 0 00.308-.31v-.617a.31.31 0 00-.308-.309h-.618a.31.31 0 00-.309.31v.617c0 .17.14.309.309.309z"
        fill="currentColor"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgBranch);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
