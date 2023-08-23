import {FWDColors} from '@/components';

import {
  ParkingSlotListResponse,
  ParkingStatus,
} from '@/services/api/api.service';

import _ from 'lodash';

export interface ParkingSlotStyle {
  circleFill: string;
  carStroke: string;
  text: string;
  disabled: boolean;
  selected?: boolean;
  parkingSlotId?: string;
}

/**
 * workseat have 4 states
 * `default`
 * `available`
 * `reserved`
 * `selected`
 */

/**
 * default state colors
 * - circle fill: #B3B6B8
 * - text: #B3B6B8
 */
const defaultStyle: ParkingSlotStyle = {
  circleFill: FWDColors.grey1,
  carStroke: FWDColors.grey2,
  text: FWDColors.grey2,
  disabled: true,
  selected: false,
};

/**
 * available state colors
 * - circle fill: #E87722
 * - text: #E87722
 */
const availableStyle: ParkingSlotStyle = {
  circleFill: FWDColors.orange,
  carStroke: FWDColors.white,
  text: FWDColors.orange,
  disabled: false,
  selected: false,
};

/**
 * reserved state colors
 * - circle fill: #FAE4D3
 * - text: #8B8E8F
 */
const reservedStyle: ParkingSlotStyle = {
  circleFill: FWDColors.orange20,
  carStroke: FWDColors.orange50,
  text: FWDColors.grey3,
  disabled: true,
  selected: false,
};

/**
 * for selected state, the circle have a check icon
 * we will just add the check icon later,
 * for now lets just use the circle bgcolor
 *
 * selected state colors
 * - circle fill: #183028
 * - text: #183028
 */
const selectedStyle: ParkingSlotStyle = {
  circleFill: FWDColors.greenDarker,
  carStroke: FWDColors.white,
  text: FWDColors.greenDarker,
  disabled: true,
  selected: true,
};

enum ParkingBasement1Slots {
  B101 = 'B1-01',
  B102 = 'B1-02',
  B103 = 'B1-03',
  B104 = 'B1-04',
  B105 = 'B1-05',
  B106 = 'B1-06',
  B107 = 'B1-07',
  B108 = 'B1-08',
  B109 = 'B1-09',
  B110 = 'B1-10',
  B111 = 'B1-11',
  B112 = 'B1-12',
  B113 = 'B1-13',
  B114 = 'B1-14',
  B115 = 'B1-15',
  B116 = 'B1-16',
  B117 = 'B1-17',
  B118 = 'B1-18',
  B119 = 'B1-19',
  B122 = 'B1-22',
  B123 = 'B1-23',
  B124 = 'B1-24',
  B125 = 'B1-25',
  B126 = 'B1-26',
  B127 = 'B1-27',
  B128 = 'B1-28',
  B129 = 'B1-29',
  B130 = 'B1-30',
  B131 = 'B1-31',
  B132 = 'B1-32',
  B133 = 'B1-33',
  B134 = 'B1-34',
  B136 = 'B1-36',
  B137 = 'B1-37',
  B138 = 'B1-38',
  B139 = 'B1-39',
  B140 = 'B1-40',
  B141 = 'B1-41',
  B142 = 'B1-42',
  B143 = 'B1-43',
  B144 = 'B1-44',
  B145 = 'B1-45',
  B146 = 'B1-46',
  B148 = 'B1-48',
  B149 = 'B1-49',
  B150 = 'B1-50',
  B151 = 'B1-51',
}

enum ParkingBasement2Slots {
  B201 = 'B2-01',
  B202 = 'B2-02',
  B203 = 'B2-03',
  B204 = 'B2-04',
  B205 = 'B2-05',
  B206 = 'B2-06',
  B207 = 'B2-07',
  B208 = 'B2-08',
  B209 = 'B2-09',
  B210 = 'B2-10',
  B211 = 'B2-11',
  B212 = 'B2-12',
  B213 = 'B2-13',
  B214 = 'B2-14',
  B215 = 'B2-15',
  B216 = 'B2-16',
  B217 = 'B2-17',
  B218 = 'B2-18',
  B219 = 'B2-19',
  B222 = 'B2-22',
  B223 = 'B2-23',
  B224 = 'B2-24',
  B225 = 'B2-25',
  B226 = 'B2-26',
  B227 = 'B2-27',
  B228 = 'B2-28',
  B229 = 'B2-29',
  B230 = 'B2-30',
  B231 = 'B2-31',
  B232 = 'B2-32',
  B233 = 'B2-33',
  B234 = 'B2-34',
  B235 = 'B2-35',
  B236 = 'B2-36',
  B237 = 'B2-37',
  B238 = 'B2-38',
  B239 = 'B2-39',
  B240 = 'B2-40',
  B241 = 'B2-41',
  B242 = 'B2-42',
  B243 = 'B2-43',
  B244 = 'B2-44',
  B245 = 'B2-45',
  B246 = 'B2-46',
  B247 = 'B2-47',
  B248 = 'B2-48',
  B249 = 'B2-49',
  B250 = 'B2-50',
  B251 = 'B2-51',
  B252 = 'B2-52',
  B253 = 'B2-53',
  B254 = 'B2-54',
  B255 = 'B2-55',
  B256 = 'B2-56',
  B257 = 'B2-57',
  B258 = 'B2-58',
  B259 = 'B2-59',
  B260 = 'B2-60',
  B261 = 'B2-61',
  B262 = 'B2-62',
  B263 = 'B2-63',
  B264 = 'B2-64',
  B265 = 'B2-65',
  B266 = 'B2-66',
  B267 = 'B2-67',
  B268 = 'B2-68',
  B269 = 'B2-69',
  B270 = 'B2-70',
  B271 = 'B2-71',
  B272 = 'B2-72',
  B273 = 'B2-73',
  B274 = 'B2-74',
  B275 = 'B2-75',
  B276 = 'B2-76',
  B277 = 'B2-77',
}

const parkingBasement1Slots: {
  [key in ParkingBasement1Slots]: ParkingSlotStyle;
} = {
  'B1-01': defaultStyle,
  'B1-02': reservedStyle,
  'B1-03': reservedStyle,
  'B1-04': reservedStyle,
  'B1-05': defaultStyle,
  'B1-06': defaultStyle,
  'B1-07': reservedStyle,
  'B1-08': reservedStyle,
  'B1-09': reservedStyle,
  'B1-10': defaultStyle,
  'B1-11': defaultStyle,
  'B1-12': defaultStyle,
  'B1-13': defaultStyle,
  'B1-14': defaultStyle,
  'B1-15': reservedStyle,
  'B1-16': reservedStyle,
  'B1-17': defaultStyle,
  'B1-18': defaultStyle,
  'B1-19': defaultStyle,
  'B1-22': defaultStyle,
  'B1-23': defaultStyle,
  'B1-24': defaultStyle,
  'B1-25': defaultStyle,
  'B1-26': defaultStyle,
  'B1-27': defaultStyle,
  'B1-28': defaultStyle,
  'B1-29': defaultStyle,
  'B1-30': defaultStyle,
  'B1-31': defaultStyle,
  'B1-32': defaultStyle,
  'B1-33': defaultStyle,
  'B1-34': defaultStyle,
  'B1-36': defaultStyle,
  'B1-37': defaultStyle,
  'B1-38': defaultStyle,
  'B1-39': defaultStyle,
  'B1-40': defaultStyle,
  'B1-41': defaultStyle,
  'B1-42': defaultStyle,
  'B1-43': defaultStyle,
  'B1-44': defaultStyle,
  'B1-45': defaultStyle,
  'B1-46': defaultStyle,
  'B1-48': defaultStyle,
  'B1-49': defaultStyle,
  'B1-50': defaultStyle,
  'B1-51': defaultStyle,
};

const parkingBasement2Slots: {
  [key in ParkingBasement2Slots]: ParkingSlotStyle;
} = {
  'B2-01': defaultStyle,
  'B2-02': reservedStyle,
  'B2-03': reservedStyle,
  'B2-04': reservedStyle,
  'B2-05': reservedStyle,
  'B2-06': reservedStyle,
  'B2-07': defaultStyle,
  'B2-08': defaultStyle,
  'B2-09': defaultStyle,
  'B2-10': defaultStyle,
  'B2-11': defaultStyle,
  'B2-12': defaultStyle,
  'B2-13': defaultStyle,
  'B2-14': defaultStyle,
  'B2-15': defaultStyle,
  'B2-16': defaultStyle,
  'B2-17': defaultStyle,
  'B2-18': defaultStyle,
  'B2-19': defaultStyle,
  'B2-22': defaultStyle,
  'B2-23': defaultStyle,
  'B2-24': defaultStyle,
  'B2-25': defaultStyle,
  'B2-26': defaultStyle,
  'B2-27': defaultStyle,
  'B2-28': defaultStyle,
  'B2-29': defaultStyle,
  'B2-30': defaultStyle,
  'B2-31': defaultStyle,
  'B2-32': defaultStyle,
  'B2-33': reservedStyle,
  'B2-34': reservedStyle,
  'B2-35': reservedStyle,
  'B2-36': reservedStyle,
  'B2-37': reservedStyle,
  'B2-38': reservedStyle,
  'B2-39': defaultStyle,
  'B2-40': defaultStyle,
  'B2-41': defaultStyle,
  'B2-42': defaultStyle,
  'B2-43': defaultStyle,
  'B2-44': defaultStyle,
  'B2-45': reservedStyle,
  'B2-46': defaultStyle,
  'B2-47': defaultStyle,
  'B2-48': defaultStyle,
  'B2-49': defaultStyle,
  'B2-50': defaultStyle,
  'B2-51': defaultStyle,
  'B2-52': defaultStyle,
  'B2-53': reservedStyle,
  'B2-54': defaultStyle,
  'B2-55': defaultStyle,
  'B2-56': defaultStyle,
  'B2-57': defaultStyle,
  'B2-58': reservedStyle,
  'B2-59': defaultStyle,
  'B2-60': reservedStyle,
  'B2-61': defaultStyle,
  'B2-62': reservedStyle,
  'B2-63': reservedStyle,
  'B2-64': reservedStyle,
  'B2-65': reservedStyle,
  'B2-66': reservedStyle,
  'B2-67': reservedStyle,
  'B2-68': reservedStyle,
  'B2-69': reservedStyle,
  'B2-70': reservedStyle,
  'B2-71': reservedStyle,
  'B2-72': reservedStyle,
  'B2-73': reservedStyle,
  'B2-74': reservedStyle,
  'B2-75': reservedStyle,
  'B2-76': reservedStyle,
  'B2-77': reservedStyle,
};

export type ParkingSlots = ParkingBasement1Slots | ParkingBasement2Slots;

export type Slots = {
  [key in ParkingSlots]: ParkingSlotStyle;
};

export const parkingSlotList: Slots = _.merge(
  {},
  parkingBasement1Slots,
  parkingBasement2Slots,
);

export const getParkingSlotStyles = (
  psList?: ParkingSlotListResponse,
  selectedSlot?: string,
) => {
  let styles = {...parkingSlotList};

  const style = (id?: string, status?: ParkingStatus) => {
    if (selectedSlot === id) {
      return selectedStyle;
    } else {
      switch (status) {
        case ParkingStatus.Available:
          return availableStyle;

        case ParkingStatus.Reserved:
          return reservedStyle;

        case ParkingStatus.Selected:
          return selectedStyle;
      }
    }

    return defaultStyle;
  };

  if (psList && psList.parkingSlots) {
    const parkingSlots = _.concat(psList.parkingSlots);

    _.forEach(parkingSlots, (ps, index) => {
      styles = _.assign(styles, {
        [ps.parkingCode || index]: {
          ...style(ps.parkingSlotId, ps.status),
          parkingSlotId: ps.parkingSlotId,
        },
      });
    });
  }

  return styles;
};

export const getParkingCodeByID = (
  psList?: ParkingSlotListResponse,
  id?: string,
) => {
  let parkingCode: string | undefined;

  if (psList && psList.parkingSlots) {
    const parkingSlots = _.concat(psList.parkingSlots);

    parkingCode = _.find(
      parkingSlots,
      ps => ps.parkingSlotId === id,
    )?.parkingCode;
  }

  return parkingCode;
};

export const getParkingFloorByID = (
  psList?: ParkingSlotListResponse,
  id?: string,
) => {
  let parkingFloor: number | undefined;

  if (psList && psList.parkingSlots) {
    const parkingSlots = _.concat(psList.parkingSlots);

    parkingFloor = _.find(
      parkingSlots,
      ps => ps.parkingSlotId === id,
    )?.parkingFloor;
  }

  return parkingFloor;
};

interface ParkingSlotCoordinates {
  x: number;
  y: number;
}

type ParkingSlotsWithCoordinates = {
  [key in ParkingSlots]: ParkingSlotCoordinates;
};

export const parkingSlotCoordinates: ParkingSlotsWithCoordinates = {
  // Basement 1
  'B1-01': {x: 50, y: 0},
  'B1-02': {x: 50, y: 0},
  'B1-03': {x: 50, y: 0},
  'B1-04': {x: 50, y: 0},
  'B1-05': {x: 50, y: -70},
  'B1-06': {x: 50, y: -70},
  'B1-07': {x: 50, y: -70},
  'B1-08': {x: 50, y: -70},
  'B1-09': {x: 50, y: -70},
  'B1-10': {x: 50, y: -70},
  'B1-11': {x: 50, y: -70},
  'B1-12': {x: 50, y: -70},
  'B1-13': {x: 50, y: -70},
  'B1-14': {x: 50, y: -200},
  'B1-15': {x: 50, y: -200},
  'B1-16': {x: 50, y: -200},
  'B1-17': {x: 50, y: -200},
  'B1-18': {x: 50, y: -200},
  'B1-19': {x: 50, y: -200},
  'B1-22': {x: 50, y: -200},
  'B1-23': {x: 50, y: -200},
  'B1-24': {x: 50, y: -200},
  'B1-25': {x: 50, y: -200},
  'B1-26': {x: 50, y: -200},
  'B1-27': {x: 50, y: -200},
  'B1-28': {x: 50, y: -200},
  'B1-29': {x: 50, y: -200},
  'B1-30': {x: 50, y: -200},
  'B1-31': {x: 50, y: -200},
  'B1-32': {x: 50, y: -20},
  'B1-33': {x: 50, y: -20},
  'B1-34': {x: 50, y: -20},
  'B1-36': {x: 0, y: 0},
  'B1-37': {x: 0, y: 0},
  'B1-38': {x: -100, y: -20},
  'B1-39': {x: -100, y: -20},
  'B1-40': {x: -70, y: -200},
  'B1-41': {x: -70, y: -200},
  'B1-42': {x: -70, y: -200},
  'B1-43': {x: -100, y: 0},
  'B1-44': {x: -100, y: 0},
  'B1-45': {x: -100, y: 0},
  'B1-46': {x: -100, y: 0},
  'B1-48': {x: -100, y: 0},
  'B1-49': {x: -100, y: 0},
  'B1-50': {x: -100, y: 0},
  'B1-51': {x: -100, y: -20},

  // Basement2
  'B2-01': {x: 0, y: 0},
  'B2-02': {x: 0, y: 0},
  'B2-03': {x: 0, y: 0},
  'B2-04': {x: 0, y: 0},
  'B2-05': {x: 0, y: 0},
  'B2-06': {x: 0, y: 0},
  'B2-07': {x: 0, y: 0},
  'B2-08': {x: 0, y: 0},
  'B2-09': {x: 0, y: -150},
  'B2-10': {x: 0, y: -150},
  'B2-11': {x: 0, y: -150},
  'B2-12': {x: 0, y: -150},
  'B2-13': {x: 0, y: -150},
  'B2-14': {x: 0, y: -150},
  'B2-15': {x: 0, y: -150},
  'B2-16': {x: 0, y: -150},
  'B2-17': {x: 0, y: -200},
  'B2-18': {x: 0, y: -200},
  'B2-19': {x: 0, y: -200},
  'B2-22': {x: 0, y: -150},
  'B2-23': {x: 0, y: -150},
  'B2-24': {x: 0, y: -150},
  'B2-25': {x: 0, y: -150},
  'B2-26': {x: 0, y: -150},
  'B2-27': {x: 0, y: -150},
  'B2-28': {x: 0, y: -150},
  'B2-29': {x: 0, y: -150},
  'B2-30': {x: 0, y: -150},
  'B2-31': {x: 0, y: -150},
  'B2-32': {x: 0, y: 0},
  'B2-33': {x: 0, y: 0},
  'B2-34': {x: 0, y: 0},
  'B2-35': {x: 0, y: 0},
  'B2-36': {x: 0, y: 0},
  'B2-37': {x: 0, y: 0},
  'B2-38': {x: 0, y: 0},
  'B2-39': {x: 0, y: 0},
  'B2-40': {x: 0, y: 0},
  'B2-41': {x: 0, y: 0},
  'B2-42': {x: 0, y: 0},
  'B2-43': {x: 0, y: 0},
  'B2-44': {x: 0, y: 0},
  'B2-45': {x: 0, y: 0},
  'B2-46': {x: 0, y: 0},
  'B2-47': {x: 0, y: 0},
  'B2-48': {x: 0, y: 0},
  'B2-49': {x: 0, y: -150},
  'B2-50': {x: 0, y: -150},
  'B2-51': {x: 0, y: -150},
  'B2-52': {x: 0, y: -150},
  'B2-53': {x: 0, y: -150},
  'B2-54': {x: 0, y: -150},
  'B2-55': {x: 0, y: -150},
  'B2-56': {x: 0, y: -150},
  'B2-57': {x: 0, y: -150},
  'B2-58': {x: 0, y: -150},
  'B2-59': {x: 0, y: -150},
  'B2-60': {x: 0, y: -200},
  'B2-61': {x: 0, y: -200},
  'B2-62': {x: 0, y: -200},
  'B2-63': {x: 0, y: -150},
  'B2-64': {x: 0, y: -150},
  'B2-65': {x: 0, y: -150},
  'B2-66': {x: 0, y: -150},
  'B2-67': {x: 0, y: -150},
  'B2-68': {x: 0, y: -150},
  'B2-69': {x: 0, y: -150},
  'B2-70': {x: 0, y: -150},
  'B2-71': {x: 0, y: -150},
  'B2-72': {x: 0, y: 0},
  'B2-73': {x: 0, y: 0},
  'B2-74': {x: 0, y: 0},
  'B2-75': {x: 0, y: 0},
  'B2-76': {x: 0, y: 0},
  'B2-77': {x: 0, y: 0},
};

export const getPSCoordinatesBySlot = (
  slot?: ParkingSlots,
): ParkingSlotCoordinates => {
  if (slot) {
    return parkingSlotCoordinates[slot];
  } else {
    return {x: 0, y: 0};
  }
};
