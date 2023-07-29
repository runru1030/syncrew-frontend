"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  getRefreshTokenFromCookie,
  setRefreshTokenToCookie,
} from "../serverAuth";
import { useSetAtom } from "jotai";
import { isLoggedInAtom, userAtom } from "@app/GlobalProvider";
import { useResetAtom } from "jotai/utils";
import { cookies } from "next/dist/client/components/headers";
const useAuth = () => {
  const setUserAtom = useSetAtom(userAtom);
  const resetUserAtom = useResetAtom(userAtom);
  const setIsLoggedInAtom = useSetAtom(isLoggedInAtom);
  const resetIsLoggedInAtom = useResetAtom(userAtom);

  useQuery(["reissue"], {
    queryFn: async () => {
      const refresh = (await getRefreshTokenFromCookie())?.value || "";
      if (refresh === "") throw new Error("logout");

      return { data: { access_token: "Test", refresh_token: "test" } };
    },
    onSuccess: ({ data }) => {
      const { access_token, refresh_token } = data;
      axios.defaults.headers.common["Authorization"] = `${access_token}`;
      setRefreshTokenToCookie(refresh_token);
      setUserAtom({
        id: 1,
        username: "김지현",
        email: "test@example.com",
        temp: 36.5,
      });
      setIsLoggedInAtom(true);
    },
    onError: (err) => {
      console.error(err);
      resetUserAtom();
      resetIsLoggedInAtom();
    },
  });

  return;
};

export default useAuth;
