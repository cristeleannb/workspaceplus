import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgWarningAlt(
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
        d="M58.451 25.171l4.39 10.14c2.783-1.174 4.081-4.451 2.907-7.234-1.237-2.844-4.514-4.143-7.297-2.906z"
        fill="#F3BB91"
      />
      <Path
        d="M71.057 25.117l-3.409 1.464.44 1.023 3.408-1.464-.439-1.023zM68.166 32.641l-.412 1.034 3.445 1.375.413-1.033-3.445-1.376zM64.43 19.201l-1.371 3.447 1.034.412 1.372-3.447-1.034-.412z"
        fill="#183028"
      />
      <Path
        d="M35.387 73.958c.371.803.99 1.484 1.855 1.793.866.37 1.793.309 2.597-.062l2.35-.99c.804-.37 1.484-.989 1.793-1.854.37-.866.31-1.794-.062-2.597L37.428 55.16l-8.533 3.648 6.492 15.15z"
        fill="#E87722"
      />
      <Path
        d="M39.654 60.17l.804-.31c.37-.186.742-.495.927-.928.186-.432.124-.927 0-1.298l-1.608-3.525-2.35.99 2.227 5.07z"
        fill="#183028"
      />
      <Path
        d="M46.332 10.454c.742 6.678-2.906 13.294-9.398 16.139l-7.606 3.277L39.345 53.18l7.606-3.277c6.492-2.783 13.85-.866 18.179 4.266L46.332 10.454z"
        fill="#E87722"
      />
      <Path
        d="M28.957 28.88l-12.614 5.442c-3.215 1.36-5.936 4.02-7.358 7.544-1.422 3.524-1.237 7.296.123 10.512 1.423 3.215 4.02 5.936 7.544 7.296 3.525 1.422 7.296 1.237 10.512-.124l12.614-5.441-10.82-25.228z"
        fill="#F3BB91"
      />
      <Path
        d="M50.785 5.817c-.31-.68-.866-1.298-1.608-1.608-.742-.309-1.546-.247-2.288 0-.68.31-1.298.866-1.607 1.608-.31.742-.248 1.546 0 2.288L66.12 56.52c.309.68.865 1.298 1.607 1.607.742.31 1.546.248 2.288 0 .68-.309 1.299-.865 1.608-1.608.309-.742.247-1.545 0-2.287L50.785 5.817z"
        fill="#E87722"
      />
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgWarningAlt);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
