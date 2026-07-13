import clsx from "clsx";

import s from "./Text.module.scss";

type TextProps = {
  className: string;
  text: string | null;
};

const Text = (props: TextProps) => {
  const { className, text } = props;

  return <div className={clsx(s.root, className)}>{text}</div>;
};

Text.displayName = "Text";

export default Text;
