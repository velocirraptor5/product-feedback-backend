import { Router } from 'express'
import { me, updateMe, getUser } from './user.controllers'

const router = Router()

router.get('/', me)
router.put('/', updateMe)

// /api/user/:id
router
    .route('/:id')
    .get(getUser)
export default router
