import { useCallback, useEffect, useRef, useState } from "react";
import {
  unstable_useContentManagerContext as useContentManagerContext,
  unstable_useDocumentActions as useDocumentActions,
} from "@strapi/strapi/admin";

import { setAutoSaveState } from "../store/autoSaveStore";
import { DEBOUNCE_MS, SINGLE_TYPES } from "../utils/constants";
import { hasUserContent } from "../utils/hasUserContent";

import type { AutoSaveStatus } from "../store/autoSaveStore";

type ContentManagerForm = {
  modified: boolean;
  values: Record<string, unknown>;
  initialValues: Record<string, unknown>;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof SyntaxError) {
    return "Server returned an invalid response. Please try saving manually.";
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Auto-save failed";
};

const buildUpdateArgs = (
  collectionType: string,
  model: string,
  documentId: string | null,
) => ({
  collectionType,
  model,
  ...(collectionType !== SINGLE_TYPES && documentId
    ? { documentId }
    : {}),
});

const resolveDocumentId = (
  values: Record<string, unknown>,
  initialValues: Record<string, unknown>,
  contextId: string | undefined,
  createdId: string | null,
) => {
  const candidates = [
    createdId,
    values.documentId,
    initialValues.documentId,
    contextId,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate && candidate !== "create") {
      return candidate;
    }
  }

  return null;
};

const isDuplicateDraftError = (message: string) =>
  message.includes("already exists") && message.includes("documentId");

export const useAutoSave = () => {
  const {
    form,
    model,
    id: documentId,
    collectionType,
    isCreatingEntry,
  } = useContentManagerContext();

  const { modified: isModified, values, initialValues } = form as ContentManagerForm;
  const { update, create } = useDocumentActions();

  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const ctxRef = useRef({
    isModified,
    isCreatingEntry,
    values,
    initialValues,
    model,
    documentId,
    collectionType,
  });

  ctxRef.current = {
    isModified,
    isCreatingEntry,
    values,
    initialValues,
    model,
    documentId,
    collectionType,
  };

  const updateRef = useRef(update);
  const createRef = useRef(create);

  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    createRef.current = create;
  }, [create]);

  const createdDocIdRef = useRef<string | null>(null);
  const isSavingInFlightRef = useRef(false);

  useEffect(() => {
    const resolvedId = resolveDocumentId(
      values,
      initialValues,
      documentId,
      createdDocIdRef.current,
    );

    if (resolvedId) {
      createdDocIdRef.current = resolvedId;
      return;
    }

    if (!isCreatingEntry) {
      createdDocIdRef.current = null;
    }
  }, [documentId, initialValues, isCreatingEntry, values]);

  const performSave = useCallback(async () => {
    if (isSavingInFlightRef.current) return;

    const {
      isCreatingEntry: creating,
      isModified: modified,
      values: currentValues,
      initialValues: currentInitialValues,
      model: currentModel,
      documentId: currentDocumentId,
      collectionType: currentCollectionType,
    } = ctxRef.current;

    if (!modified) return;

    const effectiveDocId = resolveDocumentId(
      currentValues,
      currentInitialValues,
      currentDocumentId,
      createdDocIdRef.current,
    );

    const isNewEntry =
      currentCollectionType !== SINGLE_TYPES &&
      !effectiveDocId &&
      (creating || !currentDocumentId || currentDocumentId === "create");

    if (isNewEntry && !hasUserContent(currentValues)) return;

    isSavingInFlightRef.current = true;
    setStatus("saving");
    setSaveError(null);
    setAutoSaveState({ status: "saving", saveError: null });

    try {
      let result: Awaited<ReturnType<typeof update>> | Awaited<ReturnType<typeof create>>;

      if (isNewEntry) {
        result = await createRef.current(
          { model: currentModel },
          currentValues as never,
        );

        const createdDocument = result as {
          data?: { documentId?: string; id?: string };
          documentId?: string;
          id?: string;
          error?: { message?: string };
        };

        const newId =
          createdDocument?.data?.documentId ??
          createdDocument?.documentId ??
          createdDocument?.data?.id ??
          createdDocument?.id;

        if (newId && currentCollectionType !== SINGLE_TYPES) {
          createdDocIdRef.current = String(newId);
          const nextPath = `/admin/content-manager/${currentCollectionType}/${currentModel}/${newId}`;
          window.history.replaceState(null, "", nextPath);
        }
      } else if (
        currentCollectionType === SINGLE_TYPES ||
        effectiveDocId
      ) {
        result = await updateRef.current(
          buildUpdateArgs(
            currentCollectionType,
            currentModel,
            effectiveDocId,
          ),
          currentValues as never,
        );
      } else {
        return;
      }

      if (result && "error" in result && result.error) {
        const message = getErrorMessage(result.error);
        const fallbackDocId = resolveDocumentId(
          currentValues,
          currentInitialValues,
          currentDocumentId,
          createdDocIdRef.current,
        );

        if (isNewEntry && fallbackDocId && isDuplicateDraftError(message)) {
          createdDocIdRef.current = fallbackDocId;
          result = await updateRef.current(
            buildUpdateArgs(
              currentCollectionType,
              currentModel,
              fallbackDocId,
            ),
            currentValues as never,
          );
        }

        if (result && "error" in result && result.error) {
          const retryMessage = getErrorMessage(result.error);
          setSaveError(retryMessage);
          setStatus("error");
          setAutoSaveState({ status: "error", saveError: retryMessage });
          return;
        }
      }

      const now = new Date();
      setLastSavedAt(now);
      setStatus("saved");
      setAutoSaveState({
        status: "saved",
        lastSavedAt: now,
        saveError: null,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      setSaveError(message);
      setStatus("error");
      setAutoSaveState({ status: "error", saveError: message });
    } finally {
      isSavingInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isModified) return;

    const {
      isCreatingEntry: creating,
      documentId: currentDocumentId,
      values: currentValues,
      initialValues: currentInitialValues,
      collectionType: currentCollectionType,
    } = ctxRef.current;

    const effectiveDocId = resolveDocumentId(
      currentValues,
      currentInitialValues,
      currentDocumentId,
      createdDocIdRef.current,
    );

    const isNewEntry =
      currentCollectionType !== SINGLE_TYPES &&
      !effectiveDocId &&
      (creating || !currentDocumentId || currentDocumentId === "create");

    if (isNewEntry && !hasUserContent(currentValues)) return;

    setStatus("unsaved");
    setAutoSaveState({ status: "unsaved" });

    const timer = window.setTimeout(() => {
      void performSave();
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [values, isModified, performSave]);

  useEffect(() => {
    if (!isModified && status !== "saving") {
      setStatus("idle");
      setAutoSaveState({ status: "idle" });
    }
  }, [isModified, status]);

  return {
    status,
    lastSavedAt,
    saveError,
    isModified,
    saveNow: performSave,
  };
};
