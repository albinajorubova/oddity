import type { BlocksContent } from "@strapi/blocks-react-renderer";

import type { MediaWithBreakpoints } from "@shared/types";

export type SectionData = {
  id: string;
};

export interface HomePageProps {
  media: MediaWithBreakpoints;
  title: string;
  blocks: SectionData[];
  content: BlocksContent;
}
