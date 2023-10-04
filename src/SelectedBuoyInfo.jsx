import React from 'react'

const SelectedBuoyInfo = ({ stationName, stationLat, stationLon }) => {
  return (
    <div>      
        <h2>{stationName}</h2>
        <h4>{stationLat}, {stationLon}</h4>
    </div>
  )
}

export default SelectedBuoyInfo