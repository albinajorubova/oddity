import {
  Children,
  cloneElement,
  type ElementType,
  memo,
  type ReactElement,
  type ReactNode,
} from "react";
import clsx from "clsx";
import htmlReactParser from "html-react-parser";

import { getWordsArray, hasHTMLTags } from "./utils";

import s from "./split-text.module.scss";

export type SplitTextProps = {
  children: ReactNode;
  type?: "char" | "word";
  tag?: ElementType;
  debug?: boolean;
};

type SplitChildProps = {
  className?: string;
  children?: ReactNode;
  "data-split"?: boolean;
};

export const SplitText = memo(
  ({ children, type = "word", tag: Tag = "span", debug }: SplitTextProps) => {
    if (debug) {
      console.log(children);
    }

    if (children === "\u00A0" || children === " ") {
      return " ";
    }

    if (typeof children === "string") {
      const childIsHtml = hasHTMLTags(children);

      if (childIsHtml) {
        return (
          <SplitText type={type} tag={Tag}>
            {htmlReactParser(children)}
          </SplitText>
        );
      }

      return getWordsArray(children, type).map((el, iWord) => {
        if (!el) return null;

        if (el === "\u00A0" || el === " ") {
          return " ";
        }

        return (
          <Tag
            className={clsx(s.word, "word")}
            // biome-ignore lint/suspicious/noArrayIndexKey: text split is stable, order doesn't change
            key={`word_${iWord}`}
          >
            {Array.isArray(el) ? (
              el.map((elInner, iEl) => (
                <Tag
                  // biome-ignore lint/suspicious/noArrayIndexKey: character split is stable
                  key={`char_${iEl}`}
                  className={clsx(s.char, "char char1")}
                >
                  {elInner}
                </Tag>
              ))
            ) : (
              <Tag className={clsx(s.char, "char char2")}>{el}</Tag>
            )}
          </Tag>
        );
      });
    }

    return Children.map(children, (child) => {
      if (!child) return null;

      if (typeof child === "string") {
        return (
          <SplitText type={type} tag={Tag}>
            {child}
          </SplitText>
        );
      }

      const element = child as ReactElement<SplitChildProps>;

      if (element.props["data-split"] === false) {
        return element;
      }

      if (element.props.children) {
        return cloneElement(
          element,
          {
            className: clsx(element.props.className),
          },
          <SplitText type={type} tag={Tag}>
            {element.props.children}
          </SplitText>,
        );
      }

      return cloneElement(element, {
        className: clsx(element.props.className, "word-elem"),
      });
    });
  },
);
