const express = require('express');
const { Client } = require('pg');
const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/tasks', async (req,res) => {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'dohun1208',
      port: 5432
  })
  await client.connect()
  const { rows } = await client.query('SELECT * FROM "Article"')
  await client.end()
  res.send(rows)
})

const port = 3000
app.listen(port, () => {
  console.log(`server started... localhost:${port}`)
})