import {getDate, getHours, getMinutes, getMonth, getYear} from 'date-fns';

export class DateUtil {
  static asUTCDate = (date: Date): Date => {
    return new Date(Date.UTC(getYear(date), getMonth(date), getDate(date)));
  };

  static asUTCDateTime = (date: Date): Date => {
    return new Date(
      Date.UTC(
        getYear(date),
        getMonth(date),
        getDate(date),
        getHours(date),
        getMinutes(date),
      ),
    );
  };

  static getSchedulePeriod = (
    date: Date,
  ): {
    month: number;
    year: number;
  } => {
    return {
      month: getMonth(date) + 1,
      year: getYear(date),
    };
  };
}
