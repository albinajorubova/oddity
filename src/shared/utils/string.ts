export const _pad = (x: number, width = 0) => {
  return String(x).padStart(width, "0");
};

export const toCamelCaseAdvanced = (str: string): string => {
  if (!str || str.length === 0) {
    return str;
  }

  // Разделяем строку по разделителям (пробелы, дефисы, подчеркивания)
  const words = str.split(/[-_\s]+/).filter((word) => word.length > 0);

  if (words.length === 0) {
    return str;
  }

  // Первое слово в нижнем регистре, остальные с заглавной первой буквой
  const camelWords = words.map((word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return camelWords.join("");
};
