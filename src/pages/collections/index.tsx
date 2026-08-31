import type { GetServerSideProps } from "next";

import { getPublicCollectionItems } from "@entities/collection-card";

import { CollectionsPage } from "@/_pages/collections/ui";

type CollectionsPageProps = {
  items: Awaited<ReturnType<typeof getPublicCollectionItems>>;
};

const Page = ({ items }: CollectionsPageProps) => {
  return <CollectionsPage items={items} />;
};

export const getServerSideProps: GetServerSideProps<
  CollectionsPageProps
> = async () => {
  try {
    const items = await getPublicCollectionItems();

    return {
      props: { items },
    };
  } catch {
    return {
      props: { items: [] },
    };
  }
};

export default Page;
