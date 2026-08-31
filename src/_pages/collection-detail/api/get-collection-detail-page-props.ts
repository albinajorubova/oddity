import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import type { CollectionDetail } from "../model/types";
import { getCollectionDetailBySlug } from "./get-collection-detail-by-slug";

export type CollectionDetailPageProps = {
  item: CollectionDetail;
  isDraftMode: boolean;
  cms: Record<string, never>;
};

const resolveSlug = (slug: string | string[] | undefined): string | null => {
  if (!slug) return null;
  return Array.isArray(slug) ? (slug[0] ?? null) : slug;
};

export const getCollectionDetailPageProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CollectionDetailPageProps>> => {
  const resolvedSlug = resolveSlug(context.params?.slug);

  if (!resolvedSlug) {
    return { notFound: true };
  }

  try {
    const item = await getCollectionDetailBySlug(resolvedSlug);

    if (!item) {
      return { notFound: true };
    }

    return {
      props: {
        item,
        isDraftMode: false,
        cms: {},
      },
    };
  } catch {
    return { notFound: true };
  }
};
