"use client";

import clsx from "clsx";

import s from "./profile-header.module.scss";

export type ProfileHeaderProps = {
  className?: string;
  role: string;
  established: string;
};

export const ProfileHeader = (props: ProfileHeaderProps) => {
  const { className, role, established } = props;

  return (
    <header className={clsx(s.root, className)}>
      <h1 className={clsx(s.title, "typo-h1")}>PROFILE</h1>
      <p className={clsx(s.kicker, "typo-micro")}>
        {role} · EST. {established}
      </p>
    </header>
  );
};

ProfileHeader.displayName = "ProfileHeader";
