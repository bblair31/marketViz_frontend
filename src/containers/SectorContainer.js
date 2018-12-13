import React from 'react';
import SectorCard from '../components/SectorCard'

const renderSectorCards = (sectorInfo) => {
  return sectorInfo.map(sector => {
    return <SectorCard key={sector.name} sector={sector} />
  })
}


const MarketContainer = (props) => {
  return (
    <div className="sector-container">
      <h3>SECTORS</h3>
      {renderSectorCards(props.sectorInfo)}
    </div>
  )
} /// End of Dashboard Class
export default MarketContainer
