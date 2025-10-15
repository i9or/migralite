import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  spyOn,
  beforeEach,
} from "bun:test";

import {
  parseCliArguments,
  printHelpMessage,
  printVersion,
  reportResult,
} from "../cli-helpers.ts";

describe("utils", () => {
  const consoleInfoSpy = spyOn(console, "info");

  beforeEach(() => {
    consoleInfoSpy.mockClear();
  });

  describe("reportResult", () => {
    it("should report how many migrations were applied", () => {
      reportResult(123);

      expect(consoleInfoSpy).toBeCalledWith(
        "Successfully applied 123 migration(s)!",
      );
    });

    it("should report no migrations were applied", () => {
      reportResult(0);

      expect(consoleInfoSpy).toBeCalledWith("No migrations were applied");
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

    expect(consoleInfoSpy).toHaveBeenNthCalledWith(1, "Usage:");
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(
      2,
      "  --help, -h\t\tPrint this help message",
    );
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(
      3,
      "  --version, -v\t\tPrint version",
    );
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(
      4,
      "  --database, -d\tPath to the database, required",
    );
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(
      5,
      "  --migrations, -m\tPath to migrations folder, './migrations' by default",
    );
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(
      6,
      "  --generate, -g\tGenerate a migration file",
    );
  });

  describe("printVersion", () => {
    it("should print current version", () => {
      printVersion();

      expect(consoleInfoSpy).toBeCalledWith(
        expect.stringMatching(
          /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
        ),
      );
    });
  });
});
