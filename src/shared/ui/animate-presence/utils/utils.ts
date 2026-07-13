import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

export type ComponentKey = string | number;

export const getChildKey = (child: ReactElement): ComponentKey =>
  (child.key ?? "") as ComponentKey;

export function onlyElements(children: ReactNode): ReactElement[] {
  const filtered: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child)) filtered.push(child);
  });
  return filtered;
}
