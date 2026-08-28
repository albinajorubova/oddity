import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

import { getUser } from "../api";
import { AUTH_COOKIE_NAME } from "../model/constants";
import type { User } from "../model/types";

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
    const token = context.req.cookies[AUTH_COOKIE_NAME];
    let user: User | null = null;
    let userIsAuthenticated = false;

    if (token) {
      try {
        user = await getUser(token);
        userIsAuthenticated = true;
      } catch {
        user = null;
        userIsAuthenticated = false;
      }
    }

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
