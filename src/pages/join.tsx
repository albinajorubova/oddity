import { JoinPage } from "@/_pages/join/ui";
import { withAuth } from "@entities/user";

const Page = () => {
  return <JoinPage />;
};

export const getServerSideProps = withAuth();

export default Page;
