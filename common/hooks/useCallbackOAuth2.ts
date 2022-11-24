import { AuthContext } from "@/common/hooks/useAuth";
import useInitUserData from "@/common/hooks/useInitUserData";
import { fetchApi } from "@/common/utils";
import { APP_TOKEN_KEY } from "@/common/utils/constants";
import instance from "@/common/utils/fetch";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export type strategyName = "google" | "facebook";

export default function useCallbackOAuth2(strategyName: strategyName) {
  const initUserData = useInitUserData();
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);
  useEffect(() => {
    (async () => {
      if (strategyName) {
        let callbackURL = "";
        if (strategyName === "google") {
          callbackURL = process.env.NEXT_PUBLIC_CALLBACK_URL_GOOGLE;
        } else if (strategyName === "facebook") {
          callbackURL = process.env.NEXT_PUBLIC_CALLBACK_URL_FACEBOOK;
        }
        const { data } = await fetchApi<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth2/${strategyName}/init-data?callbackURL=${callbackURL}&` +
            new URLSearchParams(router.query as any).toString(),
          {},
          "post"
        );
        const { token, display_name } = data.data;
        localStorage.setItem(APP_TOKEN_KEY, token);
        dispatch({ type: "setAuthenticated", data: true });
        dispatch({ type: "setUser", data: display_name });
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await initUserData();
        router.push("/", {}, { shallow: false });
      }
    })();
  }, [strategyName]);
}
