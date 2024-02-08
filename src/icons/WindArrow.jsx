import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function WindArrow({ windDirection }) {
  const rotation = `rotate(${360 - windDirection}deg)`;

  return (
    <div style={{ transform: rotation, transformOrigin: 'center center' }}>
      <FontAwesomeIcon icon={faArrowUp} />
    </div>
  );
}

export default WindArrow;
