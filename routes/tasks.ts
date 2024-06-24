import express from "express";
import DatabaseService from "../services/database.service";
import { Task } from "../models/task.model";

const router = express.Router();
let database: DatabaseService;

// Initialize database service
async function initializeDatabase() {
    try {
        database = new DatabaseService();
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

initializeDatabase().catch(console.error);


router.get("/list", async (req: express.Request, res: express.Response) => {
    if (!database) {
        return res.status(500).send("Database connection not initialized");
    }
    try {
        const result = await database.getAllTasks();
        res.send(result);
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/list/:id", async (req: express.Request, res: express.Response) => {

    if (!database) {
        return res.status(500).send("Database connection not initialized");
    }
    try {
        const result = await database.getIndividualTask(req.params.id);
        res.send(result);
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).send("Internal Server Error");
    }

})
router.post("/createTask", async (req: express.Request, res: express.Response) => {

    try {
        const createNewTask: Task = await req.body
        const createdTask = await database.createTask(createNewTask); // Your database interaction function
        res.send(createdTask); // Send response with created task data
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post("/deleteTask", async (req: express.Request, res: express.Response) => {

    try {
        const taskToDelete: Task = await req.body
        database.deleteTask(taskToDelete)
        res.send("Task Deleted")
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
})
router.patch("/updateTask", async (req: express.Request, res: express.Response) => {
    try {
        const updatedTaskData: Task = await req.body
        await database.updateTask(updatedTaskData)

        res.send("data was updated")
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;