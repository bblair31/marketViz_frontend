import React from 'react'
import { Divider, Grid, Card, Segment } from 'semantic-ui-react'

import StockCard from '../components/StockCard'

const renderGLList = (stocks, handleStarClick) => {
  if (!!stocks) {
    return stocks.map(stock => {
      return (
        <Card key={stock.symbol} style={stock.change >= 0 ? {background: "#cbffc9"} : {background: "#ffced3"}}>
          <StockCard
            key={stock.symbol}
            stock={stock}
            handleStarClick={handleStarClick}
          />
        </Card>
      )
    })
  }
}


const GainerLoserContainer = ({ gainers, losers, handleStarClick }) => {
  return (
    <div className="container">
      <h2>TODAY'S MOVERS</h2>
      <Segment placeholder style={{backgroundColor: "#424549"}}>
        <Grid columns={2}>
          <Grid.Column>
              <div className="gainers">
                <h2 style={{backgroundColor: "grey", color: "white"}}>Gainers:</h2>
                <Card.Group itemsPerRow={3}>
                {renderGLList(gainers, handleStarClick)}
                </Card.Group>
            </div>
          </Grid.Column>
          <Divider vertical></Divider>
          <Grid.Column>
          <div className="losers">
            <h2 style={{backgroundColor: "grey", color: "white"}}>Losers:</h2>
            <Card.Group itemsPerRow={3}>
               {renderGLList(losers, handleStarClick)}
             </Card.Group>
           </div>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  )
} /// End of GainerLoserContainer
export default GainerLoserContainer
