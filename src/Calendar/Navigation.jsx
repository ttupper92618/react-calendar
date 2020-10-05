import {
  formatMonthYear as defaultFormatMonthYear,
  formatYear as defaultFormatYear,
} from '../shared/dateFormatter';
import {
  getBeginNext,
  getBeginNext2,
  getBeginPrevious,
  getBeginPrevious2,
  getCenturyLabel,
  getDecadeLabel,
  getEndPrevious,
  getEndPrevious2,
} from '../shared/dates';
import { isView, isViews } from '../shared/propTypes';

import PropTypes from 'prop-types';
import React from 'react';
import { getUserLocale } from 'get-user-locale';

const className = 'react-calendar__navigation';

export default function Navigation({
  activeStartDate,
  drillUp,
  formatMonthYear = defaultFormatMonthYear,
  formatYear = defaultFormatYear,
  locale,
  maxDate,
  minDate,
  navigationAriaLabel = '',
  navigationLabel,
  next2AriaLabel = '',
  next2Label = '»',
  nextAriaLabel = '',
  nextLabel = '›',
  prev2AriaLabel = '',
  prev2Label = '«',
  prevAriaLabel = '',
  prevLabel = '‹',
  setActiveStartDate,
  showDoubleView,
  view,
  views,
}) {
  const drillUpAvailable = views.indexOf(view) > 0;
  const shouldShowPrevNext2Buttons = view !== 'century';

  const previousActiveStartDate = getBeginPrevious(view, activeStartDate);
  const previousActiveStartDate2 = (
    shouldShowPrevNext2Buttons
    && getBeginPrevious2(view, activeStartDate)
  );
  const nextActiveStartDate = getBeginNext(view, activeStartDate);
  const nextActiveStartDate2 = shouldShowPrevNext2Buttons && getBeginNext2(view, activeStartDate);

  const prevButtonDisabled = (() => {
    if (previousActiveStartDate.getFullYear() < 1000) {
      return true;
    }
    const previousActiveEndDate = getEndPrevious(view, activeStartDate);
    return minDate && minDate >= previousActiveEndDate;
  })();

  const prev2ButtonDisabled = shouldShowPrevNext2Buttons && (() => {
    if (previousActiveStartDate2.getFullYear() < 1000) {
      return true;
    }
    const previousActiveEndDate = getEndPrevious2(view, activeStartDate);
    return minDate && minDate >= previousActiveEndDate;
  })();

  const nextButtonDisabled = maxDate && maxDate <= nextActiveStartDate;

  const next2ButtonDisabled = (
    shouldShowPrevNext2Buttons
    && maxDate
    && maxDate <= nextActiveStartDate2
  );

  function onClickPrevious() {
    setActiveStartDate(previousActiveStartDate);
  }

  function onClickPrevious2() {
    setActiveStartDate(previousActiveStartDate2);
  }

  function onClickNext() {
    setActiveStartDate(nextActiveStartDate);
  }

  function onClickNext2() {
    setActiveStartDate(nextActiveStartDate2);
  }

  function renderLabel(date) {
    const label = (() => {
      switch (view) {
        case 'century':
          return getCenturyLabel(locale, formatYear, date);
        case 'decade':
          return getDecadeLabel(locale, formatYear, date);
        case 'year':
          return formatYear(locale, date);
        case 'month':
          return formatMonthYear(locale, date);
        default:
          throw new Error(`Invalid view: ${view}.`);
      }
    })();

    return (
      navigationLabel
        ? navigationLabel({
          date,
          label,
          locale: locale || getUserLocale(),
          view,
        })
        : label
    );
  }

  function renderButton() {
    const labelClassName = `${className}__label`;
    return (
      <button
        aria-label={navigationAriaLabel}
        className={labelClassName}
        data-testid='calendar-yearmonth'
        disabled={!drillUpAvailable}
        onClick={drillUp}
        style={{ flexGrow: 1 }}
        type="button"
      >
        <span className={`${labelClassName}__labelText ${labelClassName}__labelText--from`}>
          {renderLabel(activeStartDate)}
        </span>
        {showDoubleView && (
          <>
            <span className={`${labelClassName}__divider`}>
              {' '}
              to
              {' '}
            </span>
            <span className={`${labelClassName}__labelText ${labelClassName}__labelText--to`}>
              {renderLabel(nextActiveStartDate)}
            </span>
          </>
        )}
      </button>
    );
  }

  return (
    <>
      <div
        className={className}
        style={{ display: 'flex' }}
      >
        {prev2Label !== null && shouldShowPrevNext2Buttons && (
          <button
            aria-label={prev2AriaLabel}
            className={`${className}__arrow ${className}__prev2-button`}
            disabled={prev2ButtonDisabled}
            onClick={onClickPrevious2}
            type="button"
          >
            {prev2Label}
          </button>
        )}
        {prevLabel !== null && (
          <button
            aria-label={prevAriaLabel}
            className={`${className}__arrow ${className}__prev-button`}
            disabled={prevButtonDisabled}
            onClick={onClickPrevious}
            type="button"
          >
            <svg
              width='16px'
              height='16px'
              pointerEvents='none'
              color='#645AF0'
              viewBox='0 0 16 16'
            >
              <path
                fillRule='nonzero'
                fill='#645AF0'
                d='M10.53.28a.665.665 0 011.01.858l-.07.082L4.69 8l6.78 6.78a.665.665 0 01.07.858l-.07.082a.665.665 0 01-.858.07l-.082-.07-6.908-6.908a1.148 1.148 0 01-.087-1.527l.086-.097L10.53.28z'
              />
            </svg>
          </button>
        )}
        {renderButton()}
        {nextLabel !== null && (
          <button
            aria-label={nextAriaLabel}
            className={`${className}__arrow ${className}__next-button`}
            disabled={nextButtonDisabled}
            onClick={onClickNext}
            type="button"
          >
            <svg
              width='16px'
              height='16px'
              pointerEvents='none'
              color='#645AF0'
              viewBox='0 0 16 16'
            >
              <path
                fillRule='nonzero'
                fill='#645AF0'
                d='M3.48.28a.665.665 0 01.858-.07l.082.07 6.908 6.908a1.148 1.148 0 01.087 1.527l-.086.097L4.42 15.72a.665.665 0 01-1.01-.858l.07-.082 6.779-6.781-6.78-6.779a.665.665 0 01-.07-.858L3.48.28z'
              />
            </svg>
          </button>
        )}
        {next2Label !== null && shouldShowPrevNext2Buttons && (
          <button
            aria-label={next2AriaLabel}
            className={`${className}__arrow ${className}__next2-button`}
            disabled={next2ButtonDisabled}
            onClick={onClickNext2}
            type="button"
          >
            {next2Label}
          </button>
        )}
      </div>
      <div style={{'width':'100%', 'height':'2px', 'transform':'translateY(-10px)', 'display':'flex', 'justifyContent':'center'}}>
        <div style={{'width':'32px', 'height':'2px', 'borderTop': '1px solid #0F0F32'}}></div>
      </div>
    </>
  );
}

Navigation.propTypes = {
  activeStartDate: PropTypes.instanceOf(Date).isRequired,
  drillUp: PropTypes.func.isRequired,
  formatMonthYear: PropTypes.func,
  formatYear: PropTypes.func,
  locale: PropTypes.string,
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  navigationAriaLabel: PropTypes.string,
  navigationLabel: PropTypes.func,
  next2AriaLabel: PropTypes.string,
  next2Label: PropTypes.node,
  nextAriaLabel: PropTypes.string,
  nextLabel: PropTypes.node,
  prev2AriaLabel: PropTypes.string,
  prev2Label: PropTypes.node,
  prevAriaLabel: PropTypes.string,
  prevLabel: PropTypes.node,
  setActiveStartDate: PropTypes.func.isRequired,
  showDoubleView: PropTypes.bool,
  view: isView.isRequired,
  views: isViews.isRequired,
};
