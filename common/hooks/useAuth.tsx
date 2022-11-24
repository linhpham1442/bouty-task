import { getMeProfile } from "@/common/api/user";
import RoleSelectionModal from "@/common/components/RoleSelectionModal";
import { IUserProfile, UserRole } from "@/common/types";
import { APP_TOKEN_KEY } from "@/common/utils/constants";
import instance from "@/common/utils/fetch";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { createContext, useCallback, useEffect, useReducer } from "react";

type Action =
  | { type: "setUser"; data: any }
  | { type: "setProfile"; data: any }
  | { type: "setAuthenticated"; data: any }
  | { type: "setInitial"; data: any }
  | { type: "setRole"; data: UserRole }
  | { type: "setInitialState" }
  | { type: "reset" };
type Dispatch = (action: Action) => void;

export type AuthContextState = {
  user: string;
  isAuthenticated: boolean;
  isInitial: boolean;
  profile: IUserProfile;
};
type AuthProviderProps = { children: React.ReactNode };

const initialState: AuthContextState = {
  user: "",
  isAuthenticated: false,
  isInitial: false,
  profile: {} as IUserProfile,
};

export const AuthContext = createContext<{ state: AuthContextState; dispatch: Dispatch } | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    //Init data from api
    const token = localStorage.getItem(APP_TOKEN_KEY);
    if (token) {
      (async () => {
        try {
          const { data } = (await getMeProfile()).data;
          dispatch({
            type: "setInitialState",
            data: {
              isAuthenticated: true,
              isInitial: true,
              user: data.display_name,
              profile: {
                avatar: data.avatar,
                display_name: data.display_name,
                id: data._id,
                role: data.role,
                wallet_id: data.wallet_id,
              },
            } as AuthContextState,
          });
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);
  const value = { state, dispatch };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <RoleSelectionModal
        isOpen={UserRole.none === state?.profile?.role}
        userId={state?.profile?.id}
        onSubmitRole={(role: UserRole) => {
          dispatch({
            type: "setRole",
            data: role,
          });
        }}
      />
    </AuthContext.Provider>
  );
};

const reducer = (state: typeof initialState, action: any) => {
  switch (action.type) {
    case "setUser":
      return {
        ...state,
        user: action.data,
      };
    case "setProfile":
      return {
        ...state,
        profile: action.data,
      };
    case "setAuthenticated":
      return {
        ...state,
        isAuthenticated: action.data,
      };
    case "setInitial":
      return {
        ...state,
        isInitial: action.data,
      };
    case "setInitialState":
      return {
        ...state,
        ...action.data,
      };
    case "setRole":
      return {
        ...state,
        profile: {
          ...state.profile,
          role: action.data,
        },
      };

    case "reset":
      return initialState;

    default:
      return state;
  }
};

export const useAuth = () => {
  const { state, dispatch } = React.useContext(AuthContext);
  const router = useRouter();
  const loginWithGoogle = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth2/google/request?callbackURL=${process.env.NEXT_PUBLIC_CALLBACK_URL_GOOGLE}`, "_self");
  };

  const loginWithFacebook = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth2/facebook/request?callbackURL=${process.env.NEXT_PUBLIC_CALLBACK_URL_FACEBOOK}`, "_self");
  };

  const logout = async () => {
    localStorage.removeItem(APP_TOKEN_KEY);
    instance.defaults.headers.common["Authorization"] = ``;
    // dispatch({ type: "reset" });
    window.location.href = "/top-tasks";
  };

  useEffect(() => {
    dispatch({ type: "setInitial", data: true });

    const accessToken = localStorage.getItem(APP_TOKEN_KEY);

    if (accessToken) {
      const decoded: any = jwt_decode(accessToken);
      dispatch({ type: "setUser", data: decoded.verifiedAddress });
      dispatch({ type: "setAuthenticated", data: true });
    }
  }, []);

  return {
    user: state.user,
    isInitial: state.isInitial,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    isAuthenticated: state.isAuthenticated,
    profile: state.profile,
  };
};
