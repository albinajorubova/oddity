import type { GetServerSideProps } from "next";

import {
  getPublicCollectionItems,
  mapCollectionItemToOrbitItem,
} from "@entities/collection-card";

import { HomePage } from "@/_pages/home/ui";

type HomePageProps = {
  orbitItems: ReturnType<typeof mapCollectionItemToOrbitItem>[];
};

const Page = ({ orbitItems }: HomePageProps) => {
  return <HomePage orbitItems={orbitItems} />;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const items = await getPublicCollectionItems();
    const orbitItems = items.slice(0, 6).map((item, index, arr) =>
      mapCollectionItemToOrbitItem(item, {
        expand: index === arr.length - 1,
      }),
    );

    return {
      props: { orbitItems },
    };
  } catch {
    return {
      props: { orbitItems: [] },
    };
  }
};

export default Page;
