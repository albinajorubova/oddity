import { LabGalleryPage } from "@/_pages/lab-gallery/ui";

const Page = () => {
  return <LabGalleryPage />;
};

export async function getServerSideProps() {
  return {
    props: {
      isDraftMode: false,
      cms: {},
    },
  };
}

export default Page;
