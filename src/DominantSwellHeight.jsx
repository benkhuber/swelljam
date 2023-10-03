import React from 'react';

function DominantSwellHeight({ dominantSwellHeight }) {
  const swellHeightConvertedToFeet = (dominantSwellHeight * 3.28084).toFixed(1);

  return (
    <div>{ swellHeightConvertedToFeet } ft</div>
  );
}

export default DominantSwellHeight;
