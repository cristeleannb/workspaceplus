import {FWDColors} from '@/components';

import {
  WorkstationListResponse,
  WorkstationStatus,
} from '@/services/api/api.service';

import _ from 'lodash';

export interface WorkSeatStyle {
  circleFill: string;
  text: string;
  disabled: boolean;
  selected?: boolean;
  workstationId?: string;
  divisionId?: string;
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
const defaultStyle: WorkSeatStyle = {
  circleFill: FWDColors.grey2,
  text: FWDColors.grey2,
  disabled: true,
  selected: false,
};

/**
 * available state colors
 * - circle fill: #E87722
 * - text: #E87722
 */
const availableStyle: WorkSeatStyle = {
  circleFill: FWDColors.orange,
  text: FWDColors.orange,
  disabled: false,
  selected: false,
};

/**
 * reserved state colors
 * - circle fill: #FAE4D3
 * - text: #8B8E8F
 */
const reservedStyle: WorkSeatStyle = {
  circleFill: FWDColors.orange20,
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
const selectedStyle: WorkSeatStyle = {
  circleFill: FWDColors.greenDarker,
  text: FWDColors.greenDarker,
  disabled: true,
  selected: true,
};

enum PeopleCultureWorkseats {
  A001 = 'A001',
  A002 = 'A002',
  A003 = 'A003',
  A004 = 'A004',
  A005 = 'A005',
  A006 = 'A006',
  A007 = 'A007',
  A008 = 'A008',
  A009 = 'A009',
  A010 = 'A010',
  A011 = 'A011',
  A012 = 'A012',
}

const peopleCultureWorkseats: {[key in PeopleCultureWorkseats]: WorkSeatStyle} =
  {
    A001: reservedStyle,
    A002: defaultStyle,
    A003: defaultStyle,
    A004: defaultStyle,
    A005: defaultStyle,
    A006: defaultStyle,
    A007: defaultStyle,
    A008: defaultStyle,
    A009: defaultStyle,
    A010: defaultStyle,
    A011: defaultStyle,
    A012: defaultStyle,
  };

enum MarketingSeats {
  B013 = 'B013',
  B014 = 'B014',
  B015 = 'B015',
  B016 = 'B016',
  B017 = 'B017',
  B018 = 'B018',
  B019 = 'B019',
  B020 = 'B020',
  B021 = 'B021',
  B022 = 'B022',
  B023 = 'B023',
  B024 = 'B024',
  B025 = 'B025',
  B026 = 'B026',
  B027 = 'B027',
  B028 = 'B028',
  B029 = 'B029',
  B030 = 'B030',
}

const marketingSeats: {[key in MarketingSeats]: WorkSeatStyle} = {
  B013: reservedStyle,
  B014: defaultStyle,
  B015: defaultStyle,
  B016: defaultStyle,
  B017: defaultStyle,
  B018: defaultStyle,
  B019: defaultStyle,
  B020: defaultStyle,
  B021: defaultStyle,
  B022: defaultStyle,
  B023: defaultStyle,
  B024: defaultStyle,
  B025: defaultStyle,
  B026: defaultStyle,
  B027: defaultStyle,
  B028: defaultStyle,
  B029: defaultStyle,
  B030: defaultStyle,
};

enum DistributionSeats {
  C031 = 'C031',
  C032 = 'C032',
  C033 = 'C033',
  C034 = 'C034',
  C035 = 'C035',
  C036 = 'C036',
  C037 = 'C037',
  C038 = 'C038',
  C039 = 'C039',
  C040 = 'C040',
  C041 = 'C041',
  C042 = 'C042',
  C043 = 'C043',
  C044 = 'C044',
  C045 = 'C045',
  C046 = 'C046',
  C047 = 'C047',
}

const distributionSeats: {[key in DistributionSeats]: WorkSeatStyle} = {
  C031: reservedStyle,
  C032: defaultStyle,
  C033: defaultStyle,
  C034: defaultStyle,
  C035: defaultStyle,
  C036: defaultStyle,
  C037: defaultStyle,
  C038: defaultStyle,
  C039: defaultStyle,
  C040: defaultStyle,
  C041: defaultStyle,
  C042: defaultStyle,
  C043: defaultStyle,
  C044: defaultStyle,
  C045: defaultStyle,
  C046: defaultStyle,
  C047: defaultStyle,
};

enum PartnershipSeats {
  D048 = 'D048',
  D049 = 'D049',
  D050 = 'D050',
  D051 = 'D051',
  D052 = 'D052',
  D053 = 'D053',
  D054 = 'D054',
  D055 = 'D055',
  D056 = 'D056',
  D057 = 'D057',
  D058 = 'D058',
  D059 = 'D059',
  D060 = 'D060',
  D061 = 'D061',
  D062 = 'D062',
  D063 = 'D063',
}

const partnershipSeats: {[key in PartnershipSeats]: WorkSeatStyle} = {
  D048: reservedStyle,
  D049: defaultStyle,
  D050: defaultStyle,
  D051: defaultStyle,
  D052: defaultStyle,
  D053: defaultStyle,
  D054: defaultStyle,
  D055: defaultStyle,
  D056: defaultStyle,
  D057: defaultStyle,
  D058: defaultStyle,
  D059: defaultStyle,
  D060: defaultStyle,
  D061: defaultStyle,
  D062: reservedStyle,
  D063: reservedStyle,
};

enum FinanceSeats {
  E064 = 'E064',
  E065 = 'E065',
  E066 = 'E066',
  E067 = 'E067',
  E068 = 'E068',
  E069 = 'E069',
  E070 = 'E070',
  E071 = 'E071',
  E072 = 'E072',
  E073 = 'E073',
  E074 = 'E074',
  E075 = 'E075',
  E076 = 'E076',
  E077 = 'E077',
  E078 = 'E078',
  E079 = 'E079',
  E080 = 'E080',
  E081 = 'E081',
  E082 = 'E082',
  E083 = 'E083',
  E084 = 'E084',
  E085 = 'E085',
  E086 = 'E086',
  E087 = 'E087',
  E088 = 'E088',
  E089 = 'E089',
  E090 = 'E090',
  E091 = 'E091',
  E092 = 'E092',
  E093 = 'E093',
  E094 = 'E094',
  E095 = 'E095',
  E096 = 'E096',
  E097 = 'E097',
  E098 = 'E098',
  E099 = 'E099',
  E100 = 'E100',
  E101 = 'E101',
  E102 = 'E102',
  E103 = 'E103',
  E104 = 'E104',
  E105 = 'E105',
  E106 = 'E106',
  E107 = 'E107',
  E108 = 'E108',
  E109 = 'E109',
  E110 = 'E110',
  E111 = 'E111',
  E112 = 'E112',
}

const financeSeats: {[key in FinanceSeats]: WorkSeatStyle} = {
  E064: reservedStyle,
  E065: defaultStyle,
  E066: defaultStyle,
  E067: reservedStyle,
  E068: defaultStyle,
  E069: defaultStyle,
  E070: defaultStyle,
  E071: defaultStyle,
  E072: defaultStyle,
  E073: defaultStyle,
  E074: defaultStyle,
  E075: defaultStyle,
  E076: defaultStyle,
  E077: defaultStyle,
  E078: defaultStyle,
  E079: defaultStyle,
  E080: defaultStyle,
  E081: defaultStyle,
  E082: defaultStyle,
  E083: defaultStyle,
  E084: defaultStyle,
  E085: defaultStyle,
  E086: defaultStyle,
  E087: defaultStyle,
  E088: defaultStyle,
  E089: defaultStyle,
  E090: defaultStyle,
  E091: defaultStyle,
  E092: defaultStyle,
  E093: defaultStyle,
  E094: defaultStyle,
  E095: defaultStyle,
  E096: defaultStyle,
  E097: defaultStyle,
  E098: defaultStyle,
  E099: defaultStyle,
  E100: defaultStyle,
  E101: defaultStyle,
  E102: defaultStyle,
  E103: defaultStyle,
  E104: defaultStyle,
  E105: defaultStyle,
  E106: defaultStyle,
  E107: defaultStyle,
  E108: defaultStyle,
  E109: reservedStyle,
  E110: reservedStyle,
  E111: reservedStyle,
  E112: reservedStyle,
};

enum InfoAndTransformSeats {
  F113 = 'F113',
  F114 = 'F114',
  F115 = 'F115',
  F116 = 'F116',
  F117 = 'F117',
  F118 = 'F118',
  F119 = 'F119',
  F120 = 'F120',
  F121 = 'F121',
  F122 = 'F122',
  F123 = 'F123',
  F124 = 'F124',
  F125 = 'F125',
  F126 = 'F126',
  F127 = 'F127',
  F128 = 'F128',
  F129 = 'F129',
  F130 = 'F130',
  F131 = 'F131',
  F132 = 'F132',
  F133 = 'F133',
  F134 = 'F134',
  F135 = 'F135',
  F136 = 'F136',
  F137 = 'F137',
  F138 = 'F138',
  F139 = 'F139',
  F140 = 'F140',
  F141 = 'F141',
  F142 = 'F142',
  F143 = 'F143',
  F144 = 'F144',
  F145 = 'F145',
  F146 = 'F146',
  F147 = 'F147',
  F148 = 'F148',
  F149 = 'F149',
  F150 = 'F150',
  F151 = 'F151',
  F152 = 'F152',
  F153 = 'F153',
  F154 = 'F154',
  F155 = 'F155',
  F156 = 'F156',
  F157 = 'F157',
  F158 = 'F158',
  F159 = 'F159',
  F160 = 'F160',
  F161 = 'F161',
  F162 = 'F162',
  F163 = 'F163',
  F164 = 'F164',
  F165 = 'F165',
  F166 = 'F166',
  F167 = 'F167',
  F168 = 'F168',
  F169 = 'F169',
}

const infoAndTransformSeats: {[key in InfoAndTransformSeats]: WorkSeatStyle} = {
  F113: reservedStyle,
  F114: defaultStyle,
  F115: defaultStyle,
  F116: defaultStyle,
  F117: defaultStyle,
  F118: defaultStyle,
  F119: defaultStyle,
  F120: defaultStyle,
  F121: defaultStyle,
  F122: defaultStyle,
  F123: defaultStyle,
  F124: defaultStyle,
  F125: defaultStyle,
  F126: defaultStyle,
  F127: defaultStyle,
  F128: defaultStyle,
  F129: defaultStyle,
  F130: defaultStyle,
  F131: defaultStyle,
  F132: defaultStyle,
  F133: defaultStyle,
  F134: defaultStyle,
  F135: defaultStyle,
  F136: defaultStyle,
  F137: defaultStyle,
  F138: defaultStyle,
  F139: defaultStyle,
  F140: defaultStyle,
  F141: defaultStyle,
  F142: defaultStyle,
  F143: defaultStyle,
  F144: defaultStyle,
  F145: defaultStyle,
  F146: defaultStyle,
  F147: defaultStyle,
  F148: defaultStyle,
  F149: defaultStyle,
  F150: defaultStyle,
  F151: defaultStyle,
  F152: defaultStyle,
  F153: defaultStyle,
  F154: defaultStyle,
  F155: defaultStyle,
  F156: defaultStyle,
  F157: defaultStyle,
  F158: defaultStyle,
  F159: defaultStyle,
  F160: defaultStyle,
  F161: reservedStyle,
  F162: reservedStyle,
  F163: defaultStyle,
  F164: defaultStyle,
  F165: defaultStyle,
  F166: defaultStyle,
  F167: defaultStyle,
  F168: defaultStyle,
  F169: defaultStyle,
};

enum RiskWorkseats {
  G170 = 'G170',
  G171 = 'G171',
  G172 = 'G172',
  G173 = 'G173',
}

const riskWorkseats: {[key in RiskWorkseats]: WorkSeatStyle} = {
  G170: reservedStyle,
  G171: defaultStyle,
  G172: defaultStyle,
  G173: defaultStyle,
};

enum LegalAndComplianceSeats {
  H174 = 'H174',
  H175 = 'H175',
  H178 = 'H178',
  H179 = 'H179',
  H180 = 'H180',
  H181 = 'H181',
  H182 = 'H182',
}

const legalAndComplianceSeats: {
  [key in LegalAndComplianceSeats]: WorkSeatStyle;
} = {
  H174: reservedStyle,
  H175: defaultStyle,
  H178: defaultStyle,
  H179: defaultStyle,
  H180: defaultStyle,
  H181: defaultStyle,
  H182: defaultStyle,
};

enum InternalAuditSeats {
  H176 = 'H176',
  H177 = 'H177',
}

const internalAuditSeats: {[key in InternalAuditSeats]: WorkSeatStyle} = {
  H176: defaultStyle,
  H177: defaultStyle,
};

enum OperationsSeats {
  I183 = 'I183',
  I184 = 'I184',
  I185 = 'I185',
  I186 = 'I186',
  I187 = 'I187',
  I188 = 'I188',
  I189 = 'I189',
  I190 = 'I190',
  I191 = 'I191',
  I192 = 'I192',
  I193 = 'I193',
  I194 = 'I194',
  I195 = 'I195',
  I196 = 'I196',
  I197 = 'I197',
  I198 = 'I198',
  I199 = 'I199',
  I200 = 'I200',
  I201 = 'I201',
  I202 = 'I202',
  I203 = 'I203',
  I204 = 'I204',
  I205 = 'I205',
  I206 = 'I206',
  I207 = 'I207',
  I208 = 'I208',
  I209 = 'I209',
  I210 = 'I210',
  I211 = 'I211',
  I212 = 'I212',
  I213 = 'I213',
  I214 = 'I214',
  I215 = 'I215',
  I216 = 'I216',
  I217 = 'I217',
  I218 = 'I218',
  I219 = 'I219',
  I220 = 'I220',
}

const operationsSeats: {[key in OperationsSeats]: WorkSeatStyle} = {
  I183: reservedStyle,
  I184: defaultStyle,
  I185: defaultStyle,
  I186: defaultStyle,
  I187: defaultStyle,
  I188: defaultStyle,
  I189: defaultStyle,
  I190: defaultStyle,
  I191: defaultStyle,
  I192: defaultStyle,
  I193: defaultStyle,
  I194: defaultStyle,
  I195: defaultStyle,
  I196: defaultStyle,
  I197: defaultStyle,
  I198: defaultStyle,
  I199: defaultStyle,
  I200: reservedStyle,
  I201: reservedStyle,
  I202: reservedStyle,
  I203: defaultStyle,
  I204: defaultStyle,
  I205: defaultStyle,
  I206: defaultStyle,
  I207: defaultStyle,
  I208: defaultStyle,
  I209: defaultStyle,
  I210: defaultStyle,
  I211: defaultStyle,
  I212: defaultStyle,
  I213: defaultStyle,
  I214: defaultStyle,
  I215: defaultStyle,
  I216: defaultStyle,
  I217: defaultStyle,
  I218: defaultStyle,
  I219: defaultStyle,
  I220: defaultStyle,
};

enum OfficeOfTheCEOSeats {
  J221 = 'J221',
  J222 = 'J222',
  J223 = 'J223',
  J224 = 'J224',
  J225 = 'J225',
}

const officeOfTheCEOSeats: {[key in OfficeOfTheCEOSeats]: WorkSeatStyle} = {
  J221: reservedStyle,
  J222: defaultStyle,
  J223: defaultStyle,
  J224: defaultStyle,
  J225: defaultStyle,
};

export type WorkSeats =
  | PeopleCultureWorkseats
  | MarketingSeats
  | DistributionSeats
  | PartnershipSeats
  | FinanceSeats
  | InfoAndTransformSeats
  | RiskWorkseats
  | LegalAndComplianceSeats
  | InternalAuditSeats
  | OperationsSeats
  | OfficeOfTheCEOSeats;

export type Seats = {
  [key in WorkSeats]: WorkSeatStyle;
};

export const workseatList: Seats = _.merge(
  {},
  peopleCultureWorkseats,
  marketingSeats,
  distributionSeats,
  partnershipSeats,
  financeSeats,
  infoAndTransformSeats,
  riskWorkseats,
  legalAndComplianceSeats,
  internalAuditSeats,
  operationsSeats,
  officeOfTheCEOSeats,
);

export const getWorkseatStyles = (
  wsList?: WorkstationListResponse,
  selectedSeat?: string,
) => {
  let styles = {...workseatList};

  const style = (id?: string, status?: WorkstationStatus) => {
    if (selectedSeat === id) {
      return selectedStyle;
    } else {
      switch (status) {
        case WorkstationStatus.Available:
          return availableStyle;

        case WorkstationStatus.Reserved:
          return reservedStyle;

        case WorkstationStatus.Selected:
          return selectedStyle;
      }
    }

    return defaultStyle;
  };

  if (wsList && wsList.desks && wsList.hotDesks) {
    const workstations = _.concat(wsList.desks, wsList.hotDesks);

    _.forEach(workstations, (ws, index) => {
      styles = _.assign(styles, {
        [ws.seatCode || index]: {
          ...style(ws.workstationId, ws.status),
          workstationId: ws.workstationId,
          divisionId: ws.divisionId,
        },
      });
    });
  }

  return styles;
};

export const getSeatCodeByID = (
  wsList?: WorkstationListResponse,
  id?: string,
) => {
  let seatCode: string | undefined;

  if (wsList && wsList.desks && wsList.hotDesks) {
    const workstations = _.concat(wsList.desks, wsList.hotDesks);

    seatCode = _.find(workstations, ws => ws.workstationId === id)?.seatCode;
  }

  return seatCode;
};

interface WorkseatCoordinates {
  x: number;
  y: number;
}

type WorkSeatsWithCoordinates = {
  [key in WorkSeats]: WorkseatCoordinates;
};

export const workseatCoordinates: WorkSeatsWithCoordinates = {
  // people and culture
  A001: {x: -0.8, y: -1},
  A002: {x: -1, y: -1},
  A003: {x: -1, y: -1},
  A004: {x: -1, y: -1},
  A005: {x: -1, y: -1},
  A006: {x: -1, y: -1},
  A007: {x: -1, y: -1},
  A008: {x: -1, y: -1},
  A009: {x: -1, y: -1},
  A010: {x: -1, y: -1},
  A011: {x: -1, y: -1},
  A012: {x: -1, y: -1},
  // marketing
  B013: {x: -0.5, y: -0.8},
  B014: {x: -1, y: -0.8},
  B015: {x: -1, y: -0.8},
  B016: {x: -1, y: -0.8},
  B017: {x: -1, y: -0.8},
  B018: {x: -1, y: -0.8},
  B019: {x: -1, y: -0.8},
  B020: {x: -1, y: -0.8},
  B021: {x: -1, y: -0.8},
  B022: {x: -1, y: -0.8},
  B023: {x: -1, y: -0.8},
  B024: {x: -1, y: -0.8},
  B025: {x: -1, y: -0.8},
  B026: {x: -1, y: -0.8},
  B027: {x: -1, y: -0.8},
  B028: {x: -1, y: -0.8},
  B029: {x: -1, y: -0.8},
  B030: {x: -1, y: -0.8},
  // distribution/agency
  C031: {x: -0.2, y: -0.8},
  C032: {x: -0.65, y: -1},
  C033: {x: -0.65, y: -1},
  C034: {x: -0.65, y: -1},
  C035: {x: -0.65, y: -1},
  C036: {x: -0.65, y: -1},
  C037: {x: -0.65, y: -1},
  C038: {x: -0.65, y: -1},
  C039: {x: -0.65, y: -1},
  C040: {x: -0.65, y: -1},
  C041: {x: -0.65, y: -1},
  C042: {x: -0.65, y: -1},
  C043: {x: -0.65, y: -1},
  C044: {x: -0.65, y: -1},
  C045: {x: -0.65, y: -1},
  C046: {x: -0.65, y: -1},
  C047: {x: -0.65, y: -1},
  // partnership
  D048: {x: 0.15, y: -0.8},
  D049: {x: 1, y: -0.85},
  D050: {x: 1, y: -0.85},
  D051: {x: 1, y: -0.85},
  D052: {x: 1, y: -0.85},
  D053: {x: 1, y: -0.85},
  D054: {x: 1, y: -0.85},
  D055: {x: 1, y: -0.85},
  D056: {x: 1, y: -0.85},
  D057: {x: 1, y: -0.85},
  D058: {x: 1, y: -0.85},
  D059: {x: 1, y: -0.85},
  D060: {x: 1, y: -0.85},
  D061: {x: 1, y: -0.85},
  D062: {x: 1, y: -0.85},
  D063: {x: 1, y: -0.85},
  // finance
  E064: {x: 0.4, y: -0.8},
  E065: {x: 1, y: -0.4},
  E066: {x: 1, y: -0.4},
  E067: {x: 1, y: -0.4},
  E068: {x: 1, y: -0.4},
  E069: {x: 1, y: -0.4},
  E070: {x: 1, y: -0.4},
  E071: {x: 1, y: -0.4},
  E072: {x: 1, y: -0.4},
  E073: {x: 1, y: -0.4},
  E074: {x: 1, y: -0.4},
  E075: {x: 1, y: -0.4},
  E076: {x: 1, y: -0.4},
  E077: {x: 1, y: -0.4},
  E078: {x: 1, y: -0.4},
  E079: {x: 1, y: -0.4},
  E080: {x: 1, y: -0.4},
  E081: {x: 1, y: -0.4},
  E082: {x: 1, y: -0.4},
  E083: {x: 1, y: -0.4},
  E084: {x: 1, y: -0.4},
  E085: {x: 1, y: -0.4},
  E086: {x: 1, y: -0.4},
  E087: {x: 1, y: -0.4},
  E088: {x: 1, y: -0.4},
  E089: {x: 1, y: -0.4},
  E090: {x: 1, y: -0.1},
  E091: {x: 1, y: -0.1},
  E092: {x: 1, y: -0.1},
  E093: {x: 1, y: -0.1},
  E094: {x: 1, y: -0.1},
  E095: {x: 1, y: -0.1},
  E096: {x: 1, y: -0.1},
  E097: {x: 1, y: -0.1},
  E098: {x: 1, y: -0.1},
  E099: {x: 1, y: -0.1},
  E100: {x: 1, y: -0.1},
  E101: {x: 1, y: -0.1},
  E102: {x: 1, y: -0.1},
  E103: {x: 1, y: -0.1},
  E104: {x: 1, y: -0.1},
  E105: {x: 1, y: -0.1},
  E106: {x: 1, y: -0.1},
  E107: {x: 1, y: -0.1},
  E108: {x: 1, y: -0.1},
  E109: {x: 1, y: -0.1},
  E110: {x: 1, y: -0.1},
  E111: {x: 1, y: -0.1},
  E112: {x: 1, y: -0.1},
  // info and transform
  F113: {x: 0.5, y: 0},
  F114: {x: 1, y: 0.6},
  F115: {x: 1, y: 0.6},
  F116: {x: 1, y: 0.6},
  F117: {x: 1, y: 0.6},
  F118: {x: 1, y: 0.6},
  F119: {x: 1, y: 0.6},
  F120: {x: 1, y: 0.6},
  F121: {x: 1, y: 0.6},
  F122: {x: 1, y: 0.6},
  F123: {x: 1, y: 0.6},
  F124: {x: 1, y: 0.6},
  F125: {x: 1, y: 0.6},
  F126: {x: 1, y: 0.6},
  F127: {x: 1, y: 0.6},
  F128: {x: 1, y: 0.6},
  F129: {x: 1, y: 0.6},
  F130: {x: 1, y: 0.6},
  F131: {x: 1, y: 0.6},
  F132: {x: 1, y: 0.6},
  F133: {x: 1, y: 0.6},
  F134: {x: 1, y: 0.6},
  F135: {x: 1, y: 0.6},
  F136: {x: 1, y: 0.6},
  F137: {x: 1, y: 0.6},
  F138: {x: 1, y: 0.6},
  F139: {x: 1, y: 0.6},
  F140: {x: 1, y: 0.6},
  F141: {x: 1, y: 0.6},
  F142: {x: 1, y: 0.6},
  F143: {x: 1, y: 0.6},
  F144: {x: 1, y: 0.6},
  F145: {x: 1, y: 0.6},
  F146: {x: 1, y: 0.6},
  F147: {x: 1, y: 0.6}, // here
  F148: {x: 1, y: 0.8},
  F149: {x: 1, y: 0.8},
  F150: {x: 1, y: 0.8},
  F151: {x: 1, y: 0.8},
  F152: {x: 1, y: 0.8},
  F153: {x: 1, y: 0.8},
  F154: {x: 1, y: 0.8},
  F155: {x: 1, y: 0.8},
  F156: {x: 1, y: 0.8},
  F157: {x: 1, y: 0.8},
  F158: {x: 1, y: 0.8},
  F159: {x: 1, y: 0.8},
  F160: {x: 1, y: 0.8},
  F161: {x: 1, y: 0.8},
  F162: {x: 1, y: 0.8},
  F163: {x: 0.5, y: 0.8},
  F164: {x: 0.5, y: 0.8},
  F165: {x: 0.5, y: 0.8},
  F166: {x: 0.5, y: 0.8},
  F167: {x: 0.5, y: 0.8},
  F168: {x: 0.5, y: 0.8},
  F169: {x: 0.5, y: 0.8},
  // risk
  G170: {x: 0.5, y: 0.15},
  G171: {x: 1, y: 1},
  G172: {x: 1, y: 1},
  G173: {x: 1, y: 1},
  // legal
  H174: {x: 0.5, y: 0.4},
  H175: {x: 1, y: 1},
  H178: {x: 1, y: 1},
  H179: {x: 1, y: 1},
  H180: {x: 1, y: 1},
  H181: {x: 1, y: 1},
  H182: {x: 1, y: 1},
  // audit
  H176: {x: 1, y: 1},
  H177: {x: 1, y: 1},
  // operation
  I183: {x: 0.5, y: 0.6},
  I184: {x: -0.3, y: 1},
  I185: {x: -0.3, y: 1},
  I186: {x: -0.3, y: 1},
  I187: {x: -0.3, y: 1},
  I188: {x: -0.3, y: 1},
  I189: {x: -0.3, y: 1},
  I190: {x: -1, y: 1},
  I191: {x: -1, y: 1},
  I192: {x: -1, y: 1},
  I193: {x: -1, y: 1},
  I194: {x: -1, y: 1},
  I195: {x: -1, y: 1},
  I196: {x: -1, y: 1},
  I197: {x: -1, y: 1},
  I198: {x: -1, y: 1},
  I199: {x: -1, y: 1},
  I200: {x: -1, y: 1},
  I201: {x: -1, y: 1},
  I202: {x: -1, y: 1},
  I203: {x: -1, y: 1},
  I204: {x: -1, y: 1},
  I205: {x: -1, y: 1},
  I206: {x: -1, y: 1},
  I207: {x: -1, y: 1},
  I208: {x: -1, y: 1},
  I209: {x: -1, y: 1},
  I210: {x: -1, y: 1},
  I211: {x: -1, y: 1},
  I212: {x: -1, y: 1},
  I213: {x: -1, y: 1},
  I214: {x: -1, y: 1},
  I215: {x: -1, y: 1},
  I216: {x: -1, y: 1},
  I217: {x: -1, y: 1},
  I218: {x: -1, y: 1},
  I219: {x: -1, y: 1},
  I220: {x: -1, y: 1},
  // ceo
  J221: {x: -0.75, y: 1},
  J222: {x: -0.75, y: 1},
  J223: {x: -0.75, y: 1},
  J224: {x: -0.75, y: 1},
  J225: {x: -0.75, y: 1},
};

export const getWSCoordinatesBySeat = (
  seat?: WorkSeats,
): WorkseatCoordinates => {
  if (seat) {
    return workseatCoordinates[seat];
  } else {
    return {x: 0, y: 0};
  }
};
