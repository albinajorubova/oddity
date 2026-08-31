import { withAuth } from "@entities/user";

import { JoinPage } from "@/_pages/join/ui";

const Page = () => {
  return <JoinPage />;
};

export const getServerSideProps = withAuth();

export default Page;
