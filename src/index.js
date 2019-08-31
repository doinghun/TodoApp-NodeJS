const express = require('express')
const query = require('./lib/pg')
const path = require('path')
const parser = require('body-parser')
const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())

app.use('/scripts', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/')))

app.get('/', (_req, res) => {
  res.render('index')
})

app.get('/tasks', async (req, res) => {
  const { rows } = await query('SELECT id, title, is_done FROM tasks')
  const error = req.query.error || ""
  res.render('index', { rows, error } )
})

app.post('/tasks/add', (req, res) => {
  const task = req.body.task
  if (task.trim() === "") {
    res.redirect('/tasks?error=Please+type+your+value')
  } else {
    query(`INSERT INTO tasks (title) VALUES ('${task}')`)
    .then(() => {
      res.redirect('/tasks')
    })
    .catch(err => console.log(err))
}})

app.post('/tasks/delete',(req,res) => {
  const id = req.body.id;
  query(`DELETE FROM tasks WHERE id = ${id}`)
  .then(() => {
    res.redirect('/tasks')
  })
  .catch(err => console.log(err))
})

app.post('/tasks/update', (req,res) => {
  const id = req.body.id;
  query(`UPDATE tasks SET is_done = true WHERE id = ${id} AND is_done = false`)
  .then(() => {
    res.redirect('/tasks')
  })
  .catch(err => console.log(err))
})

const port = 3000
app.listen(port, () => {
  console.log(`server started... localhost:${port}`)
})
