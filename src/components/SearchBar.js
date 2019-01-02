import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Input } from 'semantic-ui-react'

class SearchBar extends Component {
  state = {
    query: "",
    suggestions: []
  }

  renderSuggestions = () => {
    if (this.state.query.length >= 2) {
      return(
        <div className="search-suggestions">
          <div className="popup-text">
            {this.props.stockDictionary.map(stockObj => {
              if (stockObj.symbol.toLowerCase().includes(this.state.query) || stockObj.name.toLowerCase().includes(this.state.query)) {
                return (
                  <div className="search" key={stockObj.symbol} onClick={this.handleClick}>
                    {stockObj.symbol} - {stockObj.name}
                  </div>
                )
              } else {
                return null
              }
            })}
          </div>
        </div>
      )
    }
  }

  handleSearchChange = event => {
    this.setState({ query: event.target.value})
  }

  handleClick = event => {
    this.setState({ query: event.target.innerText})
  }

  handleSearchSubmit = event => {
    event.preventDefault()
    let stateCopy = Object.assign({}, this.state)
    this.setState({ query: "", suggestions: [] })
    this.props.history.push(`/stocks/${stateCopy.query.split(" ")[0]}`)
  }


  render() {
    return (
      !!this.props.user ?
        <div className="search-bar">
          <form onSubmit={this.handleSearchSubmit}>
            <Input
              icon="search"
              value={this.state.query}
              placeholder="Search by Ticker or Company Name"
              onChange={this.handleSearchChange}
              >
            </Input>
          </form>
          {this.renderSuggestions()}
        </div>
        :
        null
    )
  }
} /// End of SearchBar Class
export default withRouter(SearchBar)
