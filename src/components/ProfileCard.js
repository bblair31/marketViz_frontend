import React from 'react';

const mapTags = (tags) => {
  if (tags) {
    return tags.map((tag, i) => <p key={i}>{tag}</p>)
  }
}

const ProfileCard = ({ companyInfo }) => {
  return (
    <div className="profile-card" style={{display: "inline-block"}}>
      <h4>Profile</h4>
      <p>{companyInfo.description}</p>
      <p>{companyInfo.exchange}</p>
      <p>{companyInfo.sector}</p>
      <p>{companyInfo.industry}</p>
      <a href={companyInfo.website} target="_blank" rel="noopener noreferrer">{companyInfo.website}</a>
      {mapTags(companyInfo.tags)}
    </div>
  )
} /// End of ProfileCard
export default ProfileCard
