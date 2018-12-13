import React from 'react';

const SectorCard = ({ sector }) => {
  return (
    <div className="sector-card" style={{display: "inline-block"}}>
      <p>{sector.name}</p>
      <p>{sector.performance}</p>
    </div>
  )
} /// End of Dashboard Class
export default SectorCard
