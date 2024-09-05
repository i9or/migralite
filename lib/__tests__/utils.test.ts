import { describe, expect, it } from "bun:test";
import {
  allMigrationFileNamesAreValid,
  getCurrentTimestamp,
  stringIsNotUndefinedOrEmpty,
} from "../utils.ts";

describe("utils", () => {
  describe("stringIsNotUndefinedOrEmpty", () => {
    it("returns true for defined non-empty string", () => {
      expect(stringIsNotUndefinedOrEmpty("hello")).toBe(true);
    });

    it("returns false for empty string or undefined value", () => {
      expect(stringIsNotUndefinedOrEmpty(undefined)).toBe(false);
      expect(stringIsNotUndefinedOrEmpty("")).toBe(false);
      expect(stringIsNotUndefinedOrEmpty(" ")).toBe(false);
      expect(stringIsNotUndefinedOrEmpty("   ")).toBe(false);
    });
  });

  describe("getCurrentTimestamp", () => {
    it("returns a timestamp-like string", () => {
      const result = getCurrentTimestamp();

      expect(result).toMatch(/^\d{14}$/);
    });
  });

  describe("allMigrationFilenamesAreValid", () => {
    it("should return true for valid migration filenames", () => {
      const validFileNames = [
        "12345678901234__hello-migration.sql",
        "12345678901234__word.sql",
        "12345678901234__a.sql", // single letter is also valid
      ];

      expect(allMigrationFileNamesAreValid(validFileNames)).toBe(true);
    });

    it("should return false for invalid migration filenames", () => {
      expect(allMigrationFileNamesAreValid([""])).toBe(false);
      expect(allMigrationFileNamesAreValid(["123"])).toBe(false);
      expect(allMigrationFileNamesAreValid(["hello"])).toBe(false);
      expect(
        allMigrationFileNamesAreValid(["12348901234__hello-migration.sql"]),
      ).toBe(false);
      expect(allMigrationFileNamesAreValid(["12345678901234word.sql"])).toBe(
        false,
      );
      expect(allMigrationFileNamesAreValid(["12345678901234__a"])).toBe(false);
    });
  });
});
