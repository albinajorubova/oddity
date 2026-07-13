export type ResizeCallback = () => void;

export type ResizeCallbackItem = {
  callback: ResizeCallback;
  priority: number;
};

export type ResizeCallbacks = ResizeCallbackItem[];

export type ResizeContextType = {
  addCallback: (callback: ResizeCallback, priority: number) => void;
  removeCallback: (callback: ResizeCallback) => void;
};
