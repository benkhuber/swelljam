import React from 'react';

function SelectedBuoyInfo({
  stationName, stationLat, stationLon, localDate,
}) {
  const timeDifferenceMilliseconds = new Date() - localDate;
  const timeDifferenceMinutes = (timeDifferenceMilliseconds / 60000).toFixed();
  let timeDifferenceOutput = 0;
  if (timeDifferenceMinutes >= 90) {
    timeDifferenceOutput = `${(timeDifferenceMinutes / 60).toFixed(0)} hours ago`;
  } else if (timeDifferenceMinutes >= 60 && timeDifferenceMinutes < 90) {
    timeDifferenceOutput = `${(timeDifferenceMinutes / 60).toFixed(0)} hour ago`;
  } else {
    timeDifferenceOutput = `${timeDifferenceMinutes} minutes ago`;
  }

  return (
    <div>
      <h4>{stationName}</h4>
      <h4>{stationLat}, {stationLon}</h4>
      <h5>Last Swell Reading: {timeDifferenceOutput}</h5>
    </div>
  );
}

export default SelectedBuoyInfo;
