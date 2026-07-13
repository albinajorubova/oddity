import clsx from "clsx";

import s from "./Drag.module.scss";

type DragProps = {
  className: string;
};

const Drag = (props: DragProps) => {
  const { className } = props;

  return <div className={clsx(s.root, className)}>drag</div>;
};

Drag.displayName = "Drag";

export default Drag;
