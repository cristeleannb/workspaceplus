import DefaultIos from './QRScanScreen.ios';
import * as ios from './QRScanScreen.ios';
import DefaultAndroid from './QRScanScreen.android';
import * as android from './QRScanScreen.android';

declare var _test: typeof ios;
declare var _test: typeof android;

declare var _testDefault: typeof DefaultIos;
declare var _testDefault: typeof DefaultAndroid;

export * from './QRScanScreen.ios';
export default DefaultIos;
