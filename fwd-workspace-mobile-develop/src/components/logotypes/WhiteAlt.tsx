import * as React from 'react';
import Svg, {SvgProps, Path, G, Defs, ClipPath} from 'react-native-svg';

function SvgWhiteAlt(
  props: SvgProps,
  svgRef?: React.Ref<React.Component<SvgProps>>,
) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 72 40"
      fill="none"
      ref={svgRef}
      {...props}>
      <Path
        d="M46.508 10.614a.433.433 0 010 .592l-1.975 2.043a.404.404 0 01-.287.122.369.369 0 01-.155-.032.418.418 0 01-.248-.386V8.867a.42.42 0 01.248-.388.398.398 0 01.442.091l1.975 2.045z"
        fill="#fff"
      />
      <Path
        d="M34.124 5.296A1.694 1.694 0 0033.62 6c-.103.272-.217.666-.35 1.187l-.105.408-1.283 5.272-1.497-6.743c-.127-.644-.473-1.042-1.33-1.042H19.91c-.42 0-.435.463-.436.467v10.927s.007.233.222.233h.85c.61 0 1.39-.41 1.39-1.543v-3.329h3.202c1.221 0 1.519-.91 1.519-1.427v-.193c0-.183-.06-.295-.272-.295h-4.45V7.166h6.291l1.898 7.628c.058.228.39 1.435.39 1.435.128.424.114.485.46.485h.769c.945 0 1.271-.608 1.438-1.036.084-.233.143-.335.278-.859l1.674-6.576 1.77 6.543.367 1.44c.127.422.114.487.46.487h.768c.946 0 1.273-.608 1.44-1.04.081-.232.164-.454.3-.977l1.74-7.523h5.388c.463 0 .836.042 1.172.148.435.136.821.476 1.144 1.008.312.521.49 1.435.498 2.569 0 1.279-.367 2.414-1.047 3.027-.152.143-.33.254-.54.335a2.436 2.436 0 01-.62.155c-.213.024-.494.068-.864.072h-.005l-1.175.002h-1.689l-.008-.002c-.365 0-.377.22-.377.316v.457c0 .666.527 1.431 1.584 1.431h.037l2.05-.001c.523-.005.991-.046 1.41-.12.423-.077.82-.203 1.19-.387.37-.18.712-.421 1.022-.717.393-.385.714-.82.964-1.306a6.11 6.11 0 00.544-1.624 7.6 7.6 0 00.161-1.63v-.014c-.017-2.163-.63-3.7-1.85-4.772a3.745 3.745 0 00-1.574-.86c-.539-.142-1.175-.212-1.901-.212h-6.529c-.358.004-.895.197-1.102 1.077l-1.416 6.7-1.505-5.254v.004l-.102-.387c-.145-.56-.262-.962-.349-1.205a1.7 1.7 0 00-.468-.674c-.224-.206-.54-.309-.945-.309-.402 0-.718.098-.95.296zM68.243 30.087v-1.99h1.131v1.99h1.918V31.2h-1.918v2h-1.13v-2h-1.909v-1.112h1.908z"
        fill="#183028"
      />
      <Path
        d="M9.703 26.994h1.423l-1.979 7.233H7.714l-1.636-5.152-1.635 5.152H2.989L1 26.994h1.474l1.312 4.979 1.585-4.979h1.444l1.595 5 1.293-5zM22.342 31.442h-.727v2.785h-1.403v-7.233h2.797c.35 0 .663.058.939.174.282.115.521.272.716.469a2 2 0 01.465.704c.107.272.161.564.161.877 0 .51-.138.946-.414 1.306-.269.36-.64.609-1.11.745l1.534 2.958h-1.555l-1.403-2.785zm.404-1.214c.357 0 .633-.092.828-.275.195-.184.293-.425.293-.725 0-.306-.098-.55-.293-.734-.195-.184-.471-.276-.828-.276h-1.13v2.01h1.13zM28.803 31.228l-.888.99v2.01h-1.393v-7.234h1.393v3.275l2.867-3.275h1.828l-2.837 3.153 2.857 4.08h-1.747l-2.08-2.999zM37.135 29.106a1.446 1.446 0 00-.111-.326.975.975 0 00-.222-.337 1.204 1.204 0 00-.394-.255 1.432 1.432 0 00-.575-.102 1.282 1.282 0 00-.818.286.908.908 0 00-.222.285.773.773 0 00-.081.347c0 .197.064.37.192.52.128.143.323.242.585.296l1 .194c.323.061.609.16.858.296.249.136.458.3.626.49.168.183.296.39.383.622.088.231.132.473.132.724a2.115 2.115 0 01-.677 1.54c-.215.205-.484.371-.807.5-.317.13-.683.194-1.1.194-.479 0-.89-.068-1.232-.204a2.913 2.913 0 01-.869-.54 2.337 2.337 0 01-.525-.725 2.627 2.627 0 01-.222-.795l1.293-.347c.013.177.053.347.12.51.075.163.176.31.303.438.128.123.287.222.475.296.188.075.41.113.666.113.377 0 .663-.082.859-.245a.805.805 0 00.302-.643.741.741 0 00-.222-.54c-.148-.157-.363-.262-.646-.317l-1-.204c-.572-.116-1.03-.35-1.372-.704-.337-.36-.505-.816-.505-1.367 0-.32.064-.616.192-.888a2.3 2.3 0 01.545-.724c.229-.204.494-.364.797-.48.303-.115.623-.173.96-.173.43 0 .797.061 1.1.184.31.115.565.265.767.449.202.183.357.387.465.612.114.218.191.428.232.632l-1.252.388zM42.168 30.29c.35 0 .622-.092.818-.276.202-.19.302-.442.302-.755 0-.326-.1-.582-.302-.765-.196-.184-.468-.276-.818-.276h-1.1v2.072h1.1zm-1.11 1.213v2.724h-1.394v-7.233h2.675c.35 0 .67.058.96.174.289.108.538.265.747.469.208.197.366.435.474.714.114.272.172.571.172.898 0 .326-.057.629-.172.908a1.92 1.92 0 01-.474.714 2.337 2.337 0 01-.748.47c-.289.108-.609.162-.959.162h-1.282zM50.047 32.575h-2.908l-.595 1.652H45.07l2.746-7.233h1.615l2.726 7.233h-1.514l-.596-1.652zm-2.443-1.286h1.979l-.99-2.734-.99 2.734zM56.313 34.38c-.498 0-.969-.088-1.413-.265a3.55 3.55 0 01-1.171-.755 3.628 3.628 0 01-.788-1.183 3.979 3.979 0 01-.293-1.561c0-.578.098-1.099.293-1.561.202-.47.471-.867.808-1.194a3.576 3.576 0 011.16-.755 3.707 3.707 0 011.384-.265c.491 0 .925.072 1.302.214.384.136.707.32.97.551.269.225.484.48.646.765.168.286.29.575.363.868l-1.312.418a2.185 2.185 0 00-.202-.52 1.589 1.589 0 00-.384-.47 1.9 1.9 0 00-.575-.336 2.235 2.235 0 00-.808-.133c-.27 0-.535.051-.798.153a2.026 2.026 0 00-.706.439 2.175 2.175 0 00-.505.755 2.765 2.765 0 00-.192 1.07c0 .389.06.732.182 1.031.128.293.293.541.495.745.208.197.444.35.706.46.27.101.549.152.838.152.303 0 .569-.044.798-.132a1.968 1.968 0 00.99-.826 2.28 2.28 0 00.221-.521l1.303.398a3.259 3.259 0 01-.354.857c-.161.285-.38.547-.656.785-.27.238-.596.436-.98.592-.376.15-.817.224-1.322.224zM60.782 34.227v-7.233h4.483v1.326h-3.09v1.653h2.797v1.255h-2.796v1.673h3.089v1.326h-4.483z"
        fill="#fff"
      />
      <G clipPath="url(#white-alt_svg__clip0)" fill="#fff">
        <Path d="M15.386 30.177a1.825 1.825 0 100-3.65 1.825 1.825 0 000 3.65zM19.07 34.253a4.723 4.723 0 00-1.948-1.608 2.385 2.385 0 01-3.51.016c-.768.35-1.428.9-1.912 1.592h7.37z" />
        <Path d="M18.37 30.655h-5.9c-.279-.005-.515.184-.52.423a.414.414 0 000 .059l.325 2.51c.039.253.295.446.595.45h5.03c.304-.004.557-.196.595-.45l.321-2.506c.035-.24-.166-.457-.446-.486z" />
      </G>
      <Defs>
        <ClipPath id="white-alt_svg__clip0">
          <Path
            fill="#fff"
            transform="translate(11.7 26.527)"
            d="M0 0h7.37v7.726H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const ForwardRef = React.forwardRef(SvgWhiteAlt);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;