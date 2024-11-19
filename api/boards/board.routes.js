import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getBoards, getBoardById, addBoard, updateBoard, removeBoard, addTaskConversation, removeTaskConversation, addAiBoard, addBoardDemo } from './board.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getBoards)
router.get('/:boardId', log, getBoardById)
router.post('/', log, requireAuth, addBoard)
router.post('/demo', log, requireAuth, addBoardDemo)
router.post('/ai', log, requireAuth, addAiBoard)
router.put('/:id', requireAuth, updateBoard)
router.delete('/:id', requireAuth, removeBoard)
// router.delete('/:id', requireAuth, requireAdmin, removeBoard)

router.post('/:boardId/:groupId/:taskId/msg', addTaskConversation)
router.delete('/:boardId/:groupId/:taskId/msg/:msgId', removeTaskConversation)

export const boardRoutes = router