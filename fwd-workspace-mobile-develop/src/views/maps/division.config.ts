import {FWDColors} from '@/components';
import {DivisionEntity} from '@/services/api/api.service';

import _ from 'lodash';

export interface DivisionStyle {
  boxFill: string;
  boxBorder: string;
  arrow: string;
  icon: string;
  text: string;
  disabled: boolean;
}
/**
 * ws base map styles have 3 states, default, hotdesk and active.
 */

/**
 * default state colors
 * - box fill: #ffffff
 * - box border: #DBDFE1
 * - arrow: #B3B6B8
 * - icon: #8B8E8F
 * - text: #8B8E8F
 */
export const defaultStyle: DivisionStyle = {
  boxFill: FWDColors.white,
  boxBorder: FWDColors.grey1,
  arrow: FWDColors.grey2,
  icon: FWDColors.grey3,
  text: FWDColors.grey3,
  disabled: true,
};

/**
 * active state colors
 * - box fill: #FAE4D3
 * - box border: #E87722
 * - arrow: #E87722
 * - icon: #E87722
 * - text: #183028
 */
export const activeStyle: DivisionStyle = {
  boxFill: FWDColors.orange20,
  boxBorder: FWDColors.orange,
  arrow: FWDColors.orange,
  icon: FWDColors.orange,
  text: FWDColors.greenDarker,
  disabled: false,
};

/**
 * active state colors
 * - box fill: #FAE4D3
 * - box border: #E87722
 * - arrow: #E87722
 * - icon: #E87722
 * - text: #183028
 */
export const hotdeskStyle: DivisionStyle = {
  boxFill: FWDColors.orange5,
  boxBorder: FWDColors.orange70,
  arrow: FWDColors.orange70,
  icon: FWDColors.orange70,
  text: FWDColors.greenDarker,
  disabled: false,
};

export enum Divisions {
  'none',
  'PeopleAndCulture',
  'Marketing',
  'Agency',
  'Partnership',
  'FinanceManagementTeam',
  'InformationAndTransformationOffice',
  'Risk',
  'LegalAndCompliance',
  'InternalAudit',
  'Operations',
  'OfficeOfTheCEO',
}

export const divisionStyles: {[key in Divisions]: DivisionStyle} = {
  /** there is no 0 divisionId, this is just a placeholder */
  [Divisions.none]: defaultStyle,
  [Divisions.PeopleAndCulture]: defaultStyle,
  [Divisions.Marketing]: defaultStyle,
  [Divisions.Agency]: defaultStyle,
  [Divisions.Partnership]: defaultStyle,
  [Divisions.FinanceManagementTeam]: defaultStyle,
  [Divisions.InformationAndTransformationOffice]: defaultStyle,
  [Divisions.Risk]: defaultStyle,
  [Divisions.LegalAndCompliance]: defaultStyle,
  [Divisions.InternalAudit]: defaultStyle,
  [Divisions.Operations]: defaultStyle,
  [Divisions.OfficeOfTheCEO]: defaultStyle,
};

export const getDivisionStyles = (divisionList: DivisionEntity[]) => {
  let styles = {...divisionStyles};

  divisionList.forEach((division, index) => {
    styles = _.assign(styles, {
      [division.divisionId || index]: division.isMain
        ? activeStyle
        : hotdeskStyle,
    });
  });

  return styles;
};

interface DivisionCoordinates {
  x: number;
  y: number;
}

export const divisionCoordinates: {[key in Divisions]: DivisionCoordinates} = {
  /** there is no 0 divisionId, this is just a placeholder */
  [Divisions.none]: {
    x: 0,
    y: 0,
  },
  [Divisions.PeopleAndCulture]: {
    x: -1,
    y: -1,
  },
  [Divisions.Marketing]: {
    x: -1,
    y: -0.8,
  },
  // Agency/agency
  [Divisions.Agency]: {
    x: -0.65,
    y: -1,
  },
  [Divisions.Partnership]: {
    x: 1,
    y: -0.85,
  },
  [Divisions.FinanceManagementTeam]: {
    x: 1,
    y: -0.1,
  },
  [Divisions.InformationAndTransformationOffice]: {
    x: 1,
    y: 0.8,
  },
  [Divisions.Risk]: {
    x: 1,
    y: 1,
  },
  [Divisions.LegalAndCompliance]: {
    x: 1,
    y: 1,
  },
  [Divisions.InternalAudit]: {
    x: 1,
    y: 1,
  },
  [Divisions.Operations]: {
    x: -1,
    y: 1,
  },
  [Divisions.OfficeOfTheCEO]: {
    x: -0.75,
    y: 1,
  },
};

export const getCoordinatesById = (id: Divisions) => {
  return divisionCoordinates[id];
};
