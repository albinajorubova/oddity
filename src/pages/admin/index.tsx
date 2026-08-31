import type { ComponentProps } from "react";

import { cardError } from "@entities/card/lib/logger";
import { isAdmin, withAuth } from "@entities/user";

import { ROUTES } from "@shared/config";
import { getAdminCards } from "@/_pages/admin/api/get-admin-cards";
import { AdminPage } from "@/_pages/admin/ui";

const Page = (props: ComponentProps<typeof AdminPage>) => {
  return <AdminPage {...props} />;
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

  try {
    const cards = await getAdminCards();

    return {
      props: { cards },
    };
  } catch (error) {
    cardError("admin/getServerSideProps:failed", error);

    return {
      props: { cards: [] },
    };
  }
});

export default Page;
