import { getPublicCollectionItems } from "@entities/collection-card";
import { withAuth } from "@entities/user";

import { LabGalleryPage } from "@/_pages/lab-gallery/ui";

type LabGalleryPageProps = {
  items: Awaited<ReturnType<typeof getPublicCollectionItems>>;
};

const Page = ({ items }: LabGalleryPageProps) => {
  return <LabGalleryPage items={items} />;
};

export const getServerSideProps = withAuth(async () => {
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
});

export default Page;
