import React from 'react';
import NewsCard from '../components/NewsCard'

const renderNewsCards = (news) => {
  return news.map((newsObj, i) => {
    return <NewsCard key={i} news={newsObj} />
  })
}


const NewsContainer = ( { news }) => {
  return (
    <div className="news-container" style={{border: '5px solid green'}}>
      <h3>NEWS</h3>
      {renderNewsCards(news)}
    </div>
  )
} /// End of Dashboard Class
export default NewsContainer
