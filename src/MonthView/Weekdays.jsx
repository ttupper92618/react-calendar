import { formatShortWeekday as defaultFormatShortWeekday, formatWeekday } from '../shared/dateFormatter';
import {
  getMonth,
  getMonthStart,
  getYear,
} from '@wojtekmaj/date-utils';

import Flex from '../Flex';
import PropTypes from 'prop-types';
import React from 'react';
import { getDayOfWeek } from '../shared/dates';
import { isCalendarType } from '../shared/propTypes';

const className = 'react-calendar__month-view__weekdays';

export default function Weekdays(props) {
  const {
    calendarType,
    formatShortWeekday = defaultFormatShortWeekday,
    locale,
    onMouseLeave,
  } = props;

  const anyDate = new Date();
  const beginOfMonth = getMonthStart(anyDate);
  const year = getYear(beginOfMonth);
  const monthIndex = getMonth(beginOfMonth);

  const weekdays = [];

  for (let weekday = 1; weekday <= 7; weekday += 1) {
    const weekdayDate = new Date(
      year, monthIndex, weekday - getDayOfWeek(beginOfMonth, calendarType),
    );

    const abbr = formatWeekday(locale, weekdayDate);

    weekdays.push(
      <div
        data-testid='calendar-weekday'
        key={weekday}
        className={`${className}__weekday`}
      >
        <abbr aria-label={abbr} title={abbr}>
          {formatShortWeekday(locale, weekdayDate).replace('.', '')}
        </abbr>
      </div>,
    );
  }

  return (
    <Flex
      className={className}
      count={7}
      onFocus={onMouseLeave}
      onMouseOver={onMouseLeave}
    >
      {weekdays}
    </Flex>
  );
}

Weekdays.propTypes = {
  calendarType: isCalendarType.isRequired,
  formatShortWeekday: PropTypes.func,
  locale: PropTypes.string,
  onMouseLeave: PropTypes.func,
};
