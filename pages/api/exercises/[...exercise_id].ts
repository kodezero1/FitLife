import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../utils/mongodb'
import { deleteExercise, queryExercisesById, setExercisePublic } from '../../../api-lib/mongo'
import { verifyAuthToken } from '../../../api-lib/auth/middleware'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method
  const { db } = await connectToDatabase()
  let { exercise_id } = req.query
  if (Array.isArray(exercise_id)) exercise_id = exercise_id[0]
  if (!exercise_id || typeof exercise_id !== 'string') return res.status(404).end()

  let validId: string | false

  switch (httpMethod) {
    case 'GET':
      break
    case 'POST':
      break
    case 'PUT':
      const isPublic = req.query.public?.toString() || ''

      if (isPublic) {
        const exercise = await setExercisePublic(db, exercise_id, isPublic === 'true')
        res.status(200).json({ exercise })
      }

      break
    case 'DELETE':
      const [exerciseToDelete] = await queryExercisesById(db, exercise_id)

      if (exerciseToDelete) {
        const validId = verifyAuthToken(req, exerciseToDelete.creator_id)
        if (!validId) return res.redirect(401, '/')

        const deletedId = await deleteExercise(db, exercise_id)
        deletedId ? res.status(204).end() : res.status(404).end()
      } else {
        res.status(404).end()
      }
      break
  }
}
