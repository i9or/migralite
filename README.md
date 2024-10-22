# Migralite

Migralite is lightweight forward-only SQLite migration tool for Bun.

<img src="./migralite-logo.png" width="200" alt="Migralite Logo"/>

Key features:

- Simple \*.sql files as migration scripts
- Forward-only [^1]
- Runs on Bun
- CLI with sensible defaults, so there's no need to implement migration script
- Migration generator
- Version tracking — keeps track of applied migrations to prevent duplicate runs
- Migrations are wrapped in transactions by default

[^1]: https://nickcraver.com/blog/2016/05/03/stack-overflow-how-we-do-deployment-2016-edition/#database-migrations

## Usage

## Installation

Add CLI tool to the Bun based project:

```bash
bun add -d migralite
```

And then used via `package.json` scripts:

```json
{
  "scripts": {
    "db:migrate": "migralite --database ./path/to/db.sqlite"
  }
}
```

The tool could be used with `bunx` without adding it to the project:

```bash
bunx migralite --help
```

## Available commands

### Help

`--help` or `-h` — shows help in the terminal.

Example:

```bash
bunx migralite --help
```

### Version

`--version` or `-v` — shows current version of the CLI tool.

Example:

```bash
bunx migralite --version
```

### Database path

`--database` or `-d` — path to the SQLite database file.

Example:

```bash
bunx migralite -d ./db/main.sqlite
```

### Migrations path

`--migrations` or `-m` — path to the folder with SQL migration scripts, by default it's `./migrations` folder in the
root of the project.

Example:

```bash
bunx migralite -d ./db/main.sqlite -m ./db/migrations
```

### Migration file generation

`--generate` or `-g` — migration file generation mode. It accepts short summary of what migration script is doing to
generate migration name. The summary is added as a comment to the migration script.

Example:

```bash
bunx migralite -g "Create users table"
```

This will create a migration file in `./migrations` folder called `./migrations/20240815123456__create-users-table.sql`.

Only this filename format is accepted by the migration tool. Anything else will result in error and migrations won't
run.

## Use as a library

It's possible to use Migralite as a library:

```ts
import { Database } from "bun:sqlite";
import { applyMigrations } from "migralite";

const db = new Database(":memory:");

try {
    await applyMigrations(db, "./migrations");
} catch (err) {
    console.error(err);
}
```

Or connect to an existing DB file:

```ts
import { applyMigrations, connectToDatabase } from "migralite";

const db = connectToDatabase("./path/to/db");

try {
    await applyMigrations(db, "./migrations");
} catch (err) {
    console.error(err);
}
```

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run cli.ts
```

## Contributions

Please raise an issue first and let's discuss. 
This project is pretty much done, but I am still open for some sensible contributions.

## Attributions

Logo by https://www.behance.net/garnenka

## License

Code is distributed under the MIT License.
