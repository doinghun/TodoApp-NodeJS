const express = require('express')
const app = express()
const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'todolist1234',
  port: '5432'
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('Todo app (:')
})

app.get('/tasks', async (req, res) => {
  await client.connect()
  const data = await client.query('SELECT * from tasks')
  await client.end()
  res.send(data.rows)
})

/*
app.post('/tasks', (req, res) => {
  var task_title = req.body.title
  console.log(task_title)
  res.send(task_title)
})
*/

const port = 3000
app.listen(port, () => {
  console.log(`server started... localhost:${port}`)
})