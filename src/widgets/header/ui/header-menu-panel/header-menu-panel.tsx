"use client";

import { useUser } from "@app/model/user-provider";
import clsx from "clsx";

import { isAdmin } from "@entities/user";

import { ROUTES } from "@shared/config";
import { Button } from "@shared/ui/button";
import { HOME_NAV_STUB } from "@/_pages/home/model";

import s from "./header-menu-panel.module.scss";

export type HeaderMenuPanelProps = {
  onNavigate?: () => void;
};

export const HeaderMenuPanel = (props: HeaderMenuPanelProps) => {
  const { onNavigate } = props;
  const { user, isAuthenticated, logout } = useUser();

  const handleLogout = async () => {
    onNavigate?.();
    await logout();
  };

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

      <div className={s.auth}>
        {!isAuthenticated ? (
          <Button
            href={ROUTES.login}
            className={clsx(s.item, "typo-h2")}
            data-header-nav-item
            onClick={onNavigate}
          >
            SIGN IN
          </Button>
        ) : (
          <>
            <Button
              href={ROUTES.profile}
              className={clsx(s.item, "typo-h2")}
              data-header-nav-item
              onClick={onNavigate}
            >
              PROFILE
            </Button>
            {isAdmin(user) && (
              <Button
                href={ROUTES.admin}
                className={clsx(s.item, "typo-h2")}
                data-header-nav-item
                onClick={onNavigate}
              >
                ADMIN
              </Button>
            )}
            <Button
              type="button"
              className={clsx(s.item, "typo-h2")}
              data-header-nav-item
              onClick={handleLogout}
            >
              LOG OUT
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

HeaderMenuPanel.displayName = "HeaderMenuPanel";
