"use client";

import { type FormEvent, useState } from "react";
import clsx from "clsx";

import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { RollingText } from "@shared/ui/rolling-text";

import s from "./add-to-archive.module.scss";

export type AddToArchiveProps = {
  className?: string;
};

const PLACEHOLDER = "Paste a link — Letterboxd, IMDb, Spotify…";

export const AddToArchive = (props: AddToArchiveProps) => {
  const { className } = props;
  const [url, setUrl] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Layout stub — wiring later
  };

  return (
    <section className={clsx(s.root, className)} aria-label="Add to archive">
      <p className={clsx(s.label, "typo-micro")}>ADD TO ARCHIVE</p>
      <form className={s.form} onSubmit={handleSubmit}>
        <Input
          className={s.field}
          scheme="line"
          type="url"
          name="archive-url"
          value={url}
          placeholder={PLACEHOLDER}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => setUrl(event.target.value)}
        />
        <Button type="submit" className={s.submit} aria-label="Add to archive">
          <RollingText
            text="ADD"
            className={clsx(s.submitLabel, "typo-caption")}
          />
        </Button>
      </form>
    </section>
  );
};

AddToArchive.displayName = "AddToArchive";
