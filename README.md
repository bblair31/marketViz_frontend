
# MarketViz 📊📈

Financial research application to visualize real-time stock market and cryptocurrency data. Users can do in-depth research on all stocks listed on US Stock Exchanges and on cryptocurrencies. They can create portfolios and visualize diversification as well as basic performance metrics.

* [Working Demo](https://market-viz.herokuapp.com)

* [Demo Video](https://www.dropbox.com/s/tjf8mflvrdpd7qj/MarketViz%20Demo%20Video.mov?dl=0)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

**You will need to fork and locally clone the Ruby on Rails backend from this repository:** [MarketViz Backend](https://github.com/bblair31/marketViz_backend)

After following the README in the Backend Repo above, make sure to run `rails s` first so that Rails is running on localhost:3000


### Installing

1. Fork and clone this repository

2. Install all required packages from Node Package Manager
 
```
npm install
```

3. Change the `BASE_URL` in /marketviz-frontend/src/apis/Adapter.js from `const BASE_URL = "https://market-viz-backend.herokuapp.com/api/v1/"` to:

```
localhost:3000/api/v1
```


4. Start up the development server 

```
npm start
```

5. React should alert you to the fact that the Rails server is already running on default port `localhost:3000`. It will ask if you want to use a different port. Respond with `Y`

React should automatically open the application in your default browser and begin to load. If it does not, you will see the Local web address in terminal at which you can access the application via your browser.


## Built With

* [React.js](https://reactjs.org/docs/getting-started.html) - The Javascript framework used
* [Semantic UI](https://semantic-ui.com/) - Integration for user interface and styling components
* [Create React App](https://github.com/facebook/create-react-app) - Bootstrap base application
* [Twilio API](https://www.twilio.com/docs/sms) - External API for sending SMS messages on behalf of users
* [data-fns](https://date-fns.org/docs/Getting-Started) - Modern JavaScript date utility library

## Contributors

* [Shelby Scalia](https://github.com/srscalia)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* https://blog.flowandform.agency/create-a-custom-calendar-in-react-3df1bfd0b728

