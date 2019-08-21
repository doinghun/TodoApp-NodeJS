const express = require('express')
const query = require('./lib/pg')
const path = require('path')
const parser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

app.get('/', (_req, res) => {
  res.render('index');
})

app.get('/tasks', async (_req, res) => {
  const { rows } = await query('SELECT id, title FROM tasks')
  res.render('index', { rows } );
})

app.post('/tasks/add', (req,res) => {
  var task = {
    task : req.body.task
    }
  res.json(task);
})

const port = 3000
app.listen(port, () => {
  console.log(`server started... localhost:${port}`)
})