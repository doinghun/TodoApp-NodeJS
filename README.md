## How to set up

```bash
npm install
```

## How to develop

```bash
npm start
```

## Database Structure
|id         |
|-----------|
|title      |
|is_done    |
|created_at |
|modified_at| 

### Creating the database

```sql
CREATE DATABASE todo;
CREATE TABLE IF NOT EXISTS "tasks" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "is_done" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "modified_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

```