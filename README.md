## Setting up the project

```bash
npm install
```

## Running the server

```bash
npm start
```

- with database settings

```bash
DB_DATABASE=postgres DB_USER=postgres DB_PASSWORD=postgres npm start
```

## Setting up the database

This todo list uses PostgreSQL as its primary DBMS. <br>
Use [pgAdmin4](https://www.codementor.io/@engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb#2-pgadmin-httpswwwpgadminorg) for PostgreSQL GUI. <br>
To start the project, set up the database as follows:

### Recommended schema

Todo list uses the following schema:

| PK  | id serial                                                                     |
| --- | ----------------------------------------------------------------------------- |
|     | title VARCHAR <br> is_done BOOLEAN <br> created_at DATE <br> modified_at DATE |

### Create User Table

For user log-in & sign-up management

```sql
CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL
      )
```

### Create table

Run the following query to create a tasks table:

*(Create `users` Table first if you don't have it yet)*
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title character varying (50) NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT false,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    modified_at DATE,
    user_id UUID REFERENCES users(id)
)
```

### Inserting new tasks

Columns such as `is_done` and `created_at` are filled in by default. You can insert new tasks as simply as running by following query:

```sql
INSERT INTO tasks (title)
VALUES ('Work on todo list project');
```

### Retrieving the list of tasks

To see the list of tasks you have inserted:

```sql
SELECT * from tasks
```

### Create Session table

For setting up session & cookies

```sql
CREATE TABLE "sessions" (
    "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
```
