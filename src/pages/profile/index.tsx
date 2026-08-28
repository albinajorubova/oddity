import { withAuth } from "@entities/user";

import { ROUTES } from "@shared/config";
import { ProfilePage } from "@/_pages/profile/ui";

const Page = () => {
  return <ProfilePage />;
};

export const getServerSideProps = withAuth(async (context) => {
  if (!context.userIsAuthenticated) {
    return {
      redirect: {
        destination: `${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.profile)}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});

export default Page;
