import mongoose from "mongoose"
import Todo from "../models/model.todo.js"

const listTodos = async (userId: string, page: number, pageSize: number, filters = {}) => {
    const query = {
        userId: new mongoose.Types.ObjectId(userId)
    }
    const todos = await Todo.find(query).limit(pageSize).skip((page - 1) * pageSize).sort({ createdAt: -1 })
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