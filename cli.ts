#!/usr/bin/env bun

import {
  parseCliArguments,
  printHelpMessage,
  printVersion,
} from "./lib/cli-helpers.ts";
import { stringIsNotUndefinedOrEmpty } from "./lib/utils.ts";
import { generateMigration } from "./lib/migrations.ts";
import { applyMigrations, connectToDatabase } from "./lib/db.ts";

const migrate = async () => {
  const { generate, migrations, database, help, version } = parseCliArguments(
    Bun.argv,
  );

  if (version) {
    printVersion();

    return;
  }

  if (help) {
    printHelpMessage();

    return;
  }

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

  await applyMigrations(connectToDatabase(database), migrations);
};

try {
  await migrate();
} catch (e) {
  console.error(e);
  process.exit(1);
}
