import { Router } from 'express'
import controllers from './comment.controllers'

const router = Router()

// /api/comment
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)

// /api/comment/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
