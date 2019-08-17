const express = require('express')
const query = require('./lib/pg')

const app = express()
app.set('view engine', 'ejs')
app.get('/', (_req, res) => {
  res.send('hello')
})

app.get('/tasks', async (_req, res) => {
  const { rows } = await query('SELECT title FROM tasks')
  res.send(rows)
})

const port = 3000
app.listen(port, () => {
  console.log(`server started... localhost:${port}`)
})