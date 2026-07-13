export type CursorType = "default" | "grab";

export interface MouseData {
  x: number;
  y: number;
}

export type MouseCallback = (data: MouseData) => void;
