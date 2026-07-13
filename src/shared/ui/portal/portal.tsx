import * as React from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  className?: string;
  id?: string;
  onMount?: () => void;
  children: React.ReactNode;
}

export const Portal: React.FC<PortalProps> = ({
  className,
  id = "snp-portal",
  onMount,
  children,
}) => {
  const ref = React.useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    let portal: HTMLElement;

    const existingPortal = document.getElementById(id);

    if (existingPortal) {
      portal = existingPortal;
    } else {
      portal = document.createElement("div");
      portal.id = id;
      document.body.appendChild(portal);
    }

    portal.className = className ?? "";
    ref.current = portal;
    setIsMounted(true);
  }, [className, id]);

  React.useEffect(() => {
    if (isMounted && onMount) onMount();
  }, [isMounted, onMount]);

  return isMounted && ref.current ? createPortal(children, ref.current) : null;
};

Portal.displayName = "Portal";
