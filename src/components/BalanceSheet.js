import React from 'react'
import { Table } from 'semantic-ui-react'

const headers = ['Date', 'Net Income', 'Gross Profit', 'Operating Revenue', 'Operating Expenses', 'Operating Income', 'Assets', 'Cash', 'Debt', 'Liabilities', 'Revenue', 'Current Cash', 'Cash Change', 'Cash Flow', 'Cost of Revenue', 'R&D', 'Shareholder Equity'  ]

const mapHeaders = () => {
  return headers.map((header, i) => <th key={i}>{header}</th>)
}

const mapCells = (quarterStats) => {
  return (
    <tr key={quarterStats.reportDate}>
      <td>{quarterStats.reportDate}</td>
      <td>{quarterStats.netIncome}</td>
      <td>{quarterStats.grossProfit}</td>
      <td>{quarterStats.operatingRevenue}</td>
      <td>{quarterStats.operatingExpense}</td>
      <td>{quarterStats.operatingIncome}</td>
      <td>{quarterStats.totalAssets}</td>
      <td>{quarterStats.totalCash}</td>
      <td>{quarterStats.totalDebt}</td>
      <td>{quarterStats.totalLiabilities}</td>
      <td>{quarterStats.totalRevenue}</td>
      <td>{quarterStats.currentCash}</td>
      <td>{quarterStats.cashChange}</td>
      <td>{quarterStats.cashFlow}</td>
      <td>{quarterStats.costOfRevenue}</td>
      <td>{quarterStats.researchAndDevelopment}</td>
      <td>{quarterStats.shareholderEquity}</td>
    </tr>
  )
}

const mapRows = (financials) => {
  if (financials) {
    return financials.map(quarterStats => mapCells(quarterStats))
  }
}


const BalanceSheet = ({ balanceSheet }) => {
  return (
    <div className="balance-sheet" style={{display: "inline-block"}}>
      <h2>{balanceSheet.symbol} Balance Sheet</h2>
      <Table celled inverted selectable textAlign="center">
        <tbody>
          <tr>
            {mapHeaders()}
          </tr>
          {mapRows(balanceSheet.financials)}
        </tbody>
      </Table>
    </div>
  )
}
export default BalanceSheet
