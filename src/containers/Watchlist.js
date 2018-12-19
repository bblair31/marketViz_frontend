import React, { Component } from 'react';

class Watchlist extends Component {

  mapWatchlist = () => {
    return this.props.watchlistQuotes.map(stock => {
      return <p>{stock.name}</p>
    })
  }

  render() {
    return (
      <div className="watchlist">
        {this.mapWatchlist()}
      </div>
    )
  }
} /// End of Watchlist Class
export default Watchlist
