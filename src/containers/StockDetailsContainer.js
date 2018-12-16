import React from 'react';
import ProfileCard from '../components/ProfileCard'
import StatsCard from '../components/StatsCard'



const StockDetailsContainer = ({ companyInfo, stock }) => {
  return (
    <div className="stock-details-container" style={{border: '5px solid green'}}>
      <h3>DETAILS</h3>
      <ProfileCard companyInfo={companyInfo} />
      <StatsCard stock={stock} />

    </div>
  )
} /// End of StockDetailsContainer
export default StockDetailsContainer
