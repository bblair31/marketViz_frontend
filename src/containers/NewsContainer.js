import React from 'react'
import { Grid } from 'semantic-ui-react'
import NewsCard from '../components/NewsCard'

const renderNewsCards = (news) => {
  return news.map((newsObj, i) => {
    return <NewsCard key={i} news={newsObj} />
  })
}


const NewsContainer = ( { news }) => {
  return (
    <div className="container">
      <h2>NEWS</h2>
      <Grid divided padded centered className="news-container">
        {renderNewsCards(news)}
      </Grid>
    </div>
  )
} /// End of NewsContainer
export default NewsContainer
