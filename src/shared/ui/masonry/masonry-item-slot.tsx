"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

type MasonryItemSlotProps = {
  id: string;
  className?: string;
  children: ReactNode;
  register: (id: string, node: HTMLElement | null) => void;
};

export const MasonryItemSlot = (props: MasonryItemSlotProps) => {
  const { id, className, children, register } = props;
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    register(id, ref.current);
    return () => register(id, null);
  }, [id, register]);

  return (
    <div ref={ref} className={className} data-flip-id={id} data-masonry-id={id}>
      {children}
    </div>
  );
};

MasonryItemSlot.displayName = "MasonryItemSlot";
