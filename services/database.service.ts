require("dotenv").config()
import { MongoClient, ServerApiVersion } from "mongodb";
import { Task } from "../models/task.model";


const uri: string = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@${process.env.DATABASE_CLUSTER}/?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`;
const client: MongoClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },

});


export default class DatabaseService {
    async getAllTasks() {
        try {
            await client.connect();
            var allTasks = await client.db("tasks_database").collection("tasks").find({}).toArray()
            return allTasks
        } finally {
            await client.close();
        }
    }
    async getIndividualTask(id: string) {
        try {
            await client.connect();
            var individualTask = await client.db("tasks_database").collection("tasks").find({ id }).toArray()
            return individualTask
        } finally {
            await client.close();
        }
    }
    async createTask(task: Task) {
        try {

            await client.connect()
            const checkingTaskExistance = await client.db("tasks_database").collection("tasks").countDocuments({ id: task.id });
            console.log(checkingTaskExistance)
            if (checkingTaskExistance <= 0) {
                await client.db("tasks_database").collection("tasks").insertOne(
                    {
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        type: task.type,
                        createdOn: task.createdOn,
                        status: task.status,
                    }
                )
                console.log("task created")
            } else { console.log("Duplicate Task ID") }

        } finally {
            await client.close();
        }
    }
    async deleteTask(taskToDelete: Task) {
        try {
            await client.connect()
            const checkingTaskExistance = await client.db("tasks_database").collection("tasks").countDocuments({ id: taskToDelete.id });

            if (checkingTaskExistance > 0) {
                await client.db("tasks_database").collection("tasks").deleteOne({ id: taskToDelete.id })
            }

        } finally {
            await client.close();
        }
    }
    async updateTask(updatedData: Task) {

        try {
            await client.connect()
            const checkingTaskExistance = await client.db("tasks_database").collection("tasks").countDocuments({ id: updatedData.id });

            if (checkingTaskExistance > 0) {
                await client.db("tasks_database").collection("tasks").updateOne({ id: updatedData.id }, { $set: updatedData })
            }
        } catch (error) {
            console.error(`Error checking task existence: ${error}`);
        } finally {
            await client.close()
        }


    }
}


