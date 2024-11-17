import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const boardService = {
	remove,
	query,
	getById,
	add,
	update,
	addTaskConversation,
	removeTaskConversation,
}

async function query(filterBy = { title: '' }) {
	try {
		const criteria = _buildCriteria(filterBy)
		// const sort = _buildSort(filterBy)

		const collection = await dbService.getCollection('board')

		var boards = await collection.find(criteria).toArray()
		// var boardCursor = await collection.find(criteria, { sort })
		return boards
	} catch (err) {
		logger.error('cannot find boards', err)
		throw err
	}
}

async function getById(boardId) {

	try {
		const criteria = { _id: ObjectId.createFromHexString(boardId) }

		const collection = await dbService.getCollection('board')
		const board = await collection.findOne(criteria)


		board.createdAt = board._id.getTimestamp()

		return board
	} catch (err) {
		logger.error(`while finding board ${boardId}`, err)
		throw err
	}
}

async function remove(boardId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: ownerId, isAdmin } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
		}
		if (!isAdmin) criteria['owner._id'] = ownerId

		const collection = await dbService.getCollection('board')
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your board')
		return boardId
	} catch (err) {
		logger.error(`cannot remove board ${boardId}`, err)
		throw err
	}
}

async function add(board) {
	try {
		const collection = await dbService.getCollection('board')
		await collection.insertOne(board)

		return board
	} catch (err) {
		logger.error('cannot insert board', err)
		throw err
	}
}

async function update(board) {
	const boardToSave = {
		title: board.title,
		groups: board.groups,
		cmpsLabels: board.cmpsLabels,
		labels: board.labels,
		members: board.members,
		activities: board.activities,
		isStarred: board.isStarred,
		owner: board.owner
	}

	try {
		const criteria = { _id: ObjectId.createFromHexString(board._id) }

		const collection = await dbService.getCollection('board')
		await collection.updateOne(criteria, { $set: boardToSave })

		return board
	} catch (err) {
		logger.error(`cannot update board ${board._id}`, err)
		throw err
	}
}


async function addTaskConversation(boardId, groupId, taskId, msg) {
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": groupId,
			"groups.tasks.id": taskId
		}
		msg.id = makeId()

		const collection = await dbService.getCollection('board')

		const result = await collection.updateOne(
			criteria,
			{ $push: { "groups.$[group].tasks.$[task].conversations": msg } },
			{
				arrayFilters: [
					{ "group.id": groupId },
					{ "task.id": taskId }
				]
			}
		)

		if (result.modifiedCount === 0) {
			throw new Error(`No task found with the specified taskId: ${taskId}`)
		}

		return msg
	} catch (err) {
		logger.error(`Cannot add conversation message to task ${taskId} on board ${boardId}`, err)
		throw err
	}
}


async function removeTaskConversation(boardId, groupId, taskId, msgId) {
	try {


		const criteria = {
			_id: ObjectId.createFromHexString(boardId),
			"groups.id": groupId,
			"groups.tasks.id": taskId
		}

		const collection = await dbService.getCollection('board')

		const result = await collection.updateOne(
			criteria,
			{ $pull: { "groups.$[group].tasks.$[task].conversations": { id: msgId } } },
			{
				arrayFilters: [
					{ "group.id": groupId },
					{ "task.id": taskId }
				]
			}
		)

		if (result.modifiedCount === 0) {
			throw new Error(`No conversation message found with msgId: ${msgId} in task ${taskId}`)
		}

		return msgId;
	} catch (err) {
		logger.error(`Cannot remove conversation message ${msgId} from task ${taskId} on board ${boardId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {
		title: { $regex: filterBy.title, $options: 'i' },
		// status: { $gte: filterBy.status },
		// priority: { $gte: filterBy.priority },
		// person: { $gte: filterBy.person },
	}

	return criteria
}

function _buildSort(filterBy) {
	if (!filterBy.sortField) return {}
	return { [filterBy.sortField]: filterBy.sortDir }
}
