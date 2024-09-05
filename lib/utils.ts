export type NoParams = never[];
export type NoReturn = never;

export const stringIsNotUndefinedOrEmpty = (
  value: string | undefined,
): value is string => {
  return value !== undefined && value !== "" && value.trim() !== "";
};

export const getCurrentTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

export const allMigrationFileNamesAreValid = (migrationFileNames: string[]) => {
  const migrationFileNameRegex = new RegExp(/^\d{14}__([a-z-])+\.sql$/);

  return migrationFileNames.every((fileName) => {
    return migrationFileNameRegex.test(fileName);
  });
};
