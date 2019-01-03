import React from 'react'
import { Grid } from 'semantic-ui-react'
import Moment from 'react-moment';

const NewsCard = ({ news }) => {
  return (
    <Grid.Row columns={2}>
      <Grid.Column width={6}>
        <h3><a href={news.url} target="_blank" rel="noopener noreferrer">{news.headline}</a></h3>
        <p>
          <Moment format="MM/DD/YYYY HH:mm">
            {news.datetime}
          </Moment>
        </p>

      </Grid.Column>
      <Grid.Column width={10}>
        <p>{news.summary}</p>
      </Grid.Column>
    </Grid.Row>
  )
}
export default NewsCard
