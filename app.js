const express = require("express");
const app = express();

const Sequelize = require("sequelize");
const sequelize = new Sequelize("sequelize_test","root","root@12",{
    dialect: "mariadb",
    host: "localhost",
    // logging: false
});

const Task = sequelize.define("task",{
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
});



app.listen(3000,()=>{
    console.log("server listening on port 3000");
});

// get all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

// get task by id
app.get("/tasks/:id", async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);
    if(task){
        res.json(task);
    }else{
        res.status(404).send('<h1 style ="text-align:center">Task Not found - Error 404</h1>');
    }
});

// create new task
app.get("/tasks/create/:name", async (req, res) => {
    const taskName = req.params.name;
    const task = await Task.create({name:taskName});
    res.json(task);
});

// update task by id
app.get("/tasks/update/:id/:name", async (req, res) => {
    const taskId = req.params.id;
    const taskName = req.params.name;
    const task = await Task.findByPk(taskId);
    if(task){
        task.name = taskName;
        await task.save();
        res.json(task);
    } else{
        res.status(404).send('Task not found - Error 404');
    }
});

// delete task by id
app.get("/tasks/delete/:id", async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);
    if(task){
        await task.destroy();
        res.send('Task Deleted')
    }else{
        res.status(404).send('Task Not Found - Error 404 ')
    }
});

sequelize.sync({alter:true});