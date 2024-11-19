import { Socket } from 'socket.io'
import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { makeId } from '../../services/util.service.js'
import { boardService } from './board.service.js'
//ai
import dotenv from 'dotenv'

import OpenAI from "openai";
dotenv.config()


const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

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

export async function addAiBoard(req, res) {
	const { loggedinUser, body: data } = req
	try {
		console.log(data)
		console.log(loggedinUser)

		const response = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					"role": "system",
					"content": [
						{
							"type": "text",
							"text": "-you must include the same labels\n-cmpLabels must be there\n-every thing withe id generate new one\n-you must put the given owner from user on json owner \n-the given owner from user  will be the only member inside members array\n-board title tasks title and groups titles must be change to the given theme\n-at least 3 groups and 3 tasks in each group\nand date woth future dates\n\n-dont miss any key\n-assignedTo should be empty array\n-activities will be empty array\n-dont gen the first _id\n-for each task add key conversation that will be empty array\n-that will be able to be inserted to mongoDb\n\njson {\n {\n  \"\n  \"title\": \"New Board\",\n  \"owner\": {\n    \"_id\": \"67378d36b3546cec48e7d1ec\",\n    \"fullname\": \"Zohar Yevelkin\",\n    \"imgUrl\": \"https://res.cloudinary.com/drj1liym1/image/upload/v1731773149/etgqjpbw5x9nvrsbwsle.jpg\",\n    \"isAdmin\": null\n  },\n  \"isStarred\": false,\n  \"archivedAt\": null,\n  \"labels\": [\n    {\n      \"id\": \"l101\",\n      \"title\": \"Done\",\n      \"color\": \"#01c875\",\n      \"type\": \"status\"\n    },\n    {\n      \"id\": \"l102\",\n      \"title\": \"Stuck\",\n      \"color\": \"#e02f4b\",\n      \"type\": \"status\"\n    },\n    {\n      \"id\": \"l103\",\n      \"title\": \"Working on it\",\n      \"color\": \"#fdbb63\",\n      \"type\": \"status\"\n    },\n    {\n      \"id\": \"l104\",\n      \"title\": \"Bonus\",\n      \"color\": \"#b57ce3\",\n      \"type\": \"status\"\n    },\n    {\n      \"id\": \"l105\",\n      \"title\": \"Coming soon\",\n      \"color\": \"#7aaffd\",\n      \"type\": \"status\"\n    },\n    {\n      \"id\": \"l106\",\n      \"title\": \"High\",\n      \"color\": \"#6545a9\",\n      \"type\": \"priority\"\n    },\n    {\n      \"id\": \"l107\",\n      \"title\": \"Medium\",\n      \"color\": \"#777ae5\",\n      \"type\": \"priority\"\n    },\n    {\n      \"id\": \"l108\",\n      \"title\": \"Low\",\n      \"color\": \"#7aaffd\",\n      \"type\": \"priority\"\n    },\n    {\n      \"id\": \"l109\",\n      \"title\": \"Critical\",\n      \"color\": \"#5c5c5c\",\n      \"type\": \"priority\"\n    }\n  ],\n  \"members\": [\n    {\n      \"_id\": \"67378d36b3546cec48e7d1ec\",\n      \"fullname\": \"Zohar Yevelkin\",\n      \"imgUrl\": \"https://res.cloudinary.com/drj1liym1/image/upload/v1731773149/etgqjpbw5x9nvrsbwsle.jpg\",\n      \"isAdmin\": null,\n      \"unread\": [\n        {\n          \"tId\": \"7q7TTt\",\n          \"count\": 1\n        }\n      ]\n    },\n    {\n      \"_id\": \"6738d1c601b56bb6b79f0a24\",\n      \"username\": \"guest\",\n      \"fullname\": \"Guest\",\n      \"imgUrl\": \"https://res.cloudinary.com/drj1liym1/image/upload/v1731801635/gykhjqprtyeqkmxrkxc7.png\",\n      \"isAdmin\": null,\n      \"score\": 100,\n      \"createdAt\": \"2024-11-16T17:09:26.000Z\",\n      \"unread\": []\n    }\n  ],\n  \"groups\": [\n    {\n      \"id\": \"g10a\",\n      \"title\": \"Group title\",\n      \"color\": \"#e02f4b\",\n      \"tasks\": [\n        {\n          \"id\": \"d0Sgq\",\n          \"title\": \"Item 1\",\n          \"assignedTo\": [],\n          \"status\": \"Working on it\",\n          \"priority\": \"High\",\n          \"conversation\": []\n        },\n        {\n          \"id\": \"IvuVv\",\n          \"title\": \"Item 2\",\n          \"assignedTo\": [],\n          \"status\": \"Working on it\",\n          \"priority\": \"High\",\n          \"conversation\": []\n        },\n        {\n          \"id\": \"YuAoJ\",\n          \"title\": \"Item 3\",\n          \"assignedTo\": [],\n          \"status\": \"Working on it\",\n          \"priority\": \"High\",\n          \"conversation\": []\n        },\n        {\n          \"title\": \"New task\",\n          \"id\": \"9bUOOB\",\n          \"conversation\": [],\n          \"status\": \"Done\"\n        },\n        {\n          \"title\": \"New task\",\n          \"id\": \"6Uu5iB\",\n          \"conversation\": []\n        },\n        {\n          \"title\": \"New task\",\n          \"id\": \"7q7TTt\",\n          \"conversation\": [\n            {\n              \"txt\": \"new update\",\n              \"createdAt\": 1732003890956,\n              \"member\": {\n                \"_id\": \"6738d1c601b56bb6b79f0a24\",\n                \"fullname\": \"Guest\",\n                \"imgUrl\": \"https://res.cloudinary.com/drj1liym1/image/upload/v1731801635/gykhjqprtyeqkmxrkxc7.png\"\n              },\n              \"id\": \"gNBgp5\",\n              \"likes\": []\n            }\n          ],\n          \"activityLog\": [\n            {\n              \"id\": \"Title-1732003886109\",\n              \"member\": {\n                \"imgUrl\": \"https://res.cloudinary.com/drj1liym1/image/upload/v1731801635/gykhjqprtyeqkmxrkxc7.png\",\n                \"fullname\": \"Guest\"\n              },\n              \"taskTitle\": \"New task\",\n              \"label\": \"Title\",\n              \"prevValue\": \"None\",\n              \"newValue\": \"New task\",\n              \"timestamp\": \"2024-11-19T08:11:26.109Z\"\n            }\n          ],\n          \"previousTitle\": \"New task\"\n        }\n      ]\n    }\n  ],\n  \"activities\": [],\n  \"cmpsLabels\": [\n    {\n      \"type\": \"MemberPicker\",\n      \"title\": \"Person\",\n      \"id\": \"V9Udz\",\n      \"class\": \"members\"\n    },\n    {\n      \"type\": \"StatusPicker\",\n      \"title\": \"Status\",\n      \"id\": \"9Rw2x\",\n      \"class\": \"status\"\n    },\n    {\n      \"type\": \"PriorityPicker\",\n      \"title\": \"Priority\",\n      \"id\": \"u7XO2\",\n      \"class\": \"priority\"\n    },\n    {\n      \"type\": \"DatePicker\",\n      \"class\": \"date\",\n      \"title\": \"Date\",\n      \"id\": \"SSXWk6\"\n    }\n  ]\n}"
						}
					]
				},
				{
					"role": "user",
					"content": [
						{
							"type": "text",
							"text": `owner :${JSON.stringify(loggedinUser)} \n prjoct theme :${data.theme}`
						}
					]
				}
			],
			temperature: 1,
			max_tokens: 2360,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			response_format: {
				"type": "json_object"
			},
		});
		const genBoard = JSON.parse(response.choices[0].message.content)
		console.log(genBoard)
		const addedBoard = await boardService.add(genBoard)
		res.json(addedBoard)


	} catch (err) {

	}
}

export async function addBoardDemo(req, res) {
	const { loggedinUser, body: board } = req
	try {
		const addedBoard = await boardService.add(board)
		res.json(addedBoard)
	} catch (err) {
		logger.error('Failed to add board', err)
		res.status(400).send({ err: 'Failed to add board' })
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
		board.members = [loggedinUser]
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
						"conversation": [

						]
					},

				]
			}

		]
		board.activities = []
		board.cmpsLabels = [
			{ type: 'MemberPicker', title: 'Person', id: makeId(), class: 'members' },
			{ type: 'StatusPicker', title: 'Status', id: makeId(), class: 'status' },
			{ type: 'PriorityPicker', title: 'Priority', id: makeId(), class: 'priority' },]


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

