import { Moment } from 'moment';

const getAbsoluteMonths = (momentDate: Moment): number => {
  const months = Number(momentDate.format('MM'));
  const years = Number(momentDate.format('YYYY'));
  return months + years * 12;
};

export const monthDifference = (startDate: Moment, endDate: Moment): number =>
  getAbsoluteMonths(endDate) - getAbsoluteMonths(startDate);

export const currencyFormat = (num: number) => {
  return 'KES ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
