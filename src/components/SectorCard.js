import React from 'react';
import { Icon } from 'semantic-ui-react'

const iconDictionary = name => {
  switch (name) {
    case 'Financials':
      return "dollar sign"
    case 'Materials':
      return "cogs"
    case 'Communication Services':
      return "phone volume"
    case 'Consumer Staples':
      return "shop"
    case 'Consumer Discretionary':
      return "bar"
    case 'Energy':
      return "power cord"
    case 'Utilies':
      return "light bulb"
    case 'Technology':
      return "computer"
    case 'Real Estate':
      return "home"
    case 'Health Care':
      return "hospital"
    case 'Industrials':
      return "building"
    default:
      return "users"
  }
}

const SectorCard = ({ sector }) => {
  return (
    <div className="sector-card">
      <Icon circular inverted color='teal' size="huge" name={iconDictionary(sector.name)} />
      <h4>{sector.name}</h4>
      <h3 style={{color: (sector.performance >= 0 ? "green" : "red")}}>
        {(sector.performance * 100).toFixed(2)}%
      </h3>
    </div>
  )
}
export default SectorCard
