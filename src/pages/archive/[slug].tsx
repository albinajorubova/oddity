import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import type { ArchiveDetail } from "@/_pages/archive-detail/model";
import { getArchiveDetailBySlug } from "@/_pages/archive-detail/model";
import { ArchiveDetailPage } from "@/_pages/archive-detail/ui";

type ArchivePageProps = {
  item: ArchiveDetail;
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

  if (!resolvedSlug) {
    return { notFound: true };
  }

  const item = getArchiveDetailBySlug(resolvedSlug);

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
