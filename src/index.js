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
  const show_all = req.query.show_all
  const condition = !show_all || show_all === 'true' ? '' : ' WHERE is_done = false'
  const { rows } = await query('SELECT id, title, is_done FROM tasks' + condition)
  const error = req.query.error || ""
  res.render('index', { rows, error, show_all })
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
  // 0) show_all 값 가져오기
  const show_all = req.body.show_all
  // 1) If문으로 URL에 tasks?show_all가 있는지 검사
  // 2) 있으면 /tasks?show_all=false 혹은 /tasks?show_all=true 페이지로 넘기기
  // 3) 없으면 /tasks로 넘기기
  const q = show_all ? `?show_all=${show_all}` : ''
  const id = req.body.id
  const is_done = req.body.is_done === 'true' ? 'false' : 'true'
  query(`UPDATE tasks SET is_done = ${is_done} WHERE id = ${id}`)
  .then(() => {
    res.redirect('/tasks' + q)
  })
  .catch(err => console.log(err))
})

const port = 3000
app.listen(port, () => {
  console.log(`server started... localhost:${port}`)
})
