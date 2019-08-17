## How to set up

```bash
npm install
```

## How to develop

```bash
npm dev
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
CREATE TABLE IF NOT EXISTS `todos` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `is_done` BOOLEAN NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `modified_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)
```