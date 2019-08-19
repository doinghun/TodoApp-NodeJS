const { Pool } = require('pg')

const host = process.env.DB_HOST || 'localhost'
const database = process.env.DB_DATABASE || 'postgres'
const user = process.env.DB_USER || 'postgres'
const port = process.env.DB_PORT || 5432
const password = process.env.DB_PASSWORD || 'dohun1208'

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

module.exports = query
