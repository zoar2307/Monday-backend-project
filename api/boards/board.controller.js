import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { makeId } from '../../services/util.service.js'
import { boardService } from './board.service.js'

export async function getBoards(req, res) {
	try {
		const filterBy = {
			title: req.query.title || '',
			status: req.query.status || '',
			priority: req.query.priority || '',
			person: req.query.person,
			// sortDir: req.query.sortDir || 1,
		}
		const boards = await boardService.query(filterBy)
		res.json(boards)
	} catch (err) {
		logger.error('Failed to get boards', err)
		res.status(400).send({ err: 'Failed to get boards' })
	}
}

export async function getBoardById(req, res) {
	try {
		const boardId = req.params.boardId
		const board = await boardService.getById(boardId)
		res.json(board)
	} catch (err) {
		logger.error('Failed to get board', err)
		res.status(400).send({ err: 'Failed to get board' })
	}
}

export async function addBoard(req, res) {
	const { loggedinUser, body: board } = req
	try {
		board.owner = loggedinUser
		board.isStarred = false
		board.archivedAt = null
		board.labels = [
			{ id: "l101", title: "Done", color: "#01c875", type: "status" },
			{ id: "l102", title: "Stuck", color: "#e02f4b", type: "status" },
			{ id: "l103", title: "Working on it", color: "#fdbb63", type: "status" },
			{ id: "l104", title: "Bonus", color: "#b57ce3", type: "status" },
			{ id: "l105", title: "Coming soon", color: "#7aaffd", type: "status" },
			{ id: "l106", title: "High", color: "#6545a9", type: "priority" },
			{ id: "l107", title: "Medium", color: "#777ae5", type: "priority" },
			{ id: "l108", title: "Low", color: "#7aaffd", type: "priority" },
			{ id: "l109", title: "Critical", color: "#5c5c5c", type: "priority" }
		]
		board.members = []
		board.groups = [
			{
				"id": "g10a",
				"title": "Group title",
				"color": "#e02f4b",
				"tasks": [
					{
						"id": makeId(),
						"title": "Item 1",
						"assignedTo": [],
						"status": "Working on it",
						"priority": "High",
						"conversation": []
					},
					{
						"id": makeId(),
						"title": "Item 2",
						"assignedTo": [],
						"status": "Working on it",
						"priority": "High",
						"conversation": []
					},
					{
						"id": makeId(),
						"title": "Item 3",
						"assignedTo": [],
						"status": "Working on it",
						"priority": "High",
						"conversation": []
					},

				]
			}


		]
		board.activities = []
		board.cmpsLabels = []


		const addedBoard = await boardService.add(board)
		res.json(addedBoard)
	} catch (err) {
		logger.error('Failed to add board', err)
		res.status(400).send({ err: 'Failed to add board' })
	}
}

export async function updateBoard(req, res) {
	const { loggedinUser, body: board } = req
	// const { _id: userId, isAdmin } = loggedinUser

	// if (!isAdmin && board.owner._id !== userId) {
	// 	res.status(403).send('Not your board...')
	// 	return
	// }

	try {
		const updatedBoard = await boardService.update(board)

		// Sent emit to all users but not to the who updated the board
		socketService.broadcast({ type: 'board-update', data: updatedBoard, userId: loggedinUser._id })
		res.json(updatedBoard)
	} catch (err) {
		logger.error('Failed to update board', err)
		res.status(400).send({ err: 'Failed to update board' })
	}
}

export async function removeBoard(req, res) {
	try {
		const boardId = req.params.id
		const removedId = await boardService.remove(boardId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove board', err)
		res.status(400).send({ err: 'Failed to remove board' })
	}
}

export async function addTaskConversation(req, res) {
	const { loggedinUser } = req

	try {
		const boardId = req.params.boardId
		const groupId = req.params.groupId
		const taskId = req.params.taskId
		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		const savedMsg = await boardService.addTaskConversation(boardId, groupId, taskId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to update board', err)
		res.status(400).send({ err: 'Failed to update board' })
	}
}

export async function removeTaskConversation(req, res) {
	try {
		const boardId = req.params.boardId
		const groupId = req.params.groupId
		const taskId = req.params.taskId
		const { msgId } = req.params


		const removedId = await boardService.removeTaskConversation(boardId, groupId, taskId, msgId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove board msg', err)
		res.status(400).send({ err: 'Failed to remove board msg' })
	}
}

