import React, { Component } from 'react';

import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';
import { tileProps } from './shared/propTypes';

function getValue(nextProps, prop) {
  const { activeStartDate, date, view } = nextProps;

  return typeof prop === 'function'
    ? prop({ activeStartDate, date, view })
    : prop;
}

export default class Tile extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { dayMarker, tileClassName, tileContent } = nextProps;

    const nextState = {};

    if (dayMarker !== prevState.dayMarkerProps) {
      nextState.dayMarker = getValue(nextProps, dayMarker);
      nextState.dayMarkerProps = dayMarker;
    }

    if (tileClassName !== prevState.tileClassNameProps) {
      nextState.tileClassName = getValue(nextProps, tileClassName);
      nextState.tileClassNameProps = tileClassName;
    }

    if (tileContent !== prevState.tileContentProps) {
      nextState.tileContent = getValue(nextProps, tileContent);
      nextState.tileContentProps = tileContent;
    }

    return nextState;
  }

  state = {};

  render() {
    const {
      activeStartDate,
      children,
      classes,
      date,
      formatAbbr,
      locale,
      maxDate,
      maxDateTransform,
      minDate,
      minDateTransform,
      onClick,
      onMouseOver,
      style,
      tileDisabled,
      view,
    } = this.props;
    const { dayMarker, tileClassName, tileContent } = this.state;

    if (tileContent || dayMarker) {
      return (
        <button
          className={mergeClassNames(classes, tileClassName)}
          data-weekday={date.toLocaleDateString()}
          disabled={
            (minDate && minDateTransform(minDate) > date)
            || (maxDate && maxDateTransform(maxDate) < date)
            || (tileDisabled && tileDisabled({ activeStartDate, date, view }))
          }
          onClick={onClick && (event => onClick(date, event))}
          onFocus={onMouseOver && (() => onMouseOver(date))}
          onMouseOver={onMouseOver && (() => onMouseOver(date))}
          role='calendar-day'
          style={style}
          type="button"
        >
          {dayMarker}
          <div data-role='currentDayNumber' data-eventday={!!tileContent} data-currentday={new Date(date).toDateString() === new Date().toDateString()}>
            {formatAbbr
              ? (
                <abbr aria-label={formatAbbr(locale, date)}>
                  {children}
                </abbr>
              )
              : children}
          </div>
          {tileContent}
        </button>);
    } else {
      return (
        <button
          className={mergeClassNames(classes, tileClassName)}
          data-weekday={date.toLocaleDateString()}
          disabled={
            (minDate && minDateTransform(minDate) > date)
            || (maxDate && maxDateTransform(maxDate) < date)
            || (tileDisabled && tileDisabled({ activeStartDate, date, view }))
          }
          onClick={onClick && (event => onClick(date, event))}
          onFocus={onMouseOver && (() => onMouseOver(date))}
          onMouseOver={onMouseOver && (() => onMouseOver(date))}
          role='calendar-day'
          style={style}
          type="button"
        >
          {tileContent}
          {formatAbbr
            ? (
              <abbr aria-label={formatAbbr(locale, date)}>
                {children}
              </abbr>
            )
            : children}
        </button>
      );
    }
  }
}

Tile.propTypes = {
  ...tileProps,
  children: PropTypes.node.isRequired,
  formatAbbr: PropTypes.func,
  maxDateTransform: PropTypes.func.isRequired,
  minDateTransform: PropTypes.func.isRequired,
};
