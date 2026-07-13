import type { DocumentActionComponent } from "@strapi/content-manager/strapi-admin";

import { useAutoSaveStore } from "../hooks/useAutoSaveStore";

export const createAutoSaveUpdateAction = (
  originalUpdateAction: DocumentActionComponent,
): DocumentActionComponent => {
  const AutoSaveUpdateAction: DocumentActionComponent = (props) => {
    const { status } = useAutoSaveStore();
    const baseAction = originalUpdateAction(props);

    if (!baseAction) return null;

    const isSaving = status === "saving";
    const isSaved = status === "saved";
    const shouldDisable =
      isSaved || (Boolean(baseAction.disabled) && status !== "unsaved");

    return {
      ...baseAction,
      label: isSaving ? "Saving…" : (baseAction.label ?? "Save"),
      loading: isSaving || Boolean(baseAction.loading),
      disabled: shouldDisable,
    };
  };

  AutoSaveUpdateAction.type = "update";
  AutoSaveUpdateAction.position = originalUpdateAction.position;

  return AutoSaveUpdateAction;
};
