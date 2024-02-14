import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function WindArrow({ windDirection }) {
  const rotation = `rotate(${(windDirection + 180) % 360}deg)`;

  return (
    <div style={{ transform: rotation, transformOrigin: 'center center' }}>
      <FontAwesomeIcon icon={faArrowUp} />
    </div>
  );
}

export default WindArrow;
