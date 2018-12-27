import React from 'react';

const SectorCard = ({ sector }) => {
  return (
    <div className="sector-card" style={{display: "inline-block"}}>
      <p>{sector.name}</p>
      <p>{(sector.performance * 100).toFixed(2)}%</p>
    </div>
  )
}
export default SectorCard
