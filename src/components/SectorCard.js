import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'


class SectorCard extends Component {
  state = {
    flash: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.sectorPerformance !== prevProps.sectorPerformance) {
      this.setState({flash: true})
    } else if (this.props.sectorPerformance === prevProps.sectorPerformance && !!prevState.flash) {
      this.setState({flash: false})
    }
  }

  iconDictionary = name => {
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

  checkStatus = () => this.state.flash ? "lightgreen" : ""


  render() {
    return (
      <div className="sector-card">
        <Icon circular inverted color='teal' size="huge" name={this.iconDictionary(this.props.sector.name)} />
        <h4>{this.props.sector.name}</h4>
        <h3 style={{color: (this.props.sector.performance >= 0 ? "green" : "red"), backgroundColor: this.checkStatus()}}>
          {(this.props.sector.performance * 100).toFixed(2)}%
        </h3>
      </div>
    )
  }
} // End of SectorCard
export default SectorCard
