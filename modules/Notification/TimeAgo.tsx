import React, { useState, useEffect } from 'react';
import { formatDistanceToNowStrict, format, isValid } from 'date-fns';
import _isInteger from 'lodash/isInteger'
import _isNAN from 'lodash/isNaN';

const DEFAULT_REFRESH_TIME = 60; // seconds

interface TimeAgoProps {
    date: Date,
    formatTooltip?: string,
    refreshTime?: number,
    config?: object,
}

const TimeAgo: React.FC<TimeAgoProps> = (props): JSX.Element => {
  const {
    date, // string | timestamp | new Date()
    formatTooltip = 'EEEE, dd-MM-yyyy HH:mm', // Chủ Nhật, 22-11-2020 16:30
    refreshTime, // Time to refresh (seconds). Default: DEFAULT_REFRESH_TIME
    config = {}, // formatDistanceToNowStrict's options (https://date-fns.org/v2.16.1/docs/formatDistanceToNowStrict)
  } = props;

  const [time, setTime] = useState(0);

  const secondsToRefresh =
    _isInteger(refreshTime) && refreshTime > 0
      ? refreshTime
      : DEFAULT_REFRESH_TIME;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1);
    }, secondsToRefresh * 1000);
    return () => clearInterval(interval);
  });

  const formatConfig = {
    addSuffix: true,
    ...config,
  };

  const dateObj = isValid(date) ? date : new Date(date);
  if (_isNAN(dateObj.getTime())) return null;

  const tooltip = format(
    dateObj,
    formatTooltip,
  );
  const content = formatDistanceToNowStrict(
    dateObj,
    formatConfig,
  );

  return <span title={tooltip}>{content}</span>
}
export default TimeAgo;