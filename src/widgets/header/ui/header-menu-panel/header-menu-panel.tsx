"use client";

import clsx from "clsx";

import { Button } from "@shared/ui/button";
import { HOME_NAV_STUB } from "@/_pages/home/model";

import s from "./header-menu-panel.module.scss";

export type HeaderMenuPanelProps = {
  onNavigate?: () => void;
};

export const HeaderMenuPanel = (props: HeaderMenuPanelProps) => {
  const { onNavigate } = props;

  return (
    <div className={s.root} data-header-menu-inner>
      {HOME_NAV_STUB.map((item) => (
        <Button
          key={item.href}
          href={item.href}
          className={clsx(s.item, "typo-h2")}
          data-header-nav-item
          onClick={onNavigate}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

HeaderMenuPanel.displayName = "HeaderMenuPanel";
