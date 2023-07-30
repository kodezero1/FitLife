import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
// Interfaces
import { Team } from '../../types'

import Crown from '../svg/Crown'
import TrainerBadge from '../svg/TrainerBadge'
import MemberBadge from '../svg/MemberBadge'

interface Props {
  profileTeamsJoined: Team[]
  profile_id: string
}

const TeamsTile: React.FC<Props> = ({ profileTeamsJoined, profile_id }) => {
  const getUserRoleInTeam = (team: Team) => {
    if (team.creator_id === profile_id)
      return (
        <div className="team-role">
          <Crown /> Leader
        </div>
      )
    else if (team.trainers.some((trainer_id) => String(trainer_id) === profile_id))
      return (
        <div className="team-role">
          <TrainerBadge /> Trainer
        </div>
      )
    else
      return (
        <div className="team-role">
          <MemberBadge /> Member
        </div>
      )
  }

  return (
    <Container>
      <div className="topbar">
        <h3 className="title">Team{profileTeamsJoined.length > 1 ? 's' : ''}</h3>

        <Link href="/builder?builder=team">+</Link>
      </div>

      <TeamsList>
        {Boolean(profileTeamsJoined.length) ? (
          profileTeamsJoined.map((team) => (
            <TeamItem key={team._id}>
              <Link href={`/teams/${team._id}`} className="button-press">
                <div className="team-info">
                  <span className="team-name">{team.teamName}</span>

                  <div className="spacer" />

                  {getUserRoleInTeam(team)}

                  {/* <p className="members">
                    {team.members.length} {team.members.length === 1 ? "member" : "members"}
                  </p> */}
                </div>
              </Link>
            </TeamItem>
          ))
        ) : (
          <p className="no-teams">None</p>
        )}
      </TeamsList>
    </Container>
  )
}
export default TeamsTile

const Container = styled.section`
  position: relative;
  width: 100%;
  padding: 0.5rem;

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      width: 20px;
      height: 20px;
      display: grid;
      place-items: center;
      border-radius: 5px;
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.lowOpacity};
      font-size: 0.9rem;
      line-height: 0.9rem;
    }
  }
`

const TeamsList = styled.ul`
  .no-teams {
    line-height: 1.2rem;
    font-size: 0.9rem;
    padding: 0.25rem;
    font-weight: 300;
  }
`

const TeamItem = styled.li`
  width: 100%;
  margin-bottom: 0.5rem;

  a {
    background: ${({ theme }) => theme.darkBg};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.border};
    border-radius: 5px;
    display: block;
    width: 100%;
    padding: 0.35rem 1rem;

    .team-info {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .team-name {
        font-size: 1rem;
      }

      .spacer {
        flex: 1;
      }

      .team-role {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 0.7rem;
        color: ${({ theme }) => theme.textLight};
      }

      .members {
        color: ${({ theme }) => theme.textLight};
        font-size: 0.6rem;
      }
    }
  }
`
