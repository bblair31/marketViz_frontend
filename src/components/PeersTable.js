import React from 'react';

const headers = ['Symbol', 'Name', 'Sector', 'Market Cap', 'Avg Volume', 'Latest Volume', 'Change', '% Change', 'Price', 'P/E Ratio', 'Previous Close', '52 Week Low', '52 Week High', 'YTD Change' ]

const mapHeaders = () => {
  return headers.map((header, i) => <th key={i}>{header}</th>)
}

const mapRows = (peers) => {
  if (!!peers) {
    return peers.map(peer => {
      return (
        <tr key={peer.symbol}>
          <td>{peer.symbol}</td>
          <td>{peer.companyName}</td>
          <td>{peer.sector}</td>
          <td>{peer.marketCap}</td>
          <td>{peer.avgTotalVolume}</td>
          <td>{peer.latestVolume}</td>
          <td>{peer.change}</td>
          <td>{peer.changePercent}</td>
          <td>{peer.latestPrice}</td>
          <td>{peer.peRatio}</td>
          <td>{peer.previousClose}</td>
          <td>{peer.week52Low}</td>
          <td>{peer.week52High}</td>
          <td>{peer.ytdChange}</td>
        </tr>
      )
    })
  } else {
    return null
  }
}

const PeersTable = ({ peers }) => {
  return (
    <div className="peers-table" style={{display: "inline-block"}}>
      <h3>PEERS</h3>
      <table>
        <tbody>
          <tr>
            {mapHeaders()}
          </tr>

          {mapRows(peers)}
        </tbody>
      </table>
    </div>
  )
}
export default PeersTable
