import type { InferGetServerSidePropsType } from "next";

import {
  type CollectionDetailPageProps,
  getCollectionDetailPageProps,
} from "@/_pages/collection-detail/api/get-collection-detail-page-props";
import { CollectionDetailPage } from "@/_pages/collection-detail/ui";

const Page = ({
  item,
}: InferGetServerSidePropsType<typeof getCollectionDetailPageProps>) => {
  return <CollectionDetailPage item={item} />;
};

export const getServerSideProps = getCollectionDetailPageProps;

export default Page;

export type { CollectionDetailPageProps };
