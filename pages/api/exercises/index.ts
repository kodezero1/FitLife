import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'

import { connectToDatabase } from '../../../utils/mongodb'
import {
  deleteExercise,
  getDefaultExercises,
  getNonDefaultExercises,
  postNewExercise,
  queryExercisesByCreatorId,
} from '../../../api-lib/mongo'
import { verifyAuthToken } from '../../../api-lib/auth/middleware'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method
  const { db } = await connectToDatabase()

  switch (httpMethod) {
    case 'GET':
      if (typeof req.query.creator_id === 'string') {
        const exercises = await queryExercisesByCreatorId(db, req.query.creator_id)
        res.json(exercises)
      } else if (req.query.default === 'false') {
        const exercises = await getNonDefaultExercises(db)
        res.json(exercises)
      } else if (req.query.default === 'true') {
        const exercises = await getDefaultExercises(db)
        res.json(exercises)
      } else {
        res.status(400).end()
      }
      break
    case 'POST':
      const exercise = JSON.parse(req.body) // no type
      exercise.creator_id = new ObjectId(exercise.creator_id)

      const validId = verifyAuthToken(req, exercise.creator_id)
      if (!validId) return res.redirect(401, '/')

      const newExercise = await postNewExercise(db, exercise)
      newExercise ? res.status(201).json({ exercise: newExercise }) : res.status(404).end()

      break
    case 'PUT':
      break
    case 'DELETE':
      break
  }
}
