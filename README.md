# Migralite

Migralite is lightweight forward-only SQLite migration tool for Bun.

Key features:

* Simple *.sql files as migration scripts
* Forward-only [^1]
* Runs on Bun
* CLI with sensible defaults, so there's no need to implement migration script
* Migration generator
* Version tracking — keeps track of applied migrations to prevent duplicate runs
* Migrations are wrapped in transactions by default

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
````

### Migrations path

`--migrations` or `-m` — path to the folder with SQL migration scripts, by default it's `./migrations` folder in the root of the project.

Example:

```bash
bunx migralite -d ./db/main.sqlite -m ./db/migrations
```

### Migration file generation

`--generate` or `-g` — migration file generation mode. It accepts short summary of what migration script is doing to generate migration name. The summary is added as a comment to the migration script.

Example:

```bash
bunx migralite -g "Create users table"
```

This will create a migration file in `./migrations` folder called `./migrations/20240815123456__create-users-table.sql`.

Only this filename format is accepted by the migration tool. Anything else will result in error and migrations won't run.

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Contributions

Please don't.

## License

Code is distributed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3 only.

<img src="./AGPLv3_Logo.svg" width="100" alt="AGPLv3 Logo"/>