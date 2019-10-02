const { Pool } = require('pg')

const host = process.env.DB_HOST || 'localhost'
const database = process.env.DB_DATABASE || 'postgres'
const user = process.env.DB_USER || 'postgres'
const port = process.env.DB_PORT || 5432
const password = process.env.DB_PASSWORD || 'postgres'

const query = async q => {
    const pool = new Pool({
        host,
        database,
        user,
        port,
        password
      })
    const client = await pool.connect(console.log("Connected to database"))
    try {
      return await client.query(q)
    } finally {
      client.release()
    }
}

const getTasks = (req, res) => {
    query(`SELECT id, title, is_done FROM tasks WHERE user_id = '51175123-33e3-4524-b4f9-bcfecb94e941' ORDER BY id`)
    .then((results) => {
        res.status(200).json(results.rows)
    })
    .catch(err => console.log(err))
}

const getTaskById = (req, res) => {
    const id = parseInt(req.params.id)
  
    query(`SELECT * FROM tasks WHERE id = ${id}`)
    .then((results) => {
        res.status(200).json(results.rows)        
    })
}

const createTask = (req, res) => {
    const task = req.body.title
    
    query(`INSERT INTO tasks (title, user_id) VALUES ('${task}', '51175123-33e3-4524-b4f9-bcfecb94e941')`)
    .then(() => {
      res.status(201).send(req.body)
      console.log('Task Added')
    })
    .catch(err => console.log(err))
}

const updateTask = (req,res) => {
    const id = parseInt(req.params.id)
    const is_done = req.body.is_done ? true : false

    query(`UPDATE tasks SET is_done = ${is_done} WHERE id = ${id}`)
    .then(() => {
        res.status(200).send(`Task Updated with ID: ${id}`)
     })
    .catch(err => console.log(err))
}

const deleteTask = (req, res) => {
    const id = parseInt(req.params.id)

    query(`DELETE FROM tasks WHERE id = ${id}`)
    .then(() => {
        res.status(200).send(`Task deleted with ID: ${id}`)
        console.log("Task Deleted")
    })
    .catch(err => console.log(err))
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}