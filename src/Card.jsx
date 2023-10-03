import React from 'react';

function Card({ value, description }) {
  return (
    <div className="card">
      <h3>{description}</h3>
      <p>{value}</p>
    </div>
  );
}

export default Card;
