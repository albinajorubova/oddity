import { AdminPage } from "@/_pages/admin/ui";
import { isAdmin, withAuth } from "@entities/user";
import { ROUTES } from "@shared/config";

const Page = () => {
  return <AdminPage />;
};

export const getServerSideProps = withAuth(async (context) => {
  if (!context.userIsAuthenticated || !isAdmin(context.user)) {
    return {
      redirect: {
        destination: `${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.admin)}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});

export default Page;
