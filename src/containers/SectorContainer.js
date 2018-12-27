import React from 'react';
import SectorCard from '../components/SectorCard'

const renderSectorCards = (sectorInfo) => {
  return sectorInfo.map(sector => {
    return <SectorCard key={sector.name} sector={sector} />
  })
}


const SectorContainer = (props) => {
  return (
    <div className="sector-container" style={{border: '5px solid green'}}>
      <h3>SECTORS</h3>
      {renderSectorCards(props.sectorInfo)}
    </div>
  )
} /// End of SectorContainer
export default SectorContainer
