import mongoose from "mongoose"
import Todo from "../models/model.todo.js"

export const getUserTodos = async (userId: string, filters = {}) => {
    return await Todo.find({
        userId: new mongoose.Types.ObjectId(userId)
    })
}
export const createTodo = async (title: string, userId: string) => {
    return await Todo.create({
        title,
        userId: new mongoose.Types.ObjectId(userId)
    })
}
export const updateTodo = async (todoId: string, userId: string, newTitle: string) => {
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
export const deleteTodo = async (todoId: string, userId: string) => {
    return await Todo.deleteOne({
        _id: new mongoose.Types.ObjectId(todoId),
        userId: new mongoose.Types.ObjectId(userId),
    })
}