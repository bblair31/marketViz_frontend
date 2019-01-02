import React from 'react'
import { Grid } from 'semantic-ui-react'
import SectorCard from '../components/SectorCard'

const renderSectorCards = (sectorInfo) => {
  return sectorInfo.map(sector => {
    return <SectorCard key={sector.name} sector={sector} />
  })
}


const SectorContainer = (props) => {
  return (
    <div className="container">
      <h2 style={{textAlign: "left"}}>Sectors</h2><br></br>
      <Grid divided padded centered>
        {renderSectorCards(props.sectorInfo)}
    </Grid>
    </div>
  )
} /// End of SectorContainer
export default SectorContainer
