import { ObjectId } from 'mongodb'
import dayjs from 'dayjs'
import { dateCompare, getSortedWorkoutLogDateArray } from '../../utils'
import { User, WorkoutLogItem, ShortUser, WorkoutLog } from '../../types'

export async function getUserById(db: any, id: string) {
  const user: User = await db.collection('users').findOne({ _id: new ObjectId(id) })
  return user
}

export async function getUserByEmail(db: any, email: string) {
  const user: User = await db.collection('users').findOne({ email: email })
  return user
}

export async function getShortLogUserById(db: any, id: string) {
  const user: User = await db.collection('users').findOne({ _id: new ObjectId(id) })
  const sortedLog = getSortedWorkoutLogDateArray(user.workoutLog)
  // Return only the last 7 dates logged
  const shortLog: WorkoutLog = {}
  sortedLog.slice(-7).forEach((date) => (shortLog[date] = user.workoutLog[date]))
  user.workoutLog = shortLog

  return user
}

export async function getUserByUsername(db: any, username: string) {
  const user: User = await db.collection('users').findOne({ username: username })
  return user
}

export async function getUserByUsernameOmitWorkoutLog(db: any, username: string) {
  const user: User = await db.collection('users').findOne({ username: username })
  const { workoutLog, ...omitWorkoutLog } = user

  return omitWorkoutLog as Omit<User, 'workoutLog'>
}

export async function updateUserLastLoggedIn(db: any, id: string) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { lastLoggedIn: dayjs().toISOString() } },
      { returnNewDocument: true }
    )
  return updated
}

export async function addToUserSavedWorkouts(db: any, user_id: string, workout_id: string) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $push: { savedWorkouts: new ObjectId(workout_id) } })
  return updated
}
export async function removeFromUserSavedWorkouts(db: any, user_id: string, workout_id: string) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $pull: { savedWorkouts: new ObjectId(workout_id) } })
  return updated
}

export async function pushToUserWeight(db: any, user_id: string, weight: User['weight']) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $push: { weight } })
  return updated
}

export async function addIdToUserFollowing(db: any, user_id: string, add_id: string) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $push: { following: new ObjectId(add_id) } })
  return updated
}

export async function addIdToUserFollowers(db: any, user_id: string, add_id: string) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $push: { followers: new ObjectId(add_id) } })
  return updated
}

export async function removeIdFromUserFollowing(db: any, user_id: string, remove_id: string) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $pull: { following: new ObjectId(remove_id) } })

  return updated
}

export async function removeIdFromUserFollowers(db: any, user_id: string, remove_id: string) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $pull: { followers: new ObjectId(remove_id) } })
  return updated
}

export async function updateUserBio(db: any, user_id: string, bio: string) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { bio: bio } })
  return updated
}

export async function userJoiningTeam(db: any, user_id: string, team_id: string) {
  let updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $push: { teamsJoined: new ObjectId(team_id) } })

  updated = await db
    .collection('teams')
    .findOneAndUpdate({ _id: new ObjectId(team_id) }, { $push: { members: new ObjectId(user_id) } })

  return updated
}

export async function userLeavingTeam(db: any, user_id: string, team_id: string) {
  let updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $pull: { teamsJoined: new ObjectId(team_id) } })

  updated = await db
    .collection('teams')
    .findOneAndUpdate({ _id: new ObjectId(team_id) }, { $pull: { members: new ObjectId(user_id) } })

  return updated
}

export async function updateUserProfileImgUrl(db: any, user_id: string, profileImgUrl: string) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { profileImgUrl: profileImgUrl } })
  return updated
}

export async function addIdToUserRecentlyViewedUsers(db: any, user_id: string, viewed_id: string) {
  await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $pullAll: { recentlyViewedUsers: [new ObjectId(viewed_id)] } })
  const updated: boolean = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(user_id) },
    {
      $push: {
        recentlyViewedUsers: {
          $each: [new ObjectId(viewed_id)],
          $position: 0,
        },
      },
    }
  )
  return updated
}

export async function addNewEntryInWorkoutLog(db: any, user_id: string, date: string, workoutData: WorkoutLogItem) {
  const data = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { [`workoutLog.${date}`]: workoutData } })
  const isNewWorkout = !Boolean(data.value.workoutLog[date])
  const saved = Boolean(data.ok)
  return [isNewWorkout, saved]
}

export async function removeEntryFromWorkoutLog(db: any, user_id: string, date: string) {
  const data = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $unset: { [`workoutLog.${date}`]: 1 } })
  const removedWorkout_id = data.value.workoutLog[date]?.workout_id
  const saved = Boolean(data.ok)
  return [removedWorkout_id, saved]
}

export async function getUserWorkoutLog(db: any, user_id: string, startDate: string, endDate: string) {
  const [data] = (await db
    .collection('users')
    .aggregate([{ $match: { _id: new ObjectId(user_id) } }, { $project: { workoutLog: 1 } }])
    .toArray()) as [{ _id: string; workoutLog: WorkoutLog }]

  startDate = startDate || dayjs('1970').toISOString()
  endDate = endDate || dayjs().toISOString()

  for (let date in data.workoutLog) {
    const isAfterStartDate = dateCompare(startDate, date)
    const isBeforeEndDate = dateCompare(date, endDate)
    const isWithinRange = isAfterStartDate && isBeforeEndDate
    if (!isWithinRange) {
      delete data.workoutLog[date]
    }
  }

  return data.workoutLog
}

export async function initializeAccount(db: any, newUser: { email: string; customerId?: string }) {
  const { email, customerId } = newUser

  const data = await db.collection('users').insertOne({
    email: email,
    subscription: customerId ? { customerId } : { plan: 'free' },
    accountCreated: dayjs().toISOString(),
    lastLoggedIn: dayjs().toISOString(),
    workoutLog: {},
    savedWorkouts: [],
  })

  return data.ops[0]
}

export async function userSubscriptionUpdated(db: any, subscription: Partial<User['subscription']>) {
  const bulk = await db.collection('users').initializeUnorderedBulkOp()
  for (const [key, value] of Object.entries(subscription)) {
    if (key === 'customerId') continue

    bulk
      .find({ 'subscription.customerId': subscription.customerId })
      .updateOne({ $set: { [`subscription.${key}`]: value } })
  }
  bulk.execute()
}

export async function setUsernameAndPassword(db: any, username: string, passwordHash: string, email: string) {
  const data = await db
    .collection('users')
    .findOneAndUpdate(
      { email },
      { $set: { username, password: passwordHash, lastLoggedIn: dayjs().toISOString() } },
      { returnDocument: 'after' }
    )
  const user: User = data.value
  delete user.password
  return user
}

export async function getShortUsersFromIdArr(db: any, idArr: string[]) {
  const users: ShortUser[] = await db
    .collection('users')
    .find({ _id: { $in: idArr.map((_id) => new ObjectId(_id)) } })
    .project({ username: 1, profileImgUrl: 1 })
    .toArray()
  return users
}

export async function getProfileImgUrlFromUsername(db: any, username: string) {
  const user: ShortUser = await db
    .collection('users')
    .find({ username: username })
    .project({ username: 1, profileImgUrl: 1 })
    .toArray()
  return user[0]
}

export async function searchUsernameQuery(db: any, query: string) {
  const foundUsers: ShortUser[] = await db
    .collection('users')
    .aggregate([
      { $match: { username: { $regex: query, $options: 'i' } } },
      {
        $project: {
          _id: 1,
          username: 1,
          profileImgUrl: 1,
          accuracy: {
            $cond: [
              { $eq: [{ $substr: [{ $toLower: '$username' }, 0, query.length] }, query.toLocaleLowerCase()] },
              1,
              0,
            ],
          },
        },
      },
      { $sort: { accuracy: -1 } },
    ])
    .toArray()

  return foundUsers
}

export async function updateUserPreference(db: any, user_id: string, key: string, value: string | boolean) {
  const updated: boolean = await db
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { [`preferences.${key}`]: value } })
  return updated
}
