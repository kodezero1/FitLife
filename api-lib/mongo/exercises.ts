import { Exercise, NewExercise } from '../../types'
import { ObjectId } from 'mongodb'

async function queryExercises(db: any, query) {
  const exercises: Exercise[] = await db.collection('exercises').find(query).toArray()
  return exercises
}

export async function queryExerciseNamesByIdArr(db: any, idArr: string[]) {
  const workouts: { _id: string; name: string }[] = await db
    .collection('exercises')
    .find({ _id: { $in: idArr.map((_id) => new ObjectId(_id)) } })
    .project({ name: 1 })
    .toArray()
  return workouts
}

export async function queryExercisesByCreatorId(db: any, creator_id: string) {
  return await queryExercises(db, { creator_id: new ObjectId(creator_id) })
}
export async function queryExercisesById(db: any, exercise_id: string) {
  return await queryExercises(db, { _id: new ObjectId(exercise_id) })
}

export async function getDefaultExercises(db: any) {
  return await queryExercises(db, { public: true })
}

export async function getNonDefaultExercises(db: any) {
  return await queryExercises(db, { public: false })
}

export async function postNewExercise(db: any, exercise: NewExercise): Promise<Exercise | false> {
  const { insertedId } = await db.collection('exercises').insertOne(exercise)
  return insertedId ? { ...exercise, _id: insertedId } : false
}

export async function deleteExercise(db: any, id: string) {
  const deleted = await db.collection('exercises').deleteOne({ _id: new ObjectId(id) })
  return Boolean(deleted.deletedCount) ? id : false
}

export async function setExercisePublic(db: any, id: string, isPublic: boolean) {
  const updated = await db
    .collection('exercises')
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { public: isPublic } }, { returnDocument: 'after' })

  return updated.value
}

export async function queryExercisesByIdArr(db: any, idArr: string[]) {
  const exercises: Exercise[] = await db
    .collection('exercises')
    .find({
      _id: { $in: idArr.map((_id) => new ObjectId(_id)) },
    })
    .toArray()
  return exercises
}
