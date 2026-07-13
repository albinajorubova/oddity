import ArrowDiagonalRight from "public/icons/arrow-diagonal-right.svg";
import ArrowDown from "public/icons/arrow-down.svg";
import ArrowLeft from "public/icons/arrow-left.svg";
import ArrowRight from "public/icons/arrow-right.svg";
import ArrowUp from "public/icons/arrow-up.svg";
import Check from "public/icons/check.svg";
import ChevronDown from "public/icons/chevron-down.svg";
import ChevronUp from "public/icons/chevron-up.svg";
import Close from "public/icons/close.svg";
import CloseBurg from "public/icons/close-burg.svg";
import Document from "public/icons/document.svg";
import Document2 from "public/icons/document-2.svg";
import Document3 from "public/icons/document-3.svg";
import Menu from "public/icons/menu.svg";
import Minus from "public/icons/minus.svg";
import Plus from "public/icons/plus.svg";
import Search from "public/icons/search.svg";
import Warning from "public/icons/warn.svg";

// Соберите карту доступных иконок:
export const ICONS = {
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "arrow-diagonal-right": ArrowDiagonalRight,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  check: Check,
  close: Close,
  "close-burg": CloseBurg,
  document: Document,
  "document-2": Document2,
  "document-3": Document3,
  menu: Menu,
  minus: Minus,
  plus: Plus,
  search: Search,
  warn: Warning,
} as const;

export type IconName = keyof typeof ICONS;
