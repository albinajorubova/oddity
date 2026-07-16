import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import type { ArchiveItem } from "@entities/archive-card";

import { ArchiveDetailPage } from "@/_pages/archive-detail/ui";
import { ARCHIVE_ITEMS_STUB } from "@/_pages/home/model";

type ArchivePageProps = {
  item: ArchiveItem;
  isDraftMode: boolean;
  cms: Record<string, never>;
};

const Page = ({
  item,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <ArchiveDetailPage item={item} />;
};

export const getServerSideProps: GetServerSideProps<ArchivePageProps> = async (
  context,
) => {
  const slug = context.params?.slug;
  const resolvedSlug = Array.isArray(slug) ? slug[0] : slug;

  const item = ARCHIVE_ITEMS_STUB.find((entry) => entry.slug === resolvedSlug);

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
};

export default Page;
