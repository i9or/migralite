/* eslint-disable no-console */
import { resolve } from "node:path";

import { Glob } from "bun";
import { Database } from "bun:sqlite";
import { parseArgs } from "util";

type NoParams = never[];
type NoReturn = never;

type AppliedMigration = {
  fileName: string;
  hash: string;
};

const stringIsNotUndefinedOrEmpty = (
  value: string | undefined,
): value is string => {
  return value !== undefined && value !== "";
};

const getCurrentTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const generateMigration = async (summary: string, path: string) => {
  const name = summary
    .match(/([a-z0-9])+/gi)
    ?.join("-")
    .toLowerCase();

  if (!name) {
    throw new Error("Failed to generate migration");
  }

  const timestamp = getCurrentTimestamp();
  const fileName = `${timestamp}__${name}.sql`;
  const filePath = resolve(process.cwd(), path, fileName);
  const contents = `-- ${summary}\n`;

  await Bun.write(filePath, contents);

  console.info(`Migration ${fileName} generated successfully`);
};

const allMigrationFileNamesAreValid = (migrationFileNames: string[]) => {
  const migrationFileNameRegex = new RegExp(/^\d{14}__([a-z-])+\.sql$/);

  return migrationFileNames.map((fileName) => {
    return migrationFileNameRegex.test(fileName);
  });
};

const createMigrationsTable = (db: Database) => {
  db.run(
    `create table if not exists __migrations__
     (
       id          integer primary key,
       file_name   text not null unique,
       hash        text not null,
       executed_at text not null default (datetime())
     )`,
  );
};

const parseCliArguments = () => {
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      migrations: {
        type: "string",
        default: "./migrations",
        short: "m",
      },
      database: {
        type: "string",
        short: "d",
      },
      generate: {
        type: "string",
        short: "g",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  return values;
};

const reportResult = (numberOfAppliedMigrations: number) => {
  if (numberOfAppliedMigrations > 0) {
    console.info(
      `Successfully applied ${numberOfAppliedMigrations} migrations!`,
    );
  } else {
    console.info("No migrations were applied");
  }
};

const connectToDatabase = (databasePath: string) => {
  const dbPath = resolve(process.cwd(), databasePath);

  return new Database(dbPath, { strict: true, create: true });
};

const resolveAppliedMigrations = (db: Database) => {
  const appliedMigrations = db
    .prepare<
      AppliedMigration,
      NoParams
    >(`select file_name as fileName, hash from __migrations__;`)
    .all();

  const fileNameToHash = new Map<string, string>();
  appliedMigrations.forEach((migration) => {
    fileNameToHash.set(migration.fileName, migration.hash);
  });

  return fileNameToHash;
};

const getMigrationFilenames = async (migrations: string) => {
  const glob = new Glob("*.sql");
  const migrationFileNames = [];

  for await (const fileName of glob.scan(resolve(process.cwd(), migrations))) {
    migrationFileNames.push(fileName);
  }

  return migrationFileNames;
};

const applyMigrations = async (database: string, migrations: string) => {
  const db = connectToDatabase(database);

  createMigrationsTable(db);

  // Query __migrations__ table to find out which migrations were already applied
  const appliedMigrations = resolveAppliedMigrations(db);

  // Get migrations files list from the migrations folder
  const migrationFileNames = await getMigrationFilenames(migrations);

  if (allMigrationFileNamesAreValid(migrationFileNames)) {
    migrationFileNames.sort();

    // Read files one by one and apply migration to the database
    const insertSuccessfulMigration = db.prepare<NoReturn, [string, string]>(
      `insert into __migrations__ (file_name, hash)
           values ($1, $2);`,
    );

    let numberOfAppliedMigrations = 0;
    for (const fileName of migrationFileNames) {
      const path = resolve(process.cwd(), migrations, fileName);
      const file = Bun.file(path);
      const content = await file.text();
      const hash = Bun.hash(content).toString();

      if (appliedMigrations.has(fileName)) {
        const appliedMigrationHash = appliedMigrations.get(fileName);

        if (appliedMigrationHash !== hash) {
          throw new Error(
            `Migration: ${fileName}\nFile hash: ${hash}\nApplied hash: ${appliedMigrationHash}\nHash does not match the hash of already applied migration with the same name`,
          );
        }

        console.info(`Skipped: ${fileName}`);
      } else {
        db.transaction(() => {
          db.run(content);
          insertSuccessfulMigration.run(fileName, hash);
        })();

        console.info(`Applied: ${fileName}`);
        numberOfAppliedMigrations++;
      }
    }

    reportResult(numberOfAppliedMigrations);
  }
};

const migrate = async () => {
  const { generate, migrations, database } = parseCliArguments();

  if (!migrations) {
    throw new Error("Migrations path is not specified");
  }

  console.info(`Using migrations at ${migrations}`);

  // Migration file generation
  if (stringIsNotUndefinedOrEmpty(generate)) {
    await generateMigration(generate, migrations);

    return;
  }

  if (!database) {
    throw new Error("Database path is not defined");
  }

  await applyMigrations(database, migrations);
};

try {
  await migrate();
} catch (e) {
  console.error(e);
}
