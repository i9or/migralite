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

TODO: in progress

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