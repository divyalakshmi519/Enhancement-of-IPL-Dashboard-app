import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'
import './index.css'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamBannerUrl: '',
    latestMatch: {},
    recentMatches: [],
  }

  componentDidMount() {
    this.getTeamData()
  }

  getTeamData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
    const data = await response.json()

    const latestMatch = this.camelCaseMatch(data.latest_match_details)
    const recentMatches = data.recent_matches.map(this.camelCaseMatch)

    this.setState({
      teamBannerUrl: data.team_banner_url,
      latestMatch,
      recentMatches,
      isLoading: false,
    })
  }

  camelCaseMatch = match => ({
    umpires: match.umpires,
    result: match.result,
    manOfTheMatch: match.man_of_the_match,
    id: match.id,
    date: match.date,
    venue: match.venue,
    competingTeam: match.competing_team,
    competingTeamLogo: match.competing_team_logo,
    firstInnings: match.first_innings,
    secondInnings: match.second_innings,
    matchStatus: match.match_status,
  })

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderTeamMatches = () => {
    const {teamBannerUrl, latestMatch, recentMatches} = this.state

    return (
      <>
        <img src={teamBannerUrl} alt="team banner" className="team-banner" />
        <LatestMatch matchDetails={latestMatch} />
        <ul className="recent-matches">
          {recentMatches.map(match => (
            <MatchCard key={match.id} matchDetails={match} />
          ))}
        </ul>
      </>
    )
  }

  render() {
    const {isLoading} = this.state

    return (
      <div className="team-matches-container">
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
