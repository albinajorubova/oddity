import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import type { CollectionDetail } from "@/_pages/collection-detail/model";
import { getCollectionDetailBySlug } from "@/_pages/collection-detail/model";
import { CollectionDetailPage } from "@/_pages/collection-detail/ui";

type CollectionDetailPageProps = {
  item: CollectionDetail;
  isDraftMode: boolean;
  cms: Record<string, never>;
};

const Page = ({
  item,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <CollectionDetailPage item={item} />;
};

export const getServerSideProps: GetServerSideProps<
  CollectionDetailPageProps
> = async (context) => {
  const slug = context.params?.slug;
  const resolvedSlug = Array.isArray(slug) ? slug[0] : slug;

  if (!resolvedSlug) {
    return { notFound: true };
  }

  const item = getCollectionDetailBySlug(resolvedSlug);

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
