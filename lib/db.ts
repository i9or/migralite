import { Database } from "bun:sqlite";
import { resolve } from "node:path";
import { type AppliedMigration, getMigrationFilenames } from "./migrations.ts";
import {
  allMigrationFileNamesAreValid,
  type NoParams,
  type NoReturn,
} from "./utils.ts";
import { reportResult } from "./cli.ts";

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

export const applyMigrations = async (database: string, migrations: string) => {
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
