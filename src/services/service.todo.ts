import mongoose from "mongoose"
import Todo from "../models/model.todo.js"
import type { TodoFilters } from "../types/todos.js"
import { escapeRegex } from "../utils/lib-functions.js"

type TodoQuery = {
    userId: mongoose.Types.ObjectId
    title?: RegExp
    isCompleted?: boolean
}

const listTodos = async (userId: string, page: number, pageSize: number, filters: TodoFilters) => {
    const query: TodoQuery = {
        userId: new mongoose.Types.ObjectId(userId)
    }
    if (filters.isCompleted !== undefined)
        query.isCompleted = filters.isCompleted

    if (filters.title?.trim() && filters.title !== undefined)
        query.title = new RegExp(escapeRegex(filters.title.trim()), 'i')

    const todos = await Todo.find(query).limit(pageSize).skip((page - 1) * pageSize).sort({ createdAt: -1 }).select('-__v')
    const totalTodos = await Todo.countDocuments(query)
    return { todos, totalTodos }
}

const createTodo = async (title: string, userId: string) => {
    return await Todo.create({
        title,
        userId: new mongoose.Types.ObjectId(userId)
    })
}

const updateTodo = async (todoId: string, userId: string, newTitle: string) => {
    return await Todo.updateOne(
        {
            _id: new mongoose.Types.ObjectId(todoId),
            userId: new mongoose.Types.ObjectId(userId),
        },
        {
            $set: { title: newTitle }
        }
    )
}

const toggleTodo = async (todoId: string, userId: string) => {
    return await Todo.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(todoId),
            userId: new mongoose.Types.ObjectId(userId),
        },
        [
            {
                $set: {
                    isCompleted: { $not: ["$isCompleted"] }
                }
            }
        ],
        { returnDocument: 'after', updatePipeline: true }
    );
};

const deleteTodo = async (todoId: string, userId: string) => {
    return await Todo.deleteOne({
        _id: new mongoose.Types.ObjectId(todoId),
        userId: new mongoose.Types.ObjectId(userId),
    })
}

const TodoService = { createTodo, updateTodo, deleteTodo, toggleTodo, listTodos }
export default TodoService