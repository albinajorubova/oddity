type StylesMap = Record<string, string>;
type ModsMap = Record<string, string | undefined>;

export const mod = (styles: StylesMap, mods: ModsMap): string[] => {
  return Object.keys(mods).flatMap((key) => {
    const modValue = mods[key];
    if (!modValue) return [];

    return modValue
      .split("-")
      .reduce<string[]>(
        (acc, cur) => {
          acc.push(`${acc[acc.length - 1]}-${cur}`);
          return acc;
        },
        [key],
      )
      .map((el) => styles[el])
      .filter(Boolean); // на случай, если styles[el] undefined
  });
};
