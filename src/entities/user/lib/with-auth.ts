import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

import type { User } from "../model/types";
import { resolveSessionFromRequest } from "./resolve-session";

export type AuthPageContext = GetServerSidePropsContext & {
  user: User | null;
  userIsAuthenticated: boolean;
};

type AuthGetServerSideProps = (
  context: AuthPageContext,
) => Promise<GetServerSidePropsResult<Record<string, unknown>>>;

export const withAuth = (
  getServerSidePropsFunc?: AuthGetServerSideProps,
): GetServerSideProps => {
  return async (context) => {
    const { user, userIsAuthenticated } = await resolveSessionFromRequest(
      context.req,
    );

    const authContext: AuthPageContext = {
      ...context,
      user,
      userIsAuthenticated,
    };

    const additionalProps = getServerSidePropsFunc
      ? await getServerSidePropsFunc(authContext)
      : { props: {} };

    if ("redirect" in additionalProps || "notFound" in additionalProps) {
      return additionalProps;
    }

    return {
      props: {
        ...additionalProps.props,
        user,
        userIsAuthenticated,
      },
    };
  };
};
