import React from 'react';

const headers = ['Shares Outstanding', 'Float', 'Beta', 'Dividend Rate', 'Dividend Yield', 'ex-Dividend Date', 'Revenue', 'Gross Profit', 'EBITDA', 'ROE', 'ROA', 'ROC', 'Cash', 'Debt', 'Revenue/Share',
'Revenue/Employee', 'P/E Ratio High', 'P/E Ratio Low', 'Profit Margin', 'Price to Sales', 'Price To Book', '200 Day Moving Avg', '50 Day Moving Avg', 'Institutional %', 'Insider %', 'Short Ratio' ]

const mapHeaders = () => {
  return headers.map((header, i) => <th key={i}>{header}</th>)
}

const mapRows = (keyStats) => {
  return (
    <tr>
      <td>{keyStats.sharesOutstanding}</td>
      <td>{keyStats.float}</td>
      <td>{keyStats.beta}</td>
      <td>{keyStats.dividendRate}</td>
      <td>{keyStats.dividendYield}</td>
      <td>{keyStats.exDividendDate}</td>
      <td>{keyStats.revenue}</td>
      <td>{keyStats.grossProfit}</td>
      <td>{keyStats.EBITDA}</td>
      <td>{keyStats.returnOnEquity}</td>
      <td>{keyStats.returnOnAssets}</td>
      <td>{keyStats.returnOnCapital}</td>
      <td>{keyStats.cash}</td>
      <td>{keyStats.debt}</td>
      <td>{keyStats.revenuePerShare}</td>
      <td>{keyStats.revenuePerEmployee}</td>
      <td>{keyStats.peRatioHigh}</td>
      <td>{keyStats.peRatioLow}</td>
      <td>{keyStats.profitMargin}</td>
      <td>{keyStats.priceToSales}</td>
      <td>{keyStats.priceToBook}</td>
      <td>{keyStats.day200MovingAvg}</td>
      <td>{keyStats.day50MovingAvg}</td>
      <td>{keyStats.institutionPercent}</td>
      <td>{keyStats.insiderPercent}</td>
      <td>{keyStats.shortRatio}</td>
    </tr>
  )
}

const KeyStats = ({ keyStats }) => {
  return (
    <div className="key-stats" style={{display: "inline-block"}}>
      <h3>{keyStats.companyName} Key Stats</h3>
      <table>
        <tbody>
          <tr>
            {mapHeaders()}
          </tr>
          {mapRows(keyStats)}
        </tbody>
      </table>
    </div>
  )
}
export default KeyStats
