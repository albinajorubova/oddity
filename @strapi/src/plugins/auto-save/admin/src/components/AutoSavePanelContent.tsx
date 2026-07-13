import {
  Badge,
  Box,
  Flex,
  Typography,
} from "@strapi/design-system";
import {
  Check,
  Clock,
  Loader,
  WarningCircle,
} from "@strapi/icons";
import {
  unstable_useContentManagerContext as useContentManagerContext,
} from "@strapi/strapi/admin";

import { useAutoSave } from "../hooks/useAutoSave";
import { getChangedFields } from "../utils/getChangedFields";

import type { AutoSaveStatus } from "../store/autoSaveStore";
import type { FC, SVGProps } from "react";

type StatusConfig = {
  label: string;
  color: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
};

const STATUS_CONFIG: Record<AutoSaveStatus, StatusConfig> = {
  idle: { label: "All changes saved", color: "success600", Icon: Check },
  unsaved: {
    label: "Unsaved changes",
    color: "warning600",
    Icon: WarningCircle,
  },
  saving: { label: "Saving...", color: "primary600", Icon: Loader },
  saved: { label: "Saved", color: "success600", Icon: Check },
  error: { label: "Save failed", color: "danger600", Icon: WarningCircle },
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

type ContentManagerForm = {
  modified: boolean;
  values: Record<string, unknown>;
  initialValues: Record<string, unknown>;
};

export const AutoSavePanelContent = () => {
  const { form } = useContentManagerContext();
  const { modified: isModified, values, initialValues } = form as ContentManagerForm;
  const { status, lastSavedAt, saveError } = useAutoSave();

  const changedFields = isModified
    ? getChangedFields(values, initialValues)
    : [];
  const changedFieldCount = changedFields.length;
  const { label, color, Icon } = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;

  return (
    <Box padding={4} background="neutral0" hasRadius>
      <Flex
        alignItems="center"
        gap={2}
        marginBottom={lastSavedAt || (isModified && changedFieldCount > 0) ? 3 : 0}
      >
        <Icon width="16px" height="16px" fill={color} />
        <Typography variant="sigma" textColor={color}>
          {label}
        </Typography>
        {isModified && changedFieldCount > 0 ? (
          <Badge>{changedFieldCount}</Badge>
        ) : null}
      </Flex>

      {lastSavedAt ? (
        <Flex alignItems="center" gap={1} marginBottom={isModified ? 3 : 0}>
          <Clock width="12px" height="12px" fill="neutral500" />
          <Typography variant="pi" textColor="neutral500">
            Last saved at {formatTime(lastSavedAt)}
          </Typography>
        </Flex>
      ) : null}

      {status === "error" && saveError ? (
        <Box background="danger100" hasRadius padding={2} marginBottom={3}>
          <Typography variant="pi" textColor="danger600">
            {saveError}
          </Typography>
        </Box>
      ) : null}

      {isModified && changedFieldCount > 0 ? (
        <Box marginTop={3}>
          <Typography variant="pi" textColor="neutral600" fontWeight="semiBold">
            Modified fields:
          </Typography>
          <Flex gap={1} wrap="wrap" marginTop={2}>
            {changedFields.map((field) => (
              <Box
                key={field}
                background="warning100"
                hasRadius
                paddingTop={1}
                paddingBottom={1}
                paddingLeft={2}
                paddingRight={2}
              >
                <Typography variant="pi" textColor="warning700">
                  {field}
                </Typography>
              </Box>
            ))}
          </Flex>
        </Box>
      ) : null}
    </Box>
  );
};
