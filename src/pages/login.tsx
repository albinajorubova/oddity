import { withAuth } from "@entities/user";

import { LoginPage } from "@/_pages/login/ui";

const Page = () => {
  return <LoginPage />;
};

export const getServerSideProps = withAuth();

export default Page;
