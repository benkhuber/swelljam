import React from 'react';

function Card({ value, description }) {
  return (
    <div className="card">
      <h2>{description}</h2>
      <p>{value}</p>
    </div>
  );
}

export default Card;
