import type React from "react";

export type BlockWithIdAndComponent = {
  id: number;
  __component: string;
  sectionId?: string;
  [key: string]: unknown;
};

export interface DynamicZoneRendererProps {
  blocksData?: BlockWithIdAndComponent[];
  blocksSchema: Record<string, React.ComponentType<any>>;
  additionalData?: Record<BlockWithIdAndComponent["__component"], object>;
}

export const DynamicZoneRenderer = ({
  blocksData,
  blocksSchema,
  additionalData,
}: DynamicZoneRendererProps) => {
  return (
    <>
      {blocksData?.map((block) => {
        const blockUid = block.__component;
        const Component = blocksSchema[blockUid];

        if (!Component) return null;

        return (
          <Component
            key={block.id}
            sectionId={blockUid.split(".").pop()}
            {...additionalData?.[blockUid]}
            {...block}
          />
        );
      })}
    </>
  );
};
