const express = require('express')
const app = express()
const { Client } = require('pg');
const config = require('../config');

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('hello')
})

app.get('/tasks', async (req, res) => {
  const client = new Client({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port:config.port
  })
  await client.connect()
  const { rows } = await client.query('SELECT * FROM tasks')
  await client.end()
  res.send(rows)
})

const port = 3000
app.listen(port, () => {
  console.log(`server started... localhost:${port}`)
})