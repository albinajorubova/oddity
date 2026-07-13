import type { PanelComponent } from "@strapi/content-manager/strapi-admin";

import { AutoSavePanelContent } from "./AutoSavePanelContent";

export const AutoSavePanel: PanelComponent = () => ({
  title: "Auto Save",
  content: <AutoSavePanelContent />,
});
