import { version as packageVersion } from "../package.json";
import { parseArgs } from "util";

export const parseCliArguments = (args: string[]) => {
  const { values } = parseArgs({
    args,
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
      help: {
        type: "boolean",
        short: "h",
      },
      version: {
        type: "boolean",
        short: "v",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  return {
    database: values.database?.trim(),
    generate: values.generate?.trim(),
    help: values.help,
    version: values.version,
    migrations: values.migrations?.trim(),
  };
};

export const reportResult = (numberOfAppliedMigrations: number) => {
  if (numberOfAppliedMigrations > 0) {
    console.info(
      `Successfully applied ${numberOfAppliedMigrations} migration(s)!`,
    );
  } else {
    console.info("No migrations were applied");
  }
};

export const printHelpMessage = () => {
  console.info("Usage:");
  console.info("  --help, -h\t\tPrint this help message");
  console.info("  --version, -v\t\tPrint version");
  console.info("  --database, -d\tPath to the database, required");
  console.info(
    "  --migrations, -m\tPath to migrations folder, './migrations' by default",
  );
  console.info("  --generate, -g\tGenerate a migration file");
};

export const printVersion = () => {
  console.info(packageVersion);
};
