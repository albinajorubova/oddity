import Drag from "./Drag";
import DragLeft from "./DragLeft";
import Text from "./Text";

export const TYPES = [
  {
    key: "tip",
    component: Text,
  },
  {
    key: "drag",
    component: Drag,
  },
  {
    key: "drag-left",
    component: DragLeft,
  },
];
