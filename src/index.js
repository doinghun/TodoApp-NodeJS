const express = require("express")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const pg = require("./lib/pg")
const query = pg.query
const pgPool = pg.pgPool
const path = require("path")
const parser = require("body-parser")
const uuidv4 = require("uuid/v4")
const bcrypt = require("bcrypt")
const flash = require("connect-flash")
const db = require("./lib/queries")

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())

app.use(flash())
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "sessions"
    }),
    secret: "my secret",
    resave: false,
    saveUninitialized: false
  })
)

app.use("/scripts", express.static(path.join(__dirname, "../node_modules/")))
app.use("/static", express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
  res.render("index", {
    isAuthenticated: req.session.isLoggedIn,
    messages: {
      danger: req.flash("danger"),
      warning: req.flash("warning"),
      success: req.flash("success")
    }
  })
})

app.get("/tasks", async (req, res) => {
  if (!req.session.isLoggedIn) {
    req.flash("danger", "Please Log In")
    return res.redirect("/login")
  }
  const user_id = req.session.user.rows[0].id
  const show_all = req.query.show_all || "true"
  const { rows } = await query(
    `SELECT id, title, is_done FROM tasks WHERE user_id = '${user_id}' ORDER BY id `
  )
  const error = req.query.error || ""
  res.render("todos", {
    rows,
    error,
    show_all,
    isAuthenticated: req.session.isLoggedIn,
    messages: {
      danger: req.flash("danger"),
      warning: req.flash("warning"),
      success: req.flash("success")
    }
  })
})

app.post("/tasks/add", (req, res) => {
  const task = req.body.task
  const user_id = req.session.user.rows[0].id
  if (task.trim() === "") {
    res.redirect("/tasks?error=Please+type+your+value")
  } else {
    query(`INSERT INTO tasks (title, user_id) VALUES ('${task}', '${user_id}')`)
      .then(() => {
        res.redirect("/tasks")
      })
      .catch(err => console.log(err))
  }
})

app.post("/tasks/delete", (req, res) => {
  const id = req.body.id
  query(`DELETE FROM tasks WHERE id = ${id}`)
    .then(() => {
      res.redirect("/tasks")
    })
    .catch(err => console.log(err))
})

app.post("/tasks/update", (req, res) => {
  const id = req.body.id
  const is_done = req.body.is_done ? true : false
  query(`UPDATE tasks SET is_done = ${is_done} WHERE id = ${id}`)
    .then(() => {
      res.redirect("/tasks")
    })
    .catch(err => console.log(err))
})

app.get("/login", (req, res) => {
  console.log(req.session.isLoggedIn)
  res.render("login", {
    isAuthenticated: req.session.isLoggedIn,
    messages: {
      danger: req.flash("danger"),
      warning: req.flash("warning"),
      success: req.flash("success")
    }
  })
})

app.post("/login", async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  query(`SELECT id, email, password FROM users WHERE email = '${email}'`)
    .then(user => {
      if (!user.rows.length) {
        req.flash("danger", "Oops. Incorrect login details.")
        res.redirect("/login")
      }
      bcrypt
        .compare(password, user.rows[0].password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(err => {
              console.log(err)
              res.redirect("/tasks")
            })
          }
          req.flash("danger", "Password is incorrect")
          res.redirect("/login")
        })
        .catch(err => {
          console.log(err)
          res.redirect("/login")
        })
    })
    .catch(err => console.log(err))
})

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect("/tasks")
  })
})

app.get("/signup", (req, res) => {
  res.render("signup", {
    isAuthenticated: req.session.isLoggedIn,
    messages: {
      danger: req.flash("danger"),
      warning: req.flash("warning"),
      success: req.flash("success")
    }
  })
})

app.post("/signup", (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const hashedPassword = bcrypt.hashSync(password, 12)
  query(
    `INSERT INTO users (id, email, password) VALUES ('${uuidv4()}','${email}','${hashedPassword}')`
  )
    .then(() => {
      res.redirect("/login")
    })
    .catch(err => console.log(err))
})

/*-----Using Axios on browser to interact with REST api endpoint-----*/

app.get("/tasks/axios", (req, res) => {
  if (!req.session.isLoggedIn) {
    req.flash("danger", "Please Log In")
    return res.redirect("/login")
  }
  const error = req.query.error || ""
  res.render("index-axios", {
    error,
    isAuthenticated: req.session.isLoggedIn
  })
})

app.get("/api/tasks", db.getTasks)
app.get("/api/tasks/:id", db.getTaskById)
app.post("/api/tasks", db.createTask)
app.put("/api/tasks/:id", db.updateTask)
app.delete("/api/tasks/:id", db.deleteTask)

const port = 3000
app.listen(port, () => {
  console.log(`server started... localhost:${port}`)
})
