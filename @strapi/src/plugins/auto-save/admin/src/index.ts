import { AutoSavePanel } from "./components/AutoSavePanel";
import { createAutoSaveUpdateAction } from "./documentActions/createAutoSaveUpdateAction";
import { PLUGIN_ID } from "./pluginId";

import type { StrapiApp } from "@strapi/admin/strapi-admin";

export default {
  register(app: StrapiApp) {
    app.registerPlugin({
      id: PLUGIN_ID,
      name: PLUGIN_ID,
    });
  },

  bootstrap(app: StrapiApp) {
    const contentManager = app.getPlugin("content-manager");

    if (!contentManager) return;

    contentManager.apis.addEditViewSidePanel([AutoSavePanel]);
    contentManager.apis.addDocumentAction((actions) =>
      actions.map((action) =>
        action.type === "update"
          ? createAutoSaveUpdateAction(action)
          : action,
      ),
    );
  },
};
