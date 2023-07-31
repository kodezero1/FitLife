import { useContext } from 'react'
import styled, { useTheme, withTheme } from 'styled-components'
// Components
import ThemeToggle from '../Themes/ThemeToggle'
// Context
import { updateUserPreference, useUserDispatch, useUserState } from '../../store'
import Toggle from '../Shared/Toggle'
import { isTrue } from '../../utils'
import { accentColors } from '../Themes/Themes'
import { ThemeToggleContext } from '../Themes/useThemeState'
import { StripePortalURL } from '../../utils/envs'

const TopTile: React.FC = () => {
  const { user } = useUserState()
  const dispatch = useUserDispatch()

  const { setAccentColor } = useContext(ThemeToggleContext)!
  const theme = useTheme() as any

  const updatePreference = (key: string, value: boolean | string) => {
    updateUserPreference(dispatch, key, value, user?._id)
  }

  return (
    <Tile>
      <h3 className="title">Log</h3>
      <div className="info">
        <label className="row">
          <span>Date Bar</span>
          <Toggle
            checked={isTrue(user?.preferences?.showDateBarInLog)}
            onChange={() => updatePreference('showDateBarInLog', !isTrue(user?.preferences?.showDateBarInLog))}
          />
        </label>

        <label className="row">
          <span>Muscle Icons</span>
          <Toggle
            checked={isTrue(user?.preferences?.showMuscleIconsInLog)}
            onChange={() => updatePreference('showMuscleIconsInLog', !isTrue(user?.preferences?.showMuscleIconsInLog))}
          />
        </label>

        <label className="row">
          <span>Exercise Charts</span>
          <Toggle
            checked={isTrue(user?.preferences?.showExerciseChartsInLog)}
            onChange={() =>
              updatePreference('showExerciseChartsInLog', !isTrue(user?.preferences?.showExerciseChartsInLog))
            }
          />
        </label>
      </div>

      <h3 className="title">Profile</h3>
      <div className="info">
        <label className="row">
          <span>Show Bio</span>
          <Toggle
            checked={isTrue(user?.preferences?.showProfileBio)}
            onChange={() => updatePreference('showProfileBio', !isTrue(user?.preferences?.showProfileBio))}
          />
        </label>
      </div>

      <h3 className="title">Units</h3>
      <div className="info">
        <div className="row">
          <span>Weight</span>
          <div className="button-wrap">
            <button
              onClick={() => updatePreference('weightUnit', 'lb')}
              className={`${(!user?.preferences?.weightUnit || user.preferences.weightUnit === 'lb') && 'selected'}`}
              disabled={!user?.preferences?.weightUnit || user.preferences.weightUnit === 'lb'}
            >
              lb
            </button>
            <button
              onClick={() => updatePreference('weightUnit', 'kg')}
              className={`${user?.preferences?.weightUnit === 'kg' && 'selected'}`}
              disabled={user?.preferences?.weightUnit === 'kg'}
            >
              kg
            </button>
          </div>
        </div>
        <div className="row">
          <span>Distance</span>
          <div className="button-wrap">
            <button
              onClick={() => updatePreference('distanceUnit', 'mi')}
              className={`${
                (!user?.preferences?.distanceUnit || user.preferences.distanceUnit === 'mi') && 'selected'
              }`}
              disabled={!user?.preferences?.distanceUnit || user.preferences.distanceUnit === 'mi'}
            >
              mi
            </button>
            <button
              onClick={() => updatePreference('distanceUnit', 'km')}
              className={`${user?.preferences?.distanceUnit === 'km' && 'selected'}`}
              disabled={user?.preferences?.distanceUnit === 'km'}
            >
              km
            </button>
          </div>
        </div>
      </div>

      <h3 className="title">Theme</h3>
      <div className="info">
        <label className="row">
          <span>Dark Mode</span>
          <ThemeToggle />
        </label>
        <div className="row">
          <span>Accent Color</span>
          <div className="button-wrap accent-color-wrap">
            {accentColors.map((color) => (
              <button
                key={color.title}
                onClick={() => setAccentColor(color)}
                style={{
                  background: color.accent,
                  opacity: theme.title! === color.title ? 1 : 0.25,
                }}
                className="accent-color-btn"
              ></button>
            ))}
          </div>
        </div>
      </div>

      <h3 className="title">Account</h3>
      <div className="info">
        {user?.subscription.active && (
          <label className="row">
            <a href={StripePortalURL}>Manage Membership</a>
          </label>
        )}

        <label className="row">
          <span>Role</span>
          <p>{user!.isAdmin ? 'Admin' : 'Member'}</p>
        </label>

        <label className="row">
          <span>User ID</span>
          <span className="user-id">{user?._id}</span>
        </label>
      </div>
    </Tile>
  )
}
export default withTheme(TopTile)

const Tile = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  text-align: left;

  .title {
    margin: 0.75rem 0.75rem 0.25rem;
  }

  .info {
    padding: 0 0.5rem;

    .row {
      background: ${({ theme }) => theme.buttonMedGradient};
      border-radius: 5px;
      margin-bottom: 0.5rem;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      font-size: 0.9rem;

      &:last-of-type {
        border-bottom: none;
      }

      .button-wrap {
        display: flex;
        align-items: center;
        border-radius: 5px;
        overflow: hidden;
        background: ${({ theme }) => theme.medOpacity};

        button {
          padding: 0.1rem 0.5rem;
          min-width: 50px;
          color: ${({ theme }) => theme.textLight};
          transition: all 0.25s ease;

          &.selected {
            background: ${({ theme }) => theme.accent};
            color: ${({ theme }) => theme.accentText};
          }
        }
      }

      .accent-color-wrap {
        gap: 0.25rem;
        border-radius: 0;
        background: none;
        width: 100%;
        margin-top: 0.25rem;

        .accent-color-btn {
          height: 1.25rem;
          min-width: unset;
          flex: 1;
          border-radius: 3px;
        }
      }
    }
  }

  .user-id {
    font-size: 0.8rem;
  }
`
