import React from 'react';

const NewsCard = ({ news }) => {
  return (
    <div className="news-card" style={{display: "inline-block"}}>
      <b>{news.headline}</b>
      <p>{news.datetime}</p>
      <p>{news.source}</p>
      <p>{news.related}</p>
      <a href={news.url} target="_blank" rel="noopener noreferrer"> Link </a>
      <br></br>
    </div>
  )
} /// End of Dashboard Class
export default NewsCard
