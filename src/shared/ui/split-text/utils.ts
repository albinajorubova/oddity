type Consumer<T> = (item: T, index: number, array: T[]) => void;

const each = <T>(
  items: T[] | null | undefined,
  consumer: Consumer<T>,
): void => {
  if (items) {
    items.forEach(consumer);
  }
};

const regexList: Record<"word" | "char", string | RegExp> = {
  word: /\u0020/,
  char: "", // пустая строка для разделения на символы
};

export const splitter = (
  children: string,
  key: "word" | "char" = "word",
): string[] => {
  if (typeof children !== "string") return [];

  children = children.normalize();

  const elements: string[] = [];

  each(children.split(regexList[key] as string | RegExp), (splitText) => {
    elements.push(splitText);
  });

  return elements;
};

export const getWordsArray = (
  children: string,
  key: "word" | "char" = "word",
  preserveWhitespace = true,
): (string | string[])[] => {
  const elements: (string | string[])[] = [];
  const startElements = splitter(children, "word");

  if (key === "word") {
    return startElements.reduce<string[]>((acc, cur, i) => {
      if (i !== startElements.length - 1) {
        acc.push(`${cur}`, "\u00A0"); // неразрывный пробел
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);
  }

  each(startElements, (word, i) => {
    const chars = splitter(word, "char");

    if (startElements.length - 1 !== i && preserveWhitespace) {
      chars.push("\u00A0");
    }

    elements.push(chars);
  });

  return elements;
};

export const hasHTMLTags = (input: string): boolean => {
  const htmlRegex = /<\/?([A-Za-z][A-Za-z0-9]*)(\s+[^>]*)?>/;
  return htmlRegex.test(input);
};
