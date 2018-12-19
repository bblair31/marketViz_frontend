import React from 'react';

const IpoCard = ({ ipoObj }) => {
  return (
    <div className="ipo-card" style={{display: "inline-block"}}>
      <b>{ipoObj.Company}</b>
      <p>Price: {ipoObj.Price}</p>
      <p>Shares: {ipoObj.Shares}</p>
      <p>Percent: {ipoObj.Percent}</p>
    </div>
  )
}
export default IpoCard
