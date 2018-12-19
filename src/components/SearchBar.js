import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

class SearchBar extends Component {
  state = {
    query: "",
    suggestions: []
  }



  renderSuggestions = () => {
    if (this.state.query.length >= 3) {
      return this.props.stockDictionary.map(stockObj => {
        if (stockObj.symbol.toLowerCase().includes(this.state.query) || stockObj.name.toLowerCase().includes(this.state.query)) {
          return <div key={stockObj.symbol} onClick={this.handleClick}>
            {stockObj.symbol} - {stockObj.name}
          </div>
        } else {
          return null
        }
      })
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
      <div className="search-bar" style={{display: "inline-block"}}>
        <form onSubmit={this.handleSearchSubmit}>
          <input
            value={this.state.query}
            placeholder="Search by Ticker or Company Name"
            onChange={this.handleSearchChange}
            >
          </input>
        </form>
        {this.renderSuggestions()}
      </div>
    )
  }
} /// End of SearchBar Class
export default withRouter(SearchBar)
