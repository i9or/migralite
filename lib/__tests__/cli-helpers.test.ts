import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  mock,
  beforeEach,
} from "bun:test";

import {
  parseCliArguments,
  printHelpMessage,
  printVersion,
  reportResult,
} from "../cli-helpers.ts";

describe("utils", () => {
  const consoleInfo = mock();
  let originalConsole: typeof console;

  beforeAll(() => {
    originalConsole = console;
    console.info = consoleInfo;
  });

  afterAll(() => {
    console.info = originalConsole.info;
  });

  beforeEach(() => {
    consoleInfo.mockReset();
  });

  describe("reportResult", () => {
    it("should report how many migrations were applied", () => {
      reportResult(123);

      expect(consoleInfo).toBeCalledWith(
        "Successfully applied 123 migration(s)!",
      );
    });

    it("should report no migrations were applied", () => {
      reportResult(0);

      expect(consoleInfo).toBeCalledWith("No migrations were applied");
    });
  });

  describe("parseCliArguments", () => {
    it("should parse arguments", () => {
      const result = parseCliArguments([
        "path/to/bun",
        "cli.ts",
        "-d",
        "./db/main.sqlite",
        "-h",
        "-v",
        '-g "hello"',
      ]);

      expect(result).toStrictEqual({
        database: "./db/main.sqlite",
        generate: '"hello"',
        help: true,
        migrations: "./migrations",
        version: true,
      });
    });
  });

  describe("printHelpMessage", () => {
    printHelpMessage();

    expect(consoleInfo).toHaveBeenNthCalledWith(1, "Usage:");
    expect(consoleInfo).toHaveBeenNthCalledWith(
      2,
      "  --help, -h\t\tPrint this help message",
    );
    expect(consoleInfo).toHaveBeenNthCalledWith(
      3,
      "  --version, -v\t\tPrint version",
    );
    expect(consoleInfo).toHaveBeenNthCalledWith(
      4,
      "  --database, -d\tPath to the database, required",
    );
    expect(consoleInfo).toHaveBeenNthCalledWith(
      5,
      "  --migrations, -m\tPath to migrations folder, './migrations' by default",
    );
    expect(consoleInfo).toHaveBeenNthCalledWith(
      6,
      "  --generate, -g\tGenerate a migration file",
    );
  });

  describe("printVersion", () => {
    it("should print current version", () => {
      printVersion();

      expect(consoleInfo).toBeCalledWith(
        expect.stringMatching(
          /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
        ),
      );
    });
  });
});
