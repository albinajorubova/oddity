import clsx from "clsx";

import s from "./DragLeft.module.scss";

type DragProps = {
  className: string;
};

const DragLeft = (props: DragProps) => {
  const { className } = props;

  return <div className={clsx(s.root, className)}>drag left</div>;
};

DragLeft.displayName = "DragLeft";

export default DragLeft;
