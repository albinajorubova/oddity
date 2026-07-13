export const deepEqual = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) {
    return true;
  }

  if (
    obj1 == null ||
    typeof obj1 !== "object" ||
    obj2 == null ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1 as Record<string, unknown>);
  const keys2 = Object.keys(obj2 as Record<string, unknown>);

  if (keys1.length !== keys2.length) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys1) {
    const record1 = obj1 as Record<string, unknown>;
    const record2 = obj2 as Record<string, unknown>;

    if (key === "children") {
      return record1[key] === record2[key];
    }

    if (!keys2.includes(key) || !deepEqual(record1[key], record2[key])) {
      return false;
    }
  }

  return true;
};
