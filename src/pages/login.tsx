import { LoginPage } from "@/_pages/login/ui";
import { withAuth } from "@entities/user";

const Page = () => {
  return <LoginPage />;
};

export const getServerSideProps = withAuth();

export default Page;
