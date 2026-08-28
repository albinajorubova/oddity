"use client";

import { type FormEvent, useState } from "react";
import clsx from "clsx";

import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { RollingText } from "@shared/ui/rolling-text";
import {
  useArchiveLinksActions,
  useArchiveLinksStore,
} from "@/_pages/admin/model";

import s from "./add-to-archive.module.scss";

export type AddToArchiveProps = {
  className?: string;
};

const PLACEHOLDER = "Paste a YouTube Music link — song or album…";

export const AddToArchive = (props: AddToArchiveProps) => {
  const { className } = props;
  const [url, setUrl] = useState("");
  const isLoading = useArchiveLinksStore((state) => state.isLoading);
  const error = useArchiveLinksStore((state) => state.error);
  const { addFromUrl, clearError } = useArchiveLinksActions();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || isLoading) return;

    const ok = await addFromUrl(trimmed);
    if (ok) setUrl("");
  };

  return (
    <section className={clsx(s.root, className)} aria-label="Add to archive">
      <p className={clsx(s.label, "typo-micro")}>ADD TO ARCHIVE</p>
      <form className={s.form} onSubmit={handleSubmit}>
        <Input
          className={clsx(s.field, isLoading && s.loading)}
          scheme="line"
          type="url"
          name="archive-url"
          value={url}
          placeholder={PLACEHOLDER}
          autoComplete="off"
          spellCheck={false}
          disabled={isLoading}
          onChange={(event) => {
            if (error) clearError();
            setUrl(event.target.value);
          }}
        />
        <Button
          type="submit"
          className={s.submit}
          aria-label="Add to archive"
          disabled={isLoading}
        >
          <RollingText
            text={isLoading ? "…" : "ADD"}
            className={clsx(s.submitLabel, "typo-caption")}
          />
        </Button>
      </form>
      {error ? (
        <p className={clsx(s.error, "typo-caption")} role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
};

AddToArchive.displayName = "AddToArchive";
