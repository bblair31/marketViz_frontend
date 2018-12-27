import React from 'react';

const NewsCard = ({ news }) => {
  return (
    <div className="news-card" style={{display: "inline-block"}}>
      <b>{news.headline}</b>
      <p>{news.datetime}</p>
      <a href={news.url} target="_blank" rel="noopener noreferrer"> Link </a>
      <br></br>
    </div>
  )
}
export default NewsCard
