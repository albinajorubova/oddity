import { HomePage } from "@/_pages/home/ui";

const Page = () => {
  return <HomePage />;
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
