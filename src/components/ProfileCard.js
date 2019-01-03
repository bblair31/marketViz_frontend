import React from 'react'
import { Grid } from 'semantic-ui-react'

// const mapTags = (tags) => {
//   if (tags) {
//     return tags.map((tag, i) => <p key={i}>{tag}</p>)
//   }
// }

const ProfileCard = ({ companyInfo }) => {
  return (
    <div className="profile-card">
      <Grid.Row>
        <h3>Profile</h3>
        <p>{companyInfo.description}</p>
      </Grid.Row>
      <br></br>
      <Grid.Row>
        <Grid.Column>
          <p>Sector: {companyInfo.sector}</p>
        </Grid.Column>
        <Grid.Column>
          <p>Industry: {companyInfo.industry}</p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <p>Exchange: {companyInfo.exchange}</p>
        <a href={companyInfo.website} target="_blank" rel="noopener noreferrer">{companyInfo.website}</a>
      </Grid.Row>
      {/* {mapTags(companyInfo.tags)} */}
    </div>
  )
} /// End of ProfileCard
export default ProfileCard
