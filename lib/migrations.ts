import { getCurrentTimestamp } from "./utils.ts";
import { resolve } from "node:path";
import { Glob } from "bun";

export type AppliedMigration = {
  fileName: string;
  hash: string;
};

export const generateMigration = async (summary: string, path: string) => {
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

export const getMigrationFilenames = async (migrations: string) => {
  const glob = new Glob("*.sql");
  const migrationFileNames = [];

  for await (const fileName of glob.scan(resolve(process.cwd(), migrations))) {
    migrationFileNames.push(fileName);
  }

  return migrationFileNames;
};
