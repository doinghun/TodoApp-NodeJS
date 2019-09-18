const express = require('express')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const pg = require('./lib/pg')
const query = pg.query
const pgPool = pg.pgPool
const path = require('path')
const parser = require('body-parser')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())

app.use(session({
  store: new pgSession({
    pool : pgPool,
    tableName: 'sessions'
  }),
  secret: 'my secret',
  resave: false,
  saveUninitialized: false
  }))

app.use('/scripts', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/')))

app.get('/', (_req, res) => {
  res.render('index')
})

app.get('/tasks', async (req, res) => {
  const show_all = req.query.show_all || "true"
  const { rows } = await query('SELECT id, title, is_done FROM tasks ORDER BY id ')
  const error = req.query.error || ""
  res.render('index', { rows, error, show_all, isAuthenticated: req.session.isLoggedIn} )
})

app.post('/tasks/add', (req, res) => {
  const task = req.body.task
  if (task === "") {
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
  const is_done = req.body.is_done ? true : false;
  query(`UPDATE tasks SET is_done = ${is_done} WHERE id = ${id}`)
  .then(() => {
    res.redirect('/tasks')
  })
  .catch(err => console.log(err))
})

app.get('/login', (req, res) => {
  console.log(req.session.isLoggedIn)
  res.render('login', { isAuthenticated: req.session.isLoggedIn })
})

app.post('/login', (req,res)=> {
  req.session.isLoggedIn = true;
  res.redirect('/tasks')
})

app.post('/logout', (req,res)=>{
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/tasks')
  });
})
const port = 3000
app.listen(port, () => {
  console.log(`server started... localhost:${port}`)
})
