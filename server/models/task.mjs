import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    }
})
const Task = mongoose.model('Task', taskSchema);

export default Task;