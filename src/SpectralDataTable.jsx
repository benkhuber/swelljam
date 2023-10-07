import React from 'react';

function SpectralDataTable({
  indSwellHeight, indSwellPeriod, indSwellDirection,
  windSwellHeight, windSwellPeriod, windSwellDirection,
}) {
  return (
    <div>
      <h3>Individual Swells</h3>
      <div className="gridContainer">
        <h4 className="gridItem">Height</h4>
        <h4 className="gridItem">Period</h4>
        <h4 className="gridItem">Direction</h4>
        <h3 className="gridItem">{indSwellHeight}</h3>
        <h3 className="gridItem">{indSwellPeriod}</h3>
        <h3 className="gridItem">{indSwellDirection}</h3>
        <h3 className="gridItem">{windSwellHeight}</h3>
        <h3 className="gridItem">{windSwellPeriod}</h3>
        <h3 className="gridItem">{windSwellDirection}</h3>
      </div>
    </div>
  );
}

export default SpectralDataTable;
